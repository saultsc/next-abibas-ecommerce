'use server';

import { Color, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const getColorByTerm = async (
	term: string,
	deleteds?: boolean
): Promise<Response<Color>> => {
	try {
		const isNumeric = !isNaN(Number(term));

		// Conditions
		const whereTermCondition: Prisma.colorsWhereInput = isNumeric
			? { color_id: Number(term) }
			: { color_name: term as string };

		const whereDeleteCondition: Prisma.colorsWhereInput = deleteds ? {} : { is_delete: false };

		const color = await prismaClient.colors.findFirst({
			where: { ...whereTermCondition, ...whereDeleteCondition },
		});

		if (!color)
			return {
				success: false,
				message: 'Color no encontrado',
			};

		return {
			success: true,
			data: color,
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al obtener el color',
		};
	}
};
