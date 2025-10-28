'use server';

import { Category, CategoryWhereInput, Response } from '@/interfaces';
import prisma from '@/lib/prisma';
import { getDeletedFilter } from '@/utils';

interface Params {
	page?: number;
	take?: number;
	term?: string;
	deleteds?: boolean;
}

export const getPaginatedCategories = async (params: Params): Promise<Response<Category[]>> => {
	const { page = 1, take = 10, term, deleteds = false } = params;

	const skip = (page - 1) * take;

	const isNumeric = !isNaN(Number(page));

	const where: CategoryWhereInput = {
		...(term
			? isNumeric
				? { category_id: Number(term) }
				: { category_name: { contains: term } }
			: {}),
		...getDeletedFilter(deleteds),
	};

	try {
		const [categories, totalCount] = await Promise.all([
			prisma.categories.findMany({
				take: take,
				skip: skip,
				where: where,
			}),
			prisma.categories.count({
				where: where,
			}),
		]);

		const totalPages = Math.ceil(totalCount / take);

		return {
			success: true,
			data: categories,
			totalPages,
			currPage: page,
		};
	} catch (error) {
		throw new Error('No se pudo cargar las categorías');
	}
};
