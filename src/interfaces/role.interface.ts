import { Prisma } from '@/generated';

export interface Role {
	role_id: number;
	role_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type RoleWhereInput = Prisma.rolesWhereInput;
export type RoleInclude = Prisma.rolesInclude;
