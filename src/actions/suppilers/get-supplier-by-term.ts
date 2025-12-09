'use server';

import { Response, Supplier, SupplierInclude, SupplierWhereInput } from '@/interfaces';
import { prisma } from '@/lib';

export const getSupplierByTerm = async (term: string | number): Promise<Response<Supplier>> => {
	const isNumeric = !isNaN(Number(term));

	const where: SupplierWhereInput = isNumeric
		? { supplier_id: Number(term) }
		: {
				company_name: { contains: String(term) },
		  };

	const include: SupplierInclude = {
		persons: {
			include: {
				phones: true,
				parties: true,
			},
		},
	};

	const data = await prisma.suppliers.findFirst({
		where,
		include,
	});

	if (!data) {
		return {
			success: false,
			message: 'Supplier not found',
		};
	}

	return {
		success: true,
		data,
		message: 'Supplier fetched successfully',
	};
};
