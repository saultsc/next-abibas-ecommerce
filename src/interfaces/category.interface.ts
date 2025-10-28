import { Prisma } from '@prisma/client';

export interface Category {
	category_id: number;
	category_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type CategoryWhereInput = Prisma.categoriesWhereInput;
