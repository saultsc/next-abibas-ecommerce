'use server';

import { Response, VehicleType } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prismaClient from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const vehicleTypeSchema = {
	vehicle_type_id: z.coerce.number().optional(),
	type_name: z.string().min(1, 'El nombre del tipo de vehículo es obligatorio'),
	description: z.string().optional(),
	state: z.enum(['A', 'I']).default('A'),
	load_capacity_kg: z.coerce
		.number()
		.min(0, 'La capacidad de carga debe ser un número positivo')
		.transform((val) => Number(val)),
};

export const createOrUpdateVehicleType = async (
	formData: FormData
): Promise<Response<VehicleType>> => {
	const data = Object.fromEntries(formData.entries());
	const vehicleTypeParsed = z.object(vehicleTypeSchema).parse(data);

	if (!vehicleTypeParsed) {
		return {
			success: false,
			message: 'Datos del tipo de vehículo inválidos',
		};
	}

	const { vehicle_type_id, ...rest } = vehicleTypeParsed;
	try {
		let vehicleType;
		let message;

		if (vehicle_type_id) {
			vehicleType = await prismaClient.vehicle_types.update({
				where: { vehicle_type_id },
				data: { ...rest, updated_at: new Date() },
			});

			message = 'Tipo de vehículo actualizado exitosamente';
		} else {
			const isExisting = await prismaClient.vehicle_types.findFirst({
				where: { type_name: rest.type_name },
			});

			if (isExisting) {
				throw new CustomError(ErrorCode.VEHICLE_TYPE_ALREADY_EXISTS);
			}

			vehicleType = await prismaClient.vehicle_types.create({
				data: { ...rest },
			});

			message = 'Tipo de vehículo creado exitosamente';
		}

		revalidatePath('/system/vehicleTypes');
		revalidatePath(`/system/vehicleTypes/${vehicle_type_id}`);
		return {
			success: true,
			message: message,
			data: {
				...vehicleType,
				load_capacity_kg: vehicleType.load_capacity_kg.toNumber(),
			},
		};
	} catch (error) {
		console.error('Error al crear/actualizar el tipo de vehículo:', error);

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
