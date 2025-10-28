'use server';

import { Category, CategoryWhereInput, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

export const getCategoryByTerm = async (term: string): Promise<Response<Category>> => {
	const isNumeric = !isNaN(Number(term));

	const where: CategoryWhereInput = {
		...(isNumeric ? { category_id: Number(term) } : { category_name: term }),
	};

	try {
		const category = await prisma.categories.findFirst({
			where,
		});

		if (!category)
			return {
				success: false,
				message: 'Categoría no encontrada',
			};

		return {
			success: true,
			data: category,
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			message: 'Error al obtener la categoría',
		};
	}
};
