'use server';

import { Color, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

export const searchColors = async (term: string): Promise<Response<Color[]>> => {
	try {
		const colors = await prisma.colors.findMany({
			where: {
				color_name: {
					contains: term,
				},
			},
		});

		return { success: true, data: colors, message: 'Colores encontrados' };
	} catch (error) {
		return { success: false, message: 'Error al buscar colores' };
	}
};
