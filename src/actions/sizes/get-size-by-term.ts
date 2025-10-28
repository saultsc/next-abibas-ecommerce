'use server';

import { Response, Size, SizesWhereInput } from '@/interfaces';
import prisma from '@/lib/prisma';

export const getSizeByTerm = async (term: string): Promise<Response<Size>> => {
	const where: SizesWhereInput = {
		...{ size_code: { contains: term } },
	};

	try {
		const size = await prisma.sizes.findFirst({
			where: where,
		});

		if (!size)
			return {
				success: false,
				message: 'Talla no encontrada',
			};

		return {
			success: true,
			data: size,
		};
	} catch (error) {
		console.log(error);
		throw new Error('Error al obtener talla por término');
	}
};
