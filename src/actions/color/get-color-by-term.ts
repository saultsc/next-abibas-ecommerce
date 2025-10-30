'use server';

import { Color, ColorsWhereInput, Response } from '@/interfaces';
import { AppError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const getColorByTerm = async (term: string): Promise<Response<Color>> => {
	const isNumeric = !isNaN(Number(term));

	const where: ColorsWhereInput = {
		...(term ? (isNumeric ? { color_id: Number(term) } : { color_name: term }) : {}),
	};

	try {
		const color = await prisma.colors.findFirst({
			where,
		});

		if (!color) throw AppError.notFound(ErrorCode.COLOR_NOT_FOUND);

		return {
			success: true,
			data: color,
			message: 'Color encontrado',
		};
	} catch (error) {
		if (AppError.isAppError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener el color',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
