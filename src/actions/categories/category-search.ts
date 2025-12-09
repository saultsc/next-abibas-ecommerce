'use server';

import { prisma } from '@/lib';

import { Category, CategoryWhereInput, Response } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchCategories = async (
	term: string,
	take: number = 30
): Promise<Response<Category[]>> => {
	const where: CategoryWhereInput = {
		...(term
			? !isNaN(Number(term))
				? { category_id: Number(term) }
				: { category_name: { contains: term } }
			: {}),
		...{ state: 'A' },
	};

	try {
		const categories = await prisma.categories.findMany({
			where,
			take,
		});

		return { success: true, data: categories, message: 'Categorias encontradas' };
	} catch (error) {
		return {
			success: false,
			message: 'Error searching categories',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
