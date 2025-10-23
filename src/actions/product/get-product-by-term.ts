'use server';

import prisma from '@/lib/prisma';

export const getAllProducts = async () => {
	const products = await prisma.productos.findMany();

	return products;
};
