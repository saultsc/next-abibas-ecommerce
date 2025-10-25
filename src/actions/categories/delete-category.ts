'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteCategory = async (category_id: number) => {
	try {
		await prisma.categories.update({
			where: { category_id },
			data: { is_active: false, is_delete: true, updated_at: new Date() },
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
