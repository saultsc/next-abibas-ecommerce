import { Prisma } from '@prisma/client';

import { Person } from '@/interfaces';

export interface Supplier {
	supplier_id: number;
	person_id: number;
	company_name: string;
	tax_id?: string | null;
	state: string;
	created_at: Date;
	updated_at: Date;
	persons?: Person[];
}

export type SupplierWhereInput = Prisma.suppliersWhereInput;
export type SupplierInclude = Prisma.suppliersInclude;
