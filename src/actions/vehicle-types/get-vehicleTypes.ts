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

		return {
			ok: true,
			data: vehicleTypes,
		};
	} catch (error) {
		console.log(error);
		return {
			ok: false,
			data: [],
		};
	}
};
