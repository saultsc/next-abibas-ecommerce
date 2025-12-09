'use server';

import { Response, VehicleDocumentType, vehicle_document_typesWhereInput } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';

export const getVehicleDocumentTypesByTerm = async (
	term: string
): Promise<Response<VehicleDocumentType>> => {
	const isNumeric = !isNaN(Number(term));

	const where: vehicle_document_typesWhereInput = {
		...(isNumeric ? { document_type_id: Number(term) } : { type_name: term }),
	};

	try {
		const vehicleDocumentType = await prisma.vehicle_document_types.findFirst({
			where,
		});

		if (!vehicleDocumentType)
			throw CustomError.notFound(ErrorCode.VEHICLE_DOCUMENT_TYPE_NOT_FOUND);
		return {
			success: true,
			data: vehicleDocumentType,
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
			message: 'Error al obtener el tipo de documento de vehículo',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
