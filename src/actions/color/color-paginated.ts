import { Color, ColorsWhereInput, Response } from '@/interfaces';
import prisma from '@/lib/prisma';
import { getDeletedFilter } from '@/utils';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
	deleteds?: boolean;
}

export const getPaginatedColors = async (params: Params): Promise<Response<Color[]>> => {
	const { page = 1, limit = 10, term = '', deleteds = false } = params;

	const isNumeric = !isNaN(Number(term));

	const where: ColorsWhereInput = {
		...(isNumeric ? { id: Number(term) } : { color_name: { contains: term } }),
		...getDeletedFilter(deleteds),
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
