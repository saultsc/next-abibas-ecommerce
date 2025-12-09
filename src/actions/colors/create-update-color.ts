'use server';

import { Color, Response } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const colorSchema = {
	color_id: z.coerce
		.number()
		.optional()
		.transform((val) => Number(val)),
	color_name: z.string().min(1, 'El nombre del color es obligatorio'),
	hex_code: z
		.string()
		.max(7, 'El código hexadecimal no puede exceder 7 caracteres')
		.optional()
		.nullable()
		.transform((val) => (val === '' ? null : val))
		.refine(
			(val) => {
				if (!val) return true; // Si es null, undefined o '', es válido (opcional)
				return /^#[0-9A-Fa-f]{6}$/.test(val); // Valida formato hex (#RRGGBB)
			},
			{
				message: 'El código hexadecimal debe tener el formato #RRGGBB (ejemplo: #FF5733)',
			}
		),
	state: z.enum(['A', 'I']).default('A'),
};

export const createOrUpdateColor = async (formData: FormData): Promise<Response<Color>> => {
	const data = Object.fromEntries(formData.entries());
	const colorParsed = z.object(colorSchema).parse(data);

	if (!colorParsed) {
		return {
			success: false,
			message: 'Datos del color inválidos',
		};
	}

	const { color_id, ...rest } = colorParsed;
	try {
		let color;
		let message;

		if (color_id) {
			color = await prisma.colors.update({
				where: { color_id },
				data: { ...rest, updated_at: new Date() },
			});

			message = 'Color actualizado exitosamente';
		} else {
			const isExisting = await prisma.colors.findFirst({
				where: { color_name: rest.color_name },
			});

			if (isExisting) {
				throw new CustomError(ErrorCode.COLOR_ALREADY_EXISTS);
			}

			color = await prisma.colors.create({
				data: { ...rest },
			});

			message = 'Color creado exitosamente';
		}

		revalidatePath('/system/colors');
		revalidatePath(`/system/colors/${color_id}`);

		return {
			success: true,
			message: message,
			data: color,
		};
	} catch (error) {
		console.error('Error al crear/actualizar el color:', error);

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
			message: 'Error inesperado al procesar el color',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
