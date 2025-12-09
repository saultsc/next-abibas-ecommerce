'use server';

import { Response } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';
import { me } from '../auth/me';

interface CreateOrderInput {
	shippingAddressId: number;
	items: {
		variantId: number;
		quantity: number;
		unitPrice: number;
	}[];
	subtotal: number;
	taxAmount: number;
	shippingCost?: number;
	discountAmount?: number;
	totalAmount: number;
	notes?: string;
}

export const createOrder = async (
	input: CreateOrderInput
): Promise<Response<{ order_id: number; order_number: string }>> => {
	try {
		// Verificar que el usuario esté logueado
		const userResult = await me();
		if (!userResult.success || !userResult.data) {
			throw CustomError.unauthorized(ErrorCode.UNAUTHORIZED);
		}

		// Verificar que el usuario tenga un customer asociado
		const customer = await prisma.customers.findUnique({
			where: { user_id: userResult.data.user_id },
		});

		if (!customer) {
			throw CustomError.badRequest(
				ErrorCode.VALIDATION_ERROR,
				'Usuario no tiene perfil de cliente'
			);
		}

		// Generar número de orden único
		const orderNumber = `ORD-${Date.now()}-${Math.random()
			.toString(36)
			.substring(2, 9)
			.toUpperCase()}`;

		// Obtener el estado "Pendiente" o el primer estado disponible
		const orderStatus = await prisma.order_statuses.findFirst({
			where: {
				OR: [{ status_name: 'Pendiente' }, { status_name: 'Pending' }],
			},
		});

		if (!orderStatus) {
			throw CustomError.internal(ErrorCode.INTERNAL_ERROR);
		}

		// Crear la orden en una transacción
		const order = await prisma.$transaction(async (tx) => {
			// Crear la orden
			const newOrder = await tx.orders.create({
				data: {
					order_number: orderNumber,
					customer_id: customer.customer_id,
					shipping_address_id: input.shippingAddressId,
					order_status_id: orderStatus.order_status_id,
					subtotal: input.subtotal,
					tax_amount: input.taxAmount,
					shipping_cost: input.shippingCost || 0,
					discount_amount: input.discountAmount || 0,
					total_amount: input.totalAmount,
					notes: input.notes,
					state: 'A',
				},
			});

			// Crear los items de la orden y actualizar stock
			for (const item of input.items) {
				// Verificar stock disponible
				const variant = await tx.product_variants.findUnique({
					where: { variant_id: item.variantId },
				});

				if (!variant || variant.stock_quantity < item.quantity) {
					throw CustomError.badRequest(
						ErrorCode.VALIDATION_ERROR,
						`Stock insuficiente para el producto con ID ${item.variantId}`
					);
				}

				// Crear el item de la orden
				await tx.order_items.create({
					data: {
						order_id: newOrder.order_id,
						variant_id: item.variantId,
						quantity: item.quantity,
						unit_price: item.unitPrice,
						discount: 0,
						subtotal: item.unitPrice * item.quantity,
					},
				});

				// Actualizar el stock
				await tx.product_variants.update({
					where: { variant_id: item.variantId },
					data: {
						stock_quantity: {
							decrement: item.quantity,
						},
					},
				});
			}

			return newOrder;
		});

		return {
			success: true,
			data: {
				order_id: order.order_id,
				order_number: order.order_number,
			},
			message: 'Orden creada exitosamente',
			code: 201,
		};
	} catch (error) {
		console.error('Error al crear orden:', error);

		if (error instanceof CustomError) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al crear la orden',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
