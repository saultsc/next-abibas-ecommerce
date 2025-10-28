'use server';

import { Product, ProductInclude, ProductWhereInput, Response } from '@/interfaces';
import prisma from '@/lib/prisma';
import { getDeletedFilter } from '@/utils';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
	color_id?: number;
	size_code?: string;
	deleteds?: boolean;
}

export const getPaginatedProducts = async (params: Params): Promise<Response<Product[]>> => {
	const { page = 1, limit = 10, term, color_id, size_code, deleteds } = params;
	const skip = (page - 1) * limit;

	const isNumeric = !isNaN(Number(term));

	const where: ProductWhereInput = {
		...(term
			? isNumeric
				? { product_id: Number(term) }
				: { product_name: { contains: term } }
			: {}),
		...(color_id ? { product_variants: { some: { color_id } } } : {}),
		...(size_code ? { product_variants: { some: { size_code } } } : {}),
		...getDeletedFilter(deleteds),
	};

	const include: ProductInclude = {
		categories: true,
		product_images: true,
		product_variants: {
			include: {
				colors: true,
				sizes: true,
			},
		},
	};

	try {
		const [products, totalCount] = await Promise.all([
			prisma.products.findMany({
				skip,
				take: limit,
				include,
				where,
			}),
			prisma.products.count({
				where,
			}),
		]);

		const totalPages = Math.ceil(totalCount / limit);

		return {
			success: true,
			message: 'Productos paginados obtenidos',
			data: products,
			totalPages,
			currPage: page,
		};
	} catch (error) {
		return { success: false, message: 'Error al obtener los productos' };
	}
};
