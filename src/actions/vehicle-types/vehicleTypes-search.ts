'use server';

import { Response, VehicleType, VehicleTypeWhereInput } from '@/interfaces';
import prismaClient from '@/lib/prisma';

export const searchVehicleTypes = async (term: string): Promise<Response<VehicleType[]>> => {
	const where: VehicleTypeWhereInput = {
		...(term
			? !isNaN(Number(term))
				? { vehicle_type_id: Number(term) }
				: { type_name: { contains: term } }
			: {}),
		...{ state: 'A' },
	};

	try {
		const vehicleTypes = await prismaClient.vehicle_types.findMany({
			where,
		});

		return { success: true, data: vehicleTypes, message: 'Vehicle types encontradas' };
	} catch (error) {
		return { success: false, message: 'Error searching vehicle types' };
	}
};
