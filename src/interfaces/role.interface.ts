import { Prisma } from '@prisma/client';

export interface Role {
	role_id: number;
	role_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type RolesWhereInput = Prisma.rolesWhereInput;
export type RolesInclude = Prisma.rolesInclude;
