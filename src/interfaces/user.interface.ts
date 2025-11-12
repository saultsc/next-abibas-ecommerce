import { Prisma } from '@prisma/client';

import { Customer, Employee, Person, Role } from '@/interfaces';

export interface User {
	user_id: number;
	username: string;
	password?: string;
	person_id: number;
	role_id?: number | null;
	last_login: Date | null;
	state: string;
	created_at: Date;
	updated_at: Date;
	employees?: Employee;
	persons?: Person;
	customers?: Customer;
	roles?: Role | null;
}

export type UserWhereInput = Prisma.usersWhereInput;
export type UserInclude = Prisma.usersInclude;
