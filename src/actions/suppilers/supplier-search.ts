'use server';

import { Response, Supplier, SupplierInclude } from '@/interfaces';
import { prisma } from '@/lib';

export const getSupplierSearch = async (term?: string): Promise<Response<Supplier[]>> => {
	const include: SupplierInclude = {
		persons: {
			include: {
				phones: true,
			},
		},
	};

	if (!term) {
		// Si no hay término, retornar todos los proveedores activos
		const data = await prisma.suppliers.findMany({
			where: {
				state: 'A',
			},
			include,
			orderBy: {
				company_name: 'asc',
			},
		});
		return {
			success: true,
			data,
			message: 'All suppliers fetched successfully',
		};
	}

	const isNumeric = !isNaN(Number(term));

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
