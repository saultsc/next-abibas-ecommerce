'use server';

import prisma from '@/lib/prisma';

export const getProductByTerm = async (term: string) => {
	try {
		const isNumeric = !isNaN(Number(term));

		const products = await prisma.products.findMany({
			where: isNumeric
				? {
						product_id: Number(term),
				  }
				: {
						product_name: {
							contains: term,
						},
				  },
		});

		if (!products)
			return {
				success: false,
				message: 'Productos no encontrados',
			};

		return {
			success: true,
			data: products,
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al buscar productos',
		};
	}
};
