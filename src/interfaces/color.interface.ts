import { Prisma } from '@prisma/client';

export interface Color {
	color_id: number;
	color_name: string;
	hex_code: string | null;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type ColorsWhereInput = Prisma.colorsWhereInput;
