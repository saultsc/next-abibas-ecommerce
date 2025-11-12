'use server';

import { Response, User, UserInclude, UserWhereInput } from '@/interfaces';
import prisma from '@/lib/prisma';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedCustomers = async (params: Params): Promise<Response<User[]>> => {
	const { page = 1, limit = 10, term } = params;
	const skip = (page - 1) * limit;

	const isNumeric = !isNaN(Number(term));

	const where: UserWhereInput = {
		...(term ? (isNumeric ? { user_id: Number(term) } : { username: { contains: term } }) : {}),
		customers: {
			isNot: null,
		},
	};

	const include: UserInclude = {
		persons: {
			include: {
				phones: true,
			},
		},
		customers: {
			include: {
				orders: true,
			},
		},
		employees: false,
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

	const totalPages = Math.ceil(total / limit);

	const customers: User[] = data.map((data) => {
		const { password, role_id, employees, ...user } = data;

		return {
			...user,
			customers: user.customers
				? {
						...user.customers,
						total_spent: Number(user.customers.total_spent),
				  }
				: undefined,
		};
	});

	return {
		success: true,
		message: 'Clientes obtenidos correctamente',
		data: customers,
		totalPages,
		code: 200,
		currPage: page,
	};
};
