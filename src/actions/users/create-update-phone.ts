'use server';

import { Phone, Response } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const addressSchema = {
	phone_id: z.coerce
		.number()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	person_id: z.coerce
		.number()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	phone_number: z.string().min(1, 'El número de teléfono es obligatorio'),
	phone_type_id: z.coerce.number().transform((val) => Number(val)),
	is_primary: z
		.union([z.boolean(), z.string()])
		.transform((val) => val === true || val === 'true')
		.optional(),
	state: z.enum(['A', 'I']).default('A'),
};

export const createOrUpdatePhone = async (formData: FormData): Promise<Response<Phone>> => {
	const data = Object.fromEntries(formData.entries());
	const addressParsed = z.object(addressSchema).safeParse(data);

	if (!addressParsed.success) {
		return {
			success: false,
			message: 'Datos del Teléfono inválidos',
			code: ErrorCode.VALIDATION_ERROR,
		};
	}

	const { phone_id, person_id, ...rest } = addressParsed.data;

	if (!person_id) {
		return {
			success: false,
			message: 'El ID de la persona es requerido',
			code: ErrorCode.VALIDATION_ERROR,
		};
	}

	try {
		let address;
		let message;

		if (phone_id) {
			address = await prisma.phones.update({
				where: { phone_id },
				data: { ...rest, person_id, updated_at: new Date() },
			});

			message = 'Teléfono actualizado exitosamente';
		} else {
			// Verificar si ya existe un teléfono con el mismo número para esta persona
			const isExisting = await prisma.phones.findFirst({
				where: {
					person_id,
					phone_number: rest.phone_number,
				},
			});

			if (isExisting) {
				throw new CustomError(
					ErrorCode.ADDRESS_ALREADY_EXISTS,
					'Este número de teléfono ya está registrado'
				);
			}

			address = await prisma.phones.create({
				data: { ...rest, person_id },
			});

			message = 'Teléfono creado exitosamente';
		}

		revalidatePath('/system/phones');
		revalidatePath(`/system/phones/${phone_id}`);
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
