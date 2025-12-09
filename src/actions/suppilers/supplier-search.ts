'use server';

import { Response, Supplier, SupplierInclude } from '@/interfaces';
import { prisma } from '@/lib';

export const getSupplierSearch = async (term?: string): Promise<Response<Supplier[]>> => {
	if (!term) {
		return {
			success: true,
			data: [],
			message: 'No term provided',
		};
	}

	const isNumeric = !isNaN(Number(term));

	const include: SupplierInclude = {
		persons: {
			include: {
				phones: true,
				parties: true,
			},
		},
	};

	const data = await prisma.suppliers.findMany({
		where: isNumeric
			? { supplier_id: Number(term) }
			: {
					company_name: { contains: term },
			  },
		include,
		take: 10,
	});
	return {
		success: true,
		data,
		message: 'Suppliers fetched successfully',
	};
};
