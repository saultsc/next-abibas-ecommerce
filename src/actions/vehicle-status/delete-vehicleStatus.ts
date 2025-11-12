'use server';

import { Response, VehicleStatus } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prismaClient from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteVehicleStatus = async (
	vehicle_status_id: number
): Promise<Response<VehicleStatus>> => {
	try {
		const isExisting = await prismaClient.vehicle_statuses.findUnique({
			where: { vehicle_status_id },
		});

		if (!isExisting) {
			return {
				success: false,
				message: 'Tipo de vehículo no encontrado',
			};
		}

		const existingReferences = await prismaClient.vehicle_statuses.findFirst({
			where: { vehicle_status_id },
			select: { vehicles: true },
		});

		if (existingReferences && existingReferences.vehicles.length > 0) {
			throw new CustomError(ErrorCode.CATEGORY_HAS_PRODUCTS);
		}

		await prismaClient.vehicle_statuses.delete({
			where: { vehicle_status_id },
		});

		revalidatePath('/system/vehicleStatus');

		return {
			success: true,
			message: 'Estado de vehículo eliminado exitosamente',
		};
	} catch (error) {
		if (CustomError.isCustomError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al eliminar el estado de vehículo',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
