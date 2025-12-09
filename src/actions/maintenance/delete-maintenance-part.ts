'use server';

import { prisma } from '@/lib';
import { revalidatePath } from 'next/cache';

export const deleteMaintenancePart = async (id: number) => {
	try {
		// Verificar que existe la parte
		const part = await prisma.maintenance_parts.findUnique({
			where: {
				maintenance_part_id: id,
			},
		});

		if (!part) {
			return {
				ok: false,
				message: 'Parte de mantenimiento no encontrada',
			};
		}

		// Soft delete: cambiar el estado a 'I' (Inactivo)
		await prisma.maintenance_parts.update({
			where: {
				maintenance_part_id: id,
			},
			data: {
				state: 'I',
				updated_at: new Date(),
			},
		});

		revalidatePath('/system/maintenance');

		return {
			ok: true,
			message: 'Parte eliminada correctamente',
		};
	} catch (error) {
		console.error('Error al eliminar parte de mantenimiento:', error);
		return {
			ok: false,
			message: 'Error al eliminar parte de mantenimiento',
		};
	}
};
