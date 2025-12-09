'use server';

import { prisma } from '@/lib';
import { revalidatePath } from 'next/cache';

export const deleteVehicle = async (vehicleId: number) => {
	try {
		// Verificar si el vehículo existe
		const vehicle = await prisma.vehicles.findUnique({
			where: { vehicle_id: vehicleId },
		});

		if (!vehicle) {
			return {
				ok: false,
				message: 'Vehículo no encontrado',
			};
		}

		// Verificar si tiene mantenimientos asociados
		const hasMaintenance = await prisma.completed_maintenance.findFirst({
			where: { vehicle_id: vehicleId },
		});

		if (hasMaintenance) {
			return {
				ok: false,
				message: 'No se puede eliminar el vehículo porque tiene mantenimientos registrados',
			};
		}

		// Verificar si tiene documentos asociados
		const hasDocuments = await prisma.vehicle_documents.findFirst({
			where: { vehicle_id: vehicleId },
		});

		if (hasDocuments) {
			return {
				ok: false,
				message: 'No se puede eliminar el vehículo porque tiene documentos asociados',
			};
		}

		// Soft delete
		await prisma.vehicles.update({
			where: { vehicle_id: vehicleId },
			data: {
				state: 'I',
				updated_at: new Date(),
			},
		});

		revalidatePath('/system/vehicles');

		return {
			ok: true,
			message: 'Vehículo eliminado exitosamente',
		};
	} catch (error) {
		console.error('Error al eliminar vehículo:', error);
		return {
			ok: false,
			message: 'Error al eliminar el vehículo',
		};
	}
};
