'use server';

import { Product, ProductInclude, ProductWhereInput, Response } from '@/interfaces';
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
	};

	try {
		const product = await prisma.products.findFirst({
			where: where,
			include: include,
		});

		if (!product)
			return {
				success: false,
				message: 'Producto no encontrado',
			};

		const { product_images, product_variants, price, weight, ...rest } = product;

		return {
			message: 'Producto encontrado',
			success: true,
			data: {
				...rest,
				price: Number(price),
				weight: weight ? Number(weight) : null,
				images: product_images,
				variants: product_variants?.map((variant) => ({
					...variant,
					price_adjustment: Number(variant.price_adjustment),
				})),
			},
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al obtener el producto',
		};
	}
};
