import { Prisma } from '@prisma/client';

export interface Category {
	category_id: number;
	category_name: string;
	is_active: boolean;
	is_delete: boolean;
	created_at: Date;
	updated_at: Date;
}

export type CategoryWhereInput = Prisma.categoriesWhereInput;
