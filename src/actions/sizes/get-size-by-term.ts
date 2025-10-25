'use server';

import { Response, Size } from '@/interfaces';
import prismaClient from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const getSizeByTerm = async (term: string, deleteds?: boolean): Promise<Response<Size>> => {
	try {
		const whereCondition: Prisma.sizesWhereInput = {
			size_code: term,
			...(deleteds ? {} : { is_delete: false }),
		};

		const size = await prismaClient.sizes.findFirst({
			where: whereCondition,
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
