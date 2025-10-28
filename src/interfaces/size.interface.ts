import { Prisma } from '@prisma/client';

export interface Size {
	size_code: string;
	is_active: boolean;
	is_delete: boolean;
	created_at: Date;
	updated_at: Date;
}

export type SizesWhereInput = Prisma.sizesWhereInput;
