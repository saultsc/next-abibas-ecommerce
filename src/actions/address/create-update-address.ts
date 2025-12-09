'use server';

import { Address, Response } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const addressSchema = {
	address_id: z.coerce
		.number()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	person_id: z.coerce
		.number()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	city_id: z.coerce
		.number()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	address_line1: z.string().min(1, 'La línea 1 de la dirección es obligatoria'),
	address_line2: z.string().optional(),
	postal_code: z.string().min(1, 'El código postal es obligatorio'),
	is_primary: z
		.union([z.boolean(), z.string()])
		.transform((val) => val === true || val === 'true')
		.optional(),
	state: z.enum(['A', 'I']).default('A'),
};

export const createOrUpdateAddress = async (formData: FormData): Promise<Response<Address>> => {
	const data = Object.fromEntries(formData.entries());
	const addressParsed = z.object(addressSchema).safeParse(data);

	console.log(addressParsed);

	if (!addressParsed.success) {
		return {
			success: false,
			message: 'Datos de la dirección inválidos',
			code: ErrorCode.VALIDATION_ERROR,
		};
	}

	const { address_id, person_id, city_id, ...rest } = addressParsed.data;

	if (!person_id) {
		return {
			success: false,
			message: 'El ID de la persona es requerido',
			code: ErrorCode.VALIDATION_ERROR,
		};
	}

	if (!city_id) {
		return {
			success: false,
			message: 'La ciudad es requerida',
			code: ErrorCode.VALIDATION_ERROR,
		};
	}

	try {
		let address;
		let message;

		if (address_id) {
			address = await prisma.addresses.update({
				where: { address_id },
				data: { ...rest, person_id, city_id, updated_at: new Date() },
			});

			message = 'Dirección actualizada exitosamente';
		} else {
			// Verificar si ya existe una dirección similar para esta persona
			const isExisting = await prisma.addresses.findFirst({
				where: {
					person_id,
					address_line1: rest.address_line1,
					postal_code: rest.postal_code,
				},
			});

			if (isExisting) {
				throw new CustomError(
					ErrorCode.ADDRESS_ALREADY_EXISTS,
					'Esta dirección ya está registrada'
				);
			}

			address = await prisma.addresses.create({
				data: { ...rest, person_id, city_id },
			});

			message = 'Dirección creada exitosamente';
		}

		revalidatePath('/system/addresses');
		revalidatePath(`/system/addresses/${address_id}`);
		return {
			success: true,
			message: message,
			data: address,
		};
	} catch (error) {
		console.log(error);
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
			message: 'Error inesperado al procesar la categoría',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
