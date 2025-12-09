import { Prisma } from '@/generated';

import { User } from '@/interfaces';

import { Decimal } from '@prisma/client/runtime/client';

export interface Customer {
	customer_id: number;
	user_id: number;
	total_spent: number | Decimal;
	created_at: Date;
	updated_at: Date;
	user?: User;
}

export type CustomerWhereInput = Prisma.customersWhereInput;
export type CustomerInclude = Prisma.customersInclude;
