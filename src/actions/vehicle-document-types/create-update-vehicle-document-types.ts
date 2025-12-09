'use server';

import { Response, VehicleDocumentType } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const vehicleDocumentTypeSchema = {
	document_type_id: z.coerce
		.number()
		.optional()
		.transform((val) => Number(val)),
	type_name: z.string().min(1, 'El nombre del tipo de documento es obligatorio'),
	state: z.enum(['A', 'I']).default('A'),
};

export const createOrUpdateVehicleDocumentType = async (
	formData: FormData
): Promise<Response<VehicleDocumentType>> => {
	const data = Object.fromEntries(formData.entries());

	const vehicleDocumentTypeParsed = z.object(vehicleDocumentTypeSchema).parse(data);

	if (!vehicleDocumentTypeParsed) {
		return {
			success: false,
			message: 'Datos del tipo de documento inválidos',
		};
	}

	const { document_type_id, ...rest } = vehicleDocumentTypeParsed;
	try {
		let vehicle_document_types;
		let message;

		if (document_type_id) {
			vehicle_document_types = await prismaClient.vehicle_document_types.update({
				where: { document_type_id },
				data: { ...rest, updated_at: new Date() },
			});

			message = 'Tipo de documento actualizado exitosamente';
		} else {
			const isExisting = await prismaClient.vehicle_document_types.findFirst({
				where: { type_name: rest.type_name },
			});

			if (isExisting) {
				throw new CustomError(ErrorCode.VEHICLE_DOCUMENT_TYPE_ALREADY_EXISTS);
			}

			vehicle_document_types = await prismaClient.vehicle_document_types.create({
				data: { ...rest },
			});

			message = 'Tipo de documento creado exitosamente';
		}

		revalidatePath('/system/vehicle-document-types');
		revalidatePath(`/system/vehicle-document-types/${document_type_id}`);

		return {
			success: true,
			message: message,
			data: vehicle_document_types,
		};
	} catch (error) {
		console.error('Error al crear/actualizar el tipo de documento de vehículo:', error);

		// Si es un error personalizado, devolver su mensaje y código
		if (CustomError.isCustomError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		// Error desconocido
		return {
			success: false,
			message: 'Error inesperado al procesar el tipo de documento de vehículo',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
