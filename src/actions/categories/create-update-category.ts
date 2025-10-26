'use server';

import { Category, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';
import { z } from 'zod';

const categorySchema = {
	category_id: z.coerce
		.number()
		.optional()
		.transform((val) => Number(val)),
	category_name: z.string().min(1, 'El nombre de la categoría es obligatorio'),
	is_active: z.preprocess((val) => val === 'true', z.boolean().default(true)),
};

export const createOrUpdateCategory = async (formData: FormData): Promise<Response<Category>> => {
	const data = Object.fromEntries(formData.entries());
	const categoryParsed = z.object(categorySchema).parse(data);

	if (!categoryParsed) {
		return {
			success: false,
			message: 'Datos de la categoría inválidos',
		};
	}

	const { category_id, ...rest } = categoryParsed;
	try {
		let category;
		let message;

		if (category_id) {
			category = await prismaClient.categories.update({
				where: { category_id },
				data: { ...rest, updated_at: new Date() },
			});

			message = 'Categoría actualizada exitosamente';
		} else {
			category = await prismaClient.categories.create({
				data: { ...rest },
			});

			message = 'Categoría creada exitosamente';
		}

		return {
			success: true,
			message: message,
			data: category,
		};
	} catch (error) {
		console.error('Error al crear/actualizar la categoría:', error);
		return {
			success: false,
			message: 'Error al hacer la operación',
		};
	}
};
