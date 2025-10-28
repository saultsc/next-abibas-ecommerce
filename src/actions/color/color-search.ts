'use server';

import { Color, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

export const searchColors = async (term: string): Promise<Response<Color[]>> => {
	const where = {
		...{ color_name: { contains: term } },
		...{ state: 'A' },
	};

	try {
		const colors = await prisma.colors.findMany({
			where,
		});

		return { success: true, data: colors, message: 'Colores encontrados' };
	} catch (error) {
		return { success: false, message: 'Error al buscar colores' };
	}
};
