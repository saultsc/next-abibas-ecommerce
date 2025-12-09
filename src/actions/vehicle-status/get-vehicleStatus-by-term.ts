'use server';

import { Response, VehicleStatus, VehicleStatusWhereInput } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';

export const getVehicleStatusByTerm = async (term: string): Promise<Response<VehicleStatus>> => {
	const isNumeric = !isNaN(Number(term));

	const where: VehicleStatusWhereInput = {
		...(isNumeric ? { vehicle_status_id: Number(term) } : { status_name: term }),
	};

	try {
		const vehicleStatus = await prisma.vehicle_statuses.findFirst({
			where,
		});

		if (!vehicleStatus) throw CustomError.notFound(ErrorCode.STATUS_VEHICLE_NOT_FOUND);
		return {
			success: true,
			data: vehicleStatus,
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
			message: 'Error al obtener el tipo de estado del vehículo',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
