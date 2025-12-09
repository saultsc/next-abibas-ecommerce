'use server';

import { prisma } from '@/lib';

export const getVehicleById = async (vehicleId: number) => {
	try {
		const vehicle = await prisma.vehicles.findUnique({
			where: {
				vehicle_id: vehicleId,
			},
			include: {
				vehicle_types: true,
				vehicle_statuses: true,
				suppliers: true,
			},
		});

		if (!vehicle) {
			return {
				ok: false,
				message: 'Vehículo no encontrado',
			};
		}

		// Convertir todos los campos Decimal a number usando JSON
		const serializedVehicle = JSON.parse(
			JSON.stringify(vehicle, (key, value) => {
				// Convertir objetos Decimal a number
				if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
					return Number(value);
				}
				return value;
			})
		);

		return {
			ok: true,
			vehicle: serializedVehicle,
		};
	} catch (error) {
		console.error('Error al obtener vehículo:', error);
		return {
			ok: false,
			message: 'Error al obtener vehículo',
		};
	}
};
