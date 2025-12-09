'use server';

import { prisma } from '@/lib';

import { Response, User, UserInclude, UserWhereInput } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';

export const getCustomerByTerm = async (term: string): Promise<Response<User>> => {
	const isNumeric = !isNaN(Number(term));

	const where: UserWhereInput = {
		...(term ? (isNumeric ? { user_id: Number(term) } : { username: term }) : {}),
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
				// Todo: addresses?
			},
		},
		states: true,
	};

	try {
		const data = await prisma.users.findFirst({
			where,
			include,
		});

		if (!data) throw CustomError.notFound(ErrorCode.CUSTOMER_NOT_FOUND);

		const { password, employees, roles, ...user } = data;

		return {
			success: true,
			data: {
				...user,
				customers: user.customers
					? {
							...user.customers,
							total_spent: Number(user.customers.total_spent),
					  }
					: undefined,
			},
			message: 'Cliente encontrado',
			code: 200,
		};
	} catch (error) {
		if (error instanceof CustomError) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener el cliente',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
