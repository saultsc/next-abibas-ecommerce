'use server';

import { prisma } from '@/lib';

export const getMaintenanceById = async (id: number) => {
	try {
		const maintenance = await prisma.completed_maintenance.findUnique({
			where: {
				completed_maintenance_id: id,
			},
			include: {
				vehicles: {
					include: {
						vehicle_types: true,
					},
				},
				maintenance_types: true,
				suppliers: true,
				maintenance_parts: true,
				maintenance_documents: true,
			},
		});

		if (!maintenance) {
			return {
				ok: false,
				message: 'Mantenimiento no encontrado',
			};
		}

		// Serializar los campos Decimal para evitar errores en componentes cliente
		const serializedMaintenance = JSON.parse(
			JSON.stringify(maintenance, (key, value) => {
				// Convertir objetos Decimal a números
				if (value?.constructor?.name === 'Decimal') {
					return Number(value);
				}
				return value;
			})
		);

		return {
			ok: true,
			maintenance: serializedMaintenance,
		};
	} catch (error) {
		console.error('Error al obtener mantenimiento:', error);
		return {
			ok: false,
			message: 'Error al obtener mantenimiento',
		};
	}
};
