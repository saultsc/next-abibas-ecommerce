'use server';

import { prisma } from '@/lib';

import { Response, Supplier, SupplierInclude, SupplierWhereInput } from '@/interfaces';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedSuppliers = async (params: Params): Promise<Response<Supplier[]>> => {
	const { page = 1, limit = 10, term } = params;
	const skip = (page - 1) * limit;

	const isNumeric = !isNaN(Number(term));

	const where: SupplierWhereInput = {
		...(term
			? isNumeric
				? { supplier_id: Number(term) }
				: { company_name: { contains: term } }
			: {}),
	};

	const include: SupplierInclude = {
		persons: {
			include: {
				phones: true,
				document_types: true,
			},
		},
	};

	const [data, total] = await Promise.all([
		prisma.suppliers.findMany({
			skip,
			take: limit,
			include,
			where,
		}),

		prisma.suppliers.count({
			where,
		}),
	]);

	const totalPages = Math.ceil(total / limit);

	return {
		success: true,
		data,
		currPage: page,
		totalPages,
		message: 'Suppliers fetched successfully',
	};
};
