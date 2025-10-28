'use server';

import { Category, Response } from '@/interfaces';
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
			return {
				success: false,
				message: 'No se puede eliminar la categoría porque está asociada a productos',
			};
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
		return {
			success: false,
			message: 'Error al eliminar la categoría',
		};
	}
};
