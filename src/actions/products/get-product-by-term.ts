'use server';

import { Product, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const getProductByTerm = async (
	term: string,
	deleteds?: boolean
): Promise<Response<Product>> => {
	try {
		const whereCondition: Prisma.productsWhereInput = {
			...(term ? { product_name: { contains: term } } : {}),
			...(deleteds ? {} : { is_delete: false }),
		};

		const size = await prismaClient.products.findFirst({
			where: whereCondition,
		});

		if (!size)
			return {
				success: false,
				message: 'Producto no encontrado',
			};

		return {
			success: true,
			data: size,
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al obtener el producto',
		};
	}
};
