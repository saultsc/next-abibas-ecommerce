'use server';

import { VehicleType, VehicleTypesWhereInput, Response } from '@/interfaces';
import { AppError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const getVehicleTypeByTerm = async (term: string): Promise<Response<VehicleType>> => {
	const isNumeric = !isNaN(Number(term));

	const where: VehicleTypesWhereInput = {
		...(isNumeric ? { vehicle_type_id: Number(term) } : { type_name: term }),
	};

	try {
		const vehicleType = await prisma.vehicle_types.findFirst({
			where,
		});

		if (!vehicleType) throw AppError.notFound(ErrorCode.VEHICLE_TYPE_NOT_FOUND);

		return {
			success: true,
			data: {
				...vehicleType,
				load_capacity_kg: vehicleType.load_capacity_kg.toNumber(),
			},
		};
	} catch (error) {
		if (AppError.isAppError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}
		return {
			success: false,
			message: 'Error al obtener el tipo de vehículo',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};

