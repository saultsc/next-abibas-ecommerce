'use server';

import { Category, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

export const getCategoryByTerm = async (term: string | number): Promise<Response<Category>> => {
	try {
		const isNumeric = !isNaN(Number(term));

		const category = await prisma.categories.findFirst({
			where: isNumeric
				? {
						category_id: Number(term),
				  }
				: {
						category_name: {
							equals: term as string,
						},
				  },
		});

		if (!category)
			return {
				success: false,
				message: 'Categoría no encontrada',
				data: null,
			};

		return {
			success: true,
			data: category,
		};
	} catch (error) {
		console.log(error);
		throw new Error('Error al obtener categoría por término');
	}
};
