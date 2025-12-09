'use server';

import { prisma } from '@/lib';

export const getMaintenancePartsByMaintenanceId = async (maintenanceId: number) => {
	try {
		const parts = await prisma.maintenance_parts.findMany({
			where: {
				completed_maintenance_id: maintenanceId,
				state: 'A',
			},
			orderBy: {
				created_at: 'desc',
			},
		});

		// Serializar para convertir Decimal a número
		const serializedParts = JSON.parse(
			JSON.stringify(parts, (key, value) => {
				// Detectar Decimal por el nombre del constructor
				if (value && typeof value === 'object' && value.constructor.name === 'Decimal') {
					return Number(value);
				}
				return value;
			})
		);

		return {
			ok: true,
			parts: serializedParts,
		};
	} catch (error) {
		console.error('Error al obtener partes de mantenimiento:', error);
		return {
			ok: false,
			message: 'Error al obtener partes de mantenimiento',
		};
	}
};
