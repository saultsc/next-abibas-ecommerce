'use server';

import { Color, ColorWhereInput, Response } from '@/interfaces';
import { CustomError, ErrorCode, prisma } from '@/lib';

export const getColorByTerm = async (term: string): Promise<Response<Color>> => {
	const isNumeric = !isNaN(Number(term));

	const where: ColorWhereInput = {
		...(term ? (isNumeric ? { color_id: Number(term) } : { color_name: term }) : {}),
	};

	try {
		const color = await prisma.colors.findFirst({
			where,
		});

		if (!color) throw CustomError.notFound(ErrorCode.COLOR_NOT_FOUND);

		return {
			success: true,
			data: color,
			message: 'Color encontrado',
		};
	} catch (error) {
		if (CustomError.isCustomError(error)) {
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
