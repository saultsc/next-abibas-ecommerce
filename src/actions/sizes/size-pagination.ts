import { Response, Size, SizesWhereInput } from '@/interfaces';
import prisma from '@/lib/prisma';
import { getDeletedFilter } from '@/utils';

interface Params {
	page?: number;
	limit?: number;
	deleteds?: boolean;
	term?: string;
}

export const getPaginatedSizes = async (params: Params): Promise<Response<Size[]>> => {
	const { page = 1, limit = 10, deleteds = false, term } = params;
	const skip = (page - 1) * limit;

	const where: SizesWhereInput = {
		...(term ? { size_code: { contains: term } } : {}),
		...getDeletedFilter(deleteds),
	};

	try {
		const [sizes, totalCount] = await Promise.all([
			prisma.sizes.findMany({
				take: limit,
				skip: skip,
				where: where,
			}),
			prisma.sizes.count({
				where: where,
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
