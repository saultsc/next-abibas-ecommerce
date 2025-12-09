'use server';

import { Order, Response } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';
import { me } from '../auth/me';

export const getMyOrders = async (): Promise<Response<Order[]>> => {
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

		// Obtener las órdenes del cliente
		const orders = await prisma.orders.findMany({
			where: {
				customer_id: customer.customer_id,
			},
			include: {
				order_statuses: true,
				addresses: {
					include: {
						cities: true,
					},
				},
				order_items: {
					include: {
						product_variants: {
							include: {
								products: true,
								sizes: true,
								colors: true,
							},
						},
					},
				},
			},
			orderBy: {
				created_at: 'desc',
			},
		});

		return {
			success: true,
			data: orders as any,
			message: 'Órdenes obtenidas exitosamente',
			code: 200,
		};
	} catch (error) {
		console.error('Error al obtener órdenes:', error);

		if (error instanceof CustomError) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener las órdenes',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
