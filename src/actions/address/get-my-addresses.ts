'use server';

import { Address, Response } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';
import { me } from '../auth/me';

export const getMyAddresses = async (): Promise<Response<Address[]>> => {
	try {
		// Verificar que el usuario esté logueado
		const userResult = await me();
		if (!userResult.success || !userResult.data) {
			throw CustomError.unauthorized(ErrorCode.UNAUTHORIZED);
		}

		// Obtener el person_id del usuario
		const person_id = userResult.data.person_id;

		// Obtener las direcciones
		const addresses = await prisma.addresses.findMany({
			where: {
				person_id,
				state: 'A',
			},
			include: {
				cities: {
					include: {
						provinces: {
							include: {
								countries: true,
							},
						},
					},
				},
			},
			orderBy: [{ is_primary: 'desc' }, { created_at: 'desc' }],
		});

		return {
			success: true,
			data: addresses as any,
			message: 'Direcciones obtenidas exitosamente',
			code: 200,
		};
	} catch (error) {
		console.error('Error al obtener direcciones:', error);

		if (error instanceof CustomError) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener las direcciones',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
