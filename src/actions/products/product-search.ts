'use server';

import { Product, ProductWhereInput, Response } from '@/interfaces';
import { prisma } from '@/lib';

export const searchProducts = async (term: string): Promise<Response<Product[]>> => {
	const where: ProductWhereInput = {
		product_name: {
			contains: term,
		},
		state: 'A',
	};

	const include = {
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
		const products = await prisma.products.findMany({
			where,
			include,
		});

		return { success: true, data: products, message: 'Productos encontrados' };
	} catch (error) {
		return { success: false, message: 'Error al buscar productos' };
	}
};
