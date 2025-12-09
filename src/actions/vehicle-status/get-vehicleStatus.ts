'use server';

import { prisma } from '@/lib';

export const getVehicleStatuses = async () => {
	try {
		const vehicleStatuses = await prisma.vehicle_statuses.findMany({
			where: {
				state: 'A',
			},
			orderBy: {
				status_name: 'asc',
			},
		});

		return {
			ok: true,
			data: vehicleStatuses,
		};
	} catch (error) {
		console.log(error);
		return {
			ok: false,
			data: [],
		};
	}
};
