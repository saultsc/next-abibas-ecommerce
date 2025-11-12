'use server';

import { Category, CategoryWhereInput, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

interface Params {
	page?: number;
	take?: number;
	term?: string;
}

export const getPaginatedCategories = async (params: Params): Promise<Response<Category[]>> => {
	const { page = 1, take = 10, term } = params;

	const skip = (page - 1) * take;

	const isNumeric = !isNaN(Number(term));

	const where: CategoryWhereInput = {
		...(term
			? isNumeric
				? { category_id: Number(term) }
				: { category_name: { contains: term } }
			: {}),
	};

	try {
		const [categories, totalCount] = await Promise.all([
			prisma.categories.findMany({
				take,
				skip,
				where,
			}),
			prisma.categories.count({
				where,
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
		return {
			success: false,
			message: 'Error al obtener las categorías',
			data: [],
		};
	}
};
