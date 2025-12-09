'use server';

import { prisma } from '@/lib';

export const maintenanceTypeSearch = async () => {
	try {
		const maintenanceTypes = await prisma.maintenance_types.findMany({
			where: {
				state: 'A',
			},
			orderBy: {
				type_name: 'asc',
			},
		});

		return {
			ok: true,
			maintenanceTypes,
		};
	} catch (error) {
		console.error('Error al buscar tipos de mantenimiento:', error);
		return {
			ok: false,
			message: 'Error al buscar tipos de mantenimiento',
		};
	}
};
