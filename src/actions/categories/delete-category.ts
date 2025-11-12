'use server';

import { Category, Response } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prismaClient from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteCategory = async (category_id: number): Promise<Response<Category>> => {
	try {
		const isExisting = await prismaClient.categories.findUnique({
			where: { category_id },
		});

		if (!isExisting) {
			return {
				success: false,
				message: 'Categoría no encontrada',
			};
		}

		const existingReferences = await prismaClient.categories.findFirst({
			where: { category_id },
			select: { products: true },
		});

		if (existingReferences && existingReferences.products.length > 0) {
			throw new CustomError(ErrorCode.CATEGORY_HAS_PRODUCTS);
		}

		await prismaClient.categories.delete({
			where: { category_id },
		});

		revalidatePath('/system/categories');

		return {
			success: true,
			message: 'Categoría eliminada exitosamente',
		};
	} catch (error) {
		if (CustomError.isCustomError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al eliminar la categoría',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
