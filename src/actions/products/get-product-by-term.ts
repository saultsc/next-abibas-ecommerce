'use server';

import { Product, ProductInclude, ProductWhereInput, Response } from '@/interfaces';
import { AppError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const getProductByTerm = async (
	term: string,
	deleteds?: boolean
): Promise<Response<Product>> => {
	const isNumeric = !isNaN(Number(term));

	const where: ProductWhereInput = {
		...(isNumeric ? { product_id: Number(term) } : { product_name: term }),
	};

	const include: ProductInclude = {
		product_images: true,
		product_variants: {
			include: {
				colors: true,
				sizes: true,
			},
		},
		categories: true,
	};

	try {
		const product = await prisma.products.findFirst({
			where: where,
			include: include,
		});

		if (!product) {
			throw AppError.notFound(ErrorCode.PRODUCT_NOT_FOUND);
		}

		const { product_images, product_variants, categories, price, weight, ...rest } = product;

		return {
			message: 'Producto encontrado',
			success: true,
			data: {
				...rest,
				price: Number(price),
				weight: weight ? Number(weight) : null,
				images: product_images,
				category: categories,
				variants: product_variants?.map((variant) => ({
					...variant,
					price_adjustment: Number(variant.price_adjustment),
				})),
			},
		};
	} catch (error) {
		console.error('Error al obtener el producto por término:', error);

		if (AppError.isAppError(error)) {
			return {
				success: true,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener el producto',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
