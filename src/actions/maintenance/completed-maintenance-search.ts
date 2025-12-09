'use server';

import { prisma } from '@/lib';

interface PaginationOptions {
	page?: number;
	take?: number;
	vehicleId?: number;
	maintenanceTypeId?: number;
	supplierId?: number;
}

export const completedMaintenanceSearch = async (options: PaginationOptions = {}) => {
	try {
		const { page = 1, take = 10, vehicleId, maintenanceTypeId, supplierId } = options;

		const where: any = {
			state: 'A',
		};

		if (vehicleId) {
			where.vehicle_id = vehicleId;
		}

		if (maintenanceTypeId) {
			where.maintenance_type_id = maintenanceTypeId;
		}

		if (supplierId) {
			where.supplier_id = supplierId;
		}

		const [maintenances, totalCount] = await Promise.all([
			prisma.completed_maintenance.findMany({
				where,
				include: {
					vehicles: {
						include: {
							vehicle_types: true,
						},
					},
					maintenance_types: true,
					suppliers: true,
					maintenance_parts: {
						where: {
							state: 'A',
						},
					},
				},
				orderBy: {
					start_date: 'desc',
				},
				skip: (page - 1) * take,
				take,
			}),
			prisma.completed_maintenance.count({ where }),
		]);

		const totalPages = Math.ceil(totalCount / take);

		return {
			ok: true,
			maintenances,
			currentPage: page,
			totalPages,
			totalCount,
		};
	} catch (error) {
		console.error('Error al buscar mantenimientos completados:', error);
		return {
			ok: false,
			message: 'Error al buscar mantenimientos completados',
		};
	}
};
