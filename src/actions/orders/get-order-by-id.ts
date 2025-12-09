'use server';

import { Order, Response } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';
import { me } from '../auth/me';

export const getOrderById = async (orderId: number): Promise<Response<Order>> => {
	try {
		// Verificar que el usuario esté logueado
		const userResult = await me();
		if (!userResult.success || !userResult.data) {
			throw CustomError.unauthorized(ErrorCode.UNAUTHORIZED);
		}

		// Obtener el customer del usuario, si no existe crearlo
		let customer = await prisma.customers.findUnique({
			where: { user_id: userResult.data.user_id },
		});

		if (!customer) {
			// Crear automáticamente el customer si no existe
			customer = await prisma.customers.create({
				data: {
					user_id: userResult.data.user_id,
					person_id: userResult.data.person_id,
					loyalty_points: 0,
					total_spent: 0,
					state: 'A',
				},
			});
		}

		// Obtener la orden
		const order = await prisma.orders.findFirst({
			where: {
				order_id: orderId,
				customer_id: customer.customer_id, // Solo puede ver sus propias órdenes
			},
			include: {
				order_statuses: true,
				addresses: {
					include: {
						cities: {
							include: {
								provinces: true,
							},
						},
					},
				},
				order_items: {
					include: {
						product_variants: {
							include: {
								products: {
									include: {
										product_images: true,
									},
								},
								sizes: true,
								colors: true,
							},
						},
					},
				},
			},
		});

		if (!order) {
			throw CustomError.notFound(ErrorCode.ORDER_NOT_FOUND, 'Orden no encontrada');
		}

		return {
			success: true,
			data: order as any,
			message: 'Orden obtenida exitosamente',
			code: 200,
		};
	} catch (error) {
		console.error('Error al obtener orden:', error);

		if (error instanceof CustomError) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener la orden',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
