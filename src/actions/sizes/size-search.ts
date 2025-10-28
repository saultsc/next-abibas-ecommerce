'use server';

import { Response, Size, SizesWhereInput } from '@/interfaces';
import prisma from '@/lib/prisma';

export const searchSizes = async (term: string): Promise<Response<Size[]>> => {
	const where: SizesWhereInput = {
		...{ size_code: { contains: term } },
		...{ state: 'A' },
	};

	try {
		const sizes = await prisma.sizes.findMany({
			where: where,
		});

		return { success: true, data: sizes, message: 'Tallas encontrados' };
	} catch (error) {
		return { success: false, message: 'Error al buscar tallas' };
	}
};
