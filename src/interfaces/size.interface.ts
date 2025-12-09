import { Prisma } from '@/generated';

export interface Size {
	size_code: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type SizeWhereInput = Prisma.sizesWhereInput;
export type SizeInclude = Prisma.sizesInclude;
