'use server';

import { Category, CategoryWhereInput, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';

export const searchCategories = async (term: string): Promise<Response<Category[]>> => {
	const where: CategoryWhereInput = {
		...(term
			? !isNaN(Number(term))
				? { category_id: Number(term) }
				: { category_name: { contains: term } }
			: {}),
		...{ state: 'A' },
	};

	try {
		const categories = await prismaClient.categories.findMany({
			where,
		});

		return { success: true, data: categories, message: 'Categorias encontradas' };
	} catch (error) {
		return { success: false, message: 'Error searching categories' };
	}
};
