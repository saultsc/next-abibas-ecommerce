'use server';

import { Category, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';
import { getDeletedFilter } from '@/utils';

export const searchCategories = async (term: string): Promise<Response<Category[]>> => {
	try {
		const categories = await prismaClient.categories.findMany({
			where: {
				category_name: {
					contains: term,
				},
				...getDeletedFilter(),
			},
		});

		return { success: true, data: categories, message: 'Categorias encontradas' };
	} catch (error) {
		return { success: false, message: 'Error searching categories' };
	}
};
