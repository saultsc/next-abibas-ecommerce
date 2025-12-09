'use server';

import { Product, ProductInclude, ProductWhereInput, Response } from '@/interfaces';
import { ErrorCode, prisma } from '@/lib';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
	color_id?: number;
	size_code?: string;
}

export const getPaginatedProducts = async (params: Params): Promise<Response<Product[]>> => {
	const { page = 1, limit = 10, term, color_id, size_code } = params;
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
			currPage: page,
			totalPages,
			data: products.map((product) => ({
				...product,
				price: Number(product.price),
				weight: product.weight ? Number(product.weight) : null,
				variants: product.product_variants?.map((variant) => ({
					...variant,
					price_adjustment: Number(variant.price_adjustment),
				})),
				images: product.product_images,
				category: product.categories,
			})),
		};
	} catch (error) {
		console.error('Error al obtener productos paginados:', error);

		return {
			success: false,
			code: ErrorCode.INTERNAL_ERROR,
			message: 'Error al obtener productos',
			data: [],
		};
	}
};
