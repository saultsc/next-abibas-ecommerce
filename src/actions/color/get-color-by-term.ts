'use server';

import { Color, ColorsWhereInput, Response } from '@/interfaces';
import prisma from '@/lib/prisma';
import { getDeletedFilter } from '@/utils';

export const getColorByTerm = async (
	term: string,
	deleteds?: boolean
): Promise<Response<Color>> => {
	const isNumeric = !isNaN(Number(term));

	const where: ColorsWhereInput = {
		...(term ? (isNumeric ? { color_id: Number(term) } : { color_name: term }) : {}),
		...getDeletedFilter(deleteds),
	};

	try {
		const color = await prisma.colors.findFirst({
			where: where,
		});

		if (!color)
			return {
				success: false,
				message: 'Color no encontrado',
			};

		return {
			success: true,
			data: color,
			message: 'Color encontrado',
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al obtener el color',
		};
	}
};
