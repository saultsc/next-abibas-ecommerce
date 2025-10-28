'use server';

import { Response, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

export const searchSizes = async (term: string): Promise<Response<Size[]>> => {
	try {
		const sizes = await prisma.sizes.findMany({
			where: {
				size_code: {
					contains: term,
				},
			},
		});

		return { success: true, data: sizes, message: 'Tallas encontrados' };
	} catch (error) {
		return { success: false, message: 'Error al buscar tallas' };
	}
};
