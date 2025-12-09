'use server';

import { Response, VehicleType } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';
import { revalidatePath } from 'next/cache';

export const deleteVehicleType = async (
	vehicle_type_id: number
): Promise<Response<VehicleType>> => {
	try {
		const isExisting = await prisma.vehicle_types.findUnique({
			where: { vehicle_type_id },
		});

		if (!isExisting) {
			return {
				success: false,
				message: 'Tipo de vehículo no encontrado',
			};
		}

		const existingReferences = await prisma.vehicle_types.findFirst({
			where: { vehicle_type_id },
			select: { vehicles: true },
		});

		if (existingReferences && existingReferences.vehicles.length > 0) {
			throw new CustomError(ErrorCode.CATEGORY_HAS_PRODUCTS);
		}

		await prisma.vehicle_types.delete({
			where: { vehicle_type_id },
		});

		revalidatePath('/system/vehicleTypes');

		return {
			success: true,
			message: 'Tipo de vehículo eliminado exitosamente',
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
			message: 'Error al eliminar el tipo de vehículo',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
