import { Response, Size } from '@/interfaces';
import prismaClient from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const getPaginatedSizes = async ({
	page = 1,
	limit = 10,
	deleteds = false,
}): Promise<Response<Size[]>> => {
	if (isNaN(Number(page))) page = 1;
	if (page < 1) page = 1;

	try {
		const whereCondition: Prisma.sizesWhereInput = {
			...(deleteds ? {} : { is_delete: false }),
		};

		const [sizes, totalCount] = await Promise.all([
			prismaClient.sizes.findMany({
				take: limit,
				skip: (page - 1) * limit,
				where: whereCondition,
			}),
			prismaClient.sizes.count({
				where: whereCondition,
			}),
		]);

		const totalPages = Math.ceil(totalCount / limit);

		return {
			success: true,
			currPage: page,
			totalPages,
			data: sizes,
		};
	} catch (error) {
		throw new Error('No se pudieron cargar los tamaños');
	}
};
