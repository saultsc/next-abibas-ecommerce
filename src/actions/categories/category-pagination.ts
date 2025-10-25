'use server';

import { Category, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

interface PaginationOptions {
	page?: number;
	take?: number;
	category_name?: string;
	deleteds?: boolean;
}

export const getPaginatedCategories = async ({
	page = 1,
	take = 12,
	category_name,
	deleteds = false,
}: PaginationOptions): Promise<Response<Category[]>> => {
	if (isNaN(Number(page))) page = 1;
	if (page < 1) page = 1;

	try {
		const whereCondition = {
			...(category_name && {
				category_name: {
					contains: category_name,
				},
			}),
			...(deleteds ? {} : { is_delete: false }),
		};

		const [categories, totalCount] = await Promise.all([
			prisma.categories.findMany({
				take: take,
				skip: (page - 1) * take,
				where: whereCondition,
			}),
			prisma.categories.count({
				where: whereCondition,
			}),
		]);

		const totalPages = Math.ceil(totalCount / take);

		return {
			success: true,
			currPage: page,
			totalPages,
			data: categories,
		};
	} catch (error) {
		throw new Error('No se pudo cargar las categorías');
	}
};
