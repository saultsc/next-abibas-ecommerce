'use server';

import { Response, VehicleDocumentType } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prismaClient from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteVehicleDocumentType = async (
	document_type_id: number
): Promise<Response<VehicleDocumentType>> => {
	try {
		const isExisting = await prismaClient.vehicle_document_types.findUnique({
			where: { document_type_id },
		});

		if (!isExisting) {
			return {
				success: false,
				message: 'Tipo de documento de vehículo no encontrado',
			};
		}

		const existingReferences = await prismaClient.vehicle_document_types.findFirst({
			where: { document_type_id },
			select: { vehicle_documents: true },
		});

		if (existingReferences && existingReferences.vehicle_documents.length > 0) {
			throw new CustomError(ErrorCode.VEHICLE_DOCUMENT_TYPE_HAS_DOCUMENTS);
		}

		await prismaClient.vehicle_document_types.delete({
			where: { document_type_id },
		});

		revalidatePath('/system/vehicle-document-types');

		return {
			success: true,
			message: 'Tipo de documento de vehículo eliminado exitosamente',
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
			message: 'Error al eliminar el tipo de documento de vehículo',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
