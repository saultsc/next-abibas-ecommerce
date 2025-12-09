import { Response, Size, SizeWhereInput } from '@/interfaces';
import { prisma } from '@/lib';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedSizes = async (params: Params): Promise<Response<Size[]>> => {
	const { page = 1, limit = 10, term } = params;
	const skip = (page - 1) * limit;

	const where: SizeWhereInput = {
		...(term ? { size_code: { contains: term } } : {}),
	};

	try {
		const [sizes, totalCount] = await Promise.all([
			prisma.sizes.findMany({
				take: limit,
				skip,
				where,
			}),
			prisma.sizes.count({
				where,
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
		return {
			success: false,
			message: 'Error al obtener las tallas',
			data: [],
		};
	}
};
