'use server';

import { prisma } from '@/lib';

export const vehicleSearch = async () => {
	try {
		const vehicles = await prisma.vehicles.findMany({
			where: {
				state: 'A',
			},
			include: {
				vehicle_types: true,
			},
			orderBy: [
				{
					make: 'asc',
				},
				{
					model: 'asc',
				},
			],
		});

		// Serializar campos Decimal para pasar al cliente
		const serializedVehicles = JSON.parse(
			JSON.stringify(vehicles, (key, value) => {
				// Convertir objetos Decimal a number
				if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
					return Number(value);
				}
				return value;
			})
		);

		return {
			ok: true,
			vehicles: serializedVehicles,
		};
	} catch (error) {
		console.error('Error al buscar vehículos:', error);
		return {
			ok: false,
			message: 'Error al buscar vehículos',
		};
	}
};
