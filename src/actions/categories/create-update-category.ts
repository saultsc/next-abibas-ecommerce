'use server';

import { Category, Response } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prismaClient from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const categorySchema = {
	category_id: z.coerce
		.number()
		.optional()
		.transform((val) => Number(val)),
	category_name: z.string().min(1, 'El nombre de la categoría es obligatorio'),
	state: z.enum(['A', 'I']).default('A'),
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
			const isExisting = await prismaClient.categories.findFirst({
				where: { category_name: rest.category_name },
			});

			if (isExisting) {
				throw new CustomError(ErrorCode.CATEGORY_ALREADY_EXISTS);
			}

			category = await prismaClient.categories.create({
				data: { ...rest },
			});

			message = 'Categoría creada exitosamente';
		}

		revalidatePath('/system/categories');
		revalidatePath(`/system/categories/${category_id}`);

		return {
			success: true,
			message: message,
			data: category,
		};
	} catch (error) {
		console.error('Error al crear/actualizar la categoría:', error);

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
			message: 'Error inesperado al procesar la categoría',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
