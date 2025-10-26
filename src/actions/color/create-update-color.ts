'use server';

import { Color, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';
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
	is_active: z.preprocess((val) => val === 'true', z.boolean().default(true)),
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
			color = await prismaClient.colors.update({
				where: { color_id },
				data: { ...rest, updated_at: new Date() },
			});

			message = 'Color actualizado exitosamente';
		} else {
			color = await prismaClient.colors.create({
				data: { ...rest },
			});

			message = 'Color creado exitosamente';
		}

		return {
			success: true,
			message: message,
			data: color,
		};
	} catch (error) {
		console.error('Error al crear/actualizar el color:', error);
		return {
			success: false,
			message: 'Error al hacer la operación',
		};
	}
};
