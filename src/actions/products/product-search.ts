'use server';

import { Product, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

export const searchProducts = async (term: string): Promise<Response<Product[]>> => {
	try {
		const products = await prisma.products.findMany({
			where: {
				product_name: {
					contains: term,
				},
			},
			include: {
				categories: true,
				product_images: true,
				product_variants: {
					include: {
						colors: true,
						sizes: true,
					},
				},
			},
		});

		return { success: true, data: products, message: 'Productos encontrados' };
	} catch (error) {
		return { success: false, message: 'Error al buscar productos' };
	}
};
