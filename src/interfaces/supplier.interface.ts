import { Prisma } from '@/generated';

import { Person } from '@/interfaces';

export interface Supplier {
	supplier_id: number;
	person_id: number;
	company_name?: string | null;
	state: string;
	created_at: Date;
	updated_at: Date;
	persons?: Person;
}

export type SupplierWhereInput = Prisma.suppliersWhereInput;
export type SupplierInclude = Prisma.suppliersInclude;
