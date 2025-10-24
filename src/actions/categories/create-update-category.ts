'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

const categorySchema = {
	category_id: z.coerce
		.number()
		.optional()
		.transform((val) => Number(val)),
	category_name: z.string().min(1, 'El nombre de la categoría es obligatorio'),
	is_active: z.preprocess((val) => val === 'true', z.boolean().default(true)),
};

export const createUpdateCategory = async (formData: FormData) => {
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
		if (category_id) {
			category = await prisma.categories.update({
				where: { category_id },
				data: { ...rest },
			});
		} else {
			category = await prisma.categories.create({
				data: { ...rest },
			});
		}
		return {
			success: true,
			message: 'Categoría guardada exitosamente',
			category,
		};
	} catch (error) {
		console.error('Error al crear/actualizar la categoría:', error);
		return {
			success: false,
			message: 'Error al guardar la categoría',
		};
	}
};
