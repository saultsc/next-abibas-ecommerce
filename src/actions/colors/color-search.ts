'use server';

import { Color, Response } from '@/interfaces';
import { ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const searchColors = async (term: string, take: number = 30): Promise<Response<Color[]>> => {
	const where = {
		...{ color_name: { contains: term } },
		...{ state: 'A' },
	};

	try {
		const colors = await prisma.colors.findMany({
			where,
			take,
		});

		return { success: true, data: colors, message: 'Colores encontrados' };
	} catch (error) {
		return {
			success: false,
			message: 'Error searching colors',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
