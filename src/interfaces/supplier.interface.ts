import { Prisma } from '@prisma/client';

export interface Supplier {
	supplier_id: number;
	person_id: number;
	company_name: string;
	tax_id?: string | null;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type SupplierWhereInput = Prisma.suppliersWhereInput;
export type SupplierInclude = Prisma.suppliersInclude;
