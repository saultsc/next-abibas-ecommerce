'use server';

import { prisma } from '@/lib';

import { Response, Size, SizeWhereInput } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchSizes = async (term: string): Promise<Response<Size[]>> => {
	const where: SizeWhereInput = {
		...{ size_code: { contains: term } },
		...{ state: 'A' },
	};

	try {
		const sizes = await prisma.sizes.findMany({
			where: where,
		});

		return { success: true, data: sizes, message: 'Tallas encontrados' };
	} catch (error) {
		return {
			success: false,
			message: 'Error al buscar tallas',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
