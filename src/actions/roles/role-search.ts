'use server';

import prisma from '@/lib/prisma';

import { Response, Role, RolesWhereInput } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchRoles = async (term: string): Promise<Response<Role[]>> => {
	const isNumeric = !isNaN(Number(term));

	const where: RolesWhereInput = {
		...(term
			? isNumeric
				? { role_id: Number(term) }
				: { role_name: { contains: term } }
			: {}),
		...{ state: 'A' },
	};

	try {
		const roles = await prisma.roles.findMany({
			where,
		});

		return { success: true, data: roles, message: 'Roles encontrados' };
	} catch (error) {
		return {
			success: false,
			message: 'Error searching roles',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
