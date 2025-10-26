import { Color, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const getPaginatedColors = async ({
	page = 1,
	limit = 10,
	deleteds = false,
}): Promise<Response<Color[]>> => {
	if (isNaN(Number(page))) page = 1;
	if (page < 1) page = 1;

	try {
		const whereCondition: Prisma.colorsWhereInput = {
			...(deleteds ? {} : { is_delete: false }),
		};

		const [colors, totalCount] = await Promise.all([
			prismaClient.colors.findMany({
				take: limit,
				skip: (page - 1) * limit,
				where: whereCondition,
			}),
			prismaClient.colors.count({
				where: whereCondition,
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
