import { Prisma } from '@prisma/client';

export interface Size {
	size_code: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type SizesWhereInput = Prisma.sizesWhereInput;
