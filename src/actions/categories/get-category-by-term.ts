'use server';

import { Category, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

export const getCategoryByTerm = async (
	term: string,
	deleteds?: boolean
): Promise<Response<Category>> => {
	try {
		const isNumeric = !isNaN(Number(term));

		// Conditions
		const whereTermCondition = isNumeric
			? { category_id: Number(term) }
			: { category_name: term as string };

		const whereDeleteCondition = deleteds ? {} : { is_delete: false };

		const category = await prisma.categories.findFirst({
			where: { ...whereTermCondition, ...whereDeleteCondition },
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
		throw new Error('Error al obtener categoría por término');
	}
};
