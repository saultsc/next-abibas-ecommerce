'use server';

import { Response, User, UsersInclude, UsersWhereInput } from '@/interfaces';
import prisma from '@/lib/prisma';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedUsers = async (params: Params): Promise<Response<User[]>> => {
	const { page = 1, limit = 10, term } = params;
	const skip = (page - 1) * limit;

	const isNumeric = !isNaN(Number(term));

	const where: UsersWhereInput = {
		...(term ? (isNumeric ? { user_id: Number(term) } : { username: { contains: term } }) : {}),
		employees: {
			isNot: null,
		},
	};

	const include: UsersInclude = {
		persons: {
			include: {
				phones: true,
			},
		},
		employees: {
			include: {
				departments: true,
				document_types: true,
			},
		},
		roles: true,
		customers: false,
	};

	const [data, total] = await Promise.all([
		prisma.users.findMany({
			skip,
			take: limit,
			include,
			where,
		}),

		prisma.users.count({
			where,
		}),
	]);

	const users: User[] = data.map((data) => {
		const { password, customers, ...user } = data;

		return {
			...user,
			employees: user.employees ?? undefined,
		};
	});

	const totalPages = Math.ceil(total / limit);

	return {
		success: true,
		data: users,
		currPage: page,
		totalPages,
		message: 'Users fetched successfully',
	};
};
