'use server';

import { prisma } from '@/lib';

export const getVehicleTypes = async () => {
	try {
		const vehicleTypes = await prisma.vehicle_types.findMany({
			where: {
				state: 'A',
			},
			orderBy: {
				type_name: 'asc',
			},
		});

		// Serializar campos Decimal para pasar al cliente
		const serializedVehicleTypes = vehicleTypes.map((vt) => ({
			...vt,
			load_capacity_kg: Number(vt.load_capacity_kg),
		}));

		return {
			ok: true,
			data: serializedVehicleTypes,
		};
	} catch (error) {
		console.log(error);
		return {
			ok: false,
			data: [],
		};
	}
};
