'use server';

import { VehicleInclude, VehicleWhereInput } from '@/interfaces';
import prisma from '@/lib/prisma';

interface Params {
	page?: number;
	take?: number;
}

export const getPaginatedVehicles = async (params: Params) => {
	const { page = 1, take = 10 } = params;
	const skip = (page - 1) * take;

	const where: VehicleWhereInput = {};

	const include: VehicleInclude = {
		vehicle_types: {
			select: {
				type_name: true,
				description: true,
			},
		},
		vehicle_statuses: {
			select: {
				status_name: true,
			},
		},
		suppliers: {
			select: {
				company_name: true,
			},
		},
	};

	try {
		const [vehicles, totalCount] = await Promise.all([
			prisma.vehicles.findMany({
				take,
				skip,
				where,
				include: include,
			}),
			prisma.vehicles.count(),
		]);

		const totalPages = Math.ceil(totalCount / take);

		return {
			currentPage: page,
			totalPages: totalPages,
			data: vehicles,
		};
	} catch (error) {
		console.error(error);
		return {
			currentPage: 0,
			totalPages: 0,
			data: [],
		};
	}
};
