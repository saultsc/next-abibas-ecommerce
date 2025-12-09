'use server';

import { prisma } from '@/lib';
import { revalidatePath } from 'next/cache';

export const deleteMaintenance = async (id: number) => {
	try {
		// Verificar que existe el mantenimiento
		const maintenance = await prisma.completed_maintenance.findUnique({
			where: {
				completed_maintenance_id: id,
			},
		});

		if (!maintenance) {
			return {
				ok: false,
				message: 'Mantenimiento no encontrado',
			};
		}

		// Soft delete: cambiar el estado a 'I' (Inactivo)
		await prisma.completed_maintenance.update({
			where: {
				completed_maintenance_id: id,
			},
			data: {
				state: 'I',
				updated_at: new Date(),
			},
		});

		revalidatePath('/system/maintenance');

		return {
			ok: true,
			message: 'Mantenimiento eliminado correctamente',
		};
	} catch (error) {
		console.error('Error al eliminar mantenimiento:', error);
		return {
			ok: false,
			message: 'Error al eliminar mantenimiento',
		};
	}
};
