import { Color, ColorsWhereInput, Response } from '@/interfaces';
import prisma from '@/lib/prisma';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedColors = async (params: Params): Promise<Response<Color[]>> => {
	const { page = 1, limit = 10, term = '' } = params;

	const isNumeric = !isNaN(Number(term));

	const where: ColorsWhereInput = {
		...(term
			? isNumeric
				? { color_id: Number(term) }
				: { color_name: { contains: term } }
			: {}),
	};

	try {
		const [colors, totalCount] = await Promise.all([
			prisma.colors.findMany({
				take: limit,
				skip: (page - 1) * limit,
				where: where,
			}),
			prisma.colors.count({
				where: where,
			}),
		]);

		const totalPages = Math.ceil(totalCount / limit);

		return {
			success: true,
			currPage: page,
			totalPages,
			data: colors || [],
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al obtener los colores',
		};
	}
};
