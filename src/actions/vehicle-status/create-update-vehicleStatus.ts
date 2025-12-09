'use server';

import { Response, VehicleStatus } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const vehicleStatusSchema = {
	vehicle_status_id: z.coerce.number().optional(),
	status_name: z.string().min(1, 'El nombre del estado de vehículo es obligatorio'),
	state: z.enum(['A', 'I']).default('A'),
};

export const createOrUpdateVehicleStatus = async (
	formData: FormData
): Promise<Response<VehicleStatus>> => {
	const data = Object.fromEntries(formData.entries());
	const vehicleStatusParsed = z.object(vehicleStatusSchema).parse(data);

	if (!vehicleStatusParsed) {
		return {
			success: false,
			message: 'Datos del estado de vehículo inválidos',
		};
	}

	const { vehicle_status_id, ...rest } = vehicleStatusParsed;
	try {
		let vehicleStatus;
		let message;

		if (vehicle_status_id) {
			vehicleStatus = await prismaClient.vehicle_statuses.update({
				where: { vehicle_status_id },
				data: { ...rest, updated_at: new Date() },
			});

			message = 'Estado de vehículo actualizado exitosamente';
		} else {
			const isExisting = await prismaClient.vehicle_statuses.findFirst({
				where: { status_name: rest.status_name },
			});

			if (isExisting) {
				throw new CustomError(ErrorCode.STATUS_VEHICLE_ALREADY_EXISTS);
			}

			vehicleStatus = await prismaClient.vehicle_statuses.create({
				data: { ...rest },
			});

			message = 'Estado de vehículo creado exitosamente';
		}

		revalidatePath('/system/vehicle-status');
		revalidatePath(`/system/vehicle-status/${vehicle_status_id}`);
		return {
			success: true,
			message: message,
			data: vehicleStatus,
		};
	} catch (error) {
		console.error('Error al crear/actualizar el estado de vehículo:', error);

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
			message: 'Error inesperado al procesar el tipo de vehiculo',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
