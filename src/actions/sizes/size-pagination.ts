import { Response, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

export const getPaginatedSizes = async ({
	page = 1,
	limit = 10,
	deleteds = false,
}): Promise<Response<Size[]>> => {
	if (isNaN(Number(page))) page = 1;
	if (page < 1) page = 1;

	try {
		const whereCondition = {
			...(deleteds ? {} : { is_delete: false }),
		};

		const [sizes, totalCount] = await Promise.all([
			prisma.sizes.findMany({
				take: limit,
				skip: (page - 1) * limit,
				where: whereCondition,
			}),
			prisma.sizes.count({
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
