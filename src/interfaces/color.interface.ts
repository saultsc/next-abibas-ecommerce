import { Prisma } from '@prisma/client';

export interface Color {
	color_id: number;
	color_name: string;
	hex_code: string | null;
	is_active: boolean;
	is_delete: boolean;
	created_at: Date;
	updated_at: Date;
}

export type ColorsWhereInput = Prisma.colorsWhereInput;
