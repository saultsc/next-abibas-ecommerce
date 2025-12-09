'use server';

import { prisma } from '@/lib';

import { Response, User, UserInclude, UserWhereInput } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';

export const getUserByTerm = async (term: string): Promise<Response<User>> => {
	const isNumeric = !isNaN(Number(term));

	const where: UserWhereInput = {
		...(term ? (isNumeric ? { user_id: Number(term) } : { username: term }) : {}),
		employees: {
			isNot: null,
		},
	};

	const include: UserInclude = {
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
		states: true,
	};

	try {
		const data = await prisma.users.findFirst({
			where,
			include,
		});

		if (!data) throw new CustomError(ErrorCode.USER_NOT_FOUND);

		const { password, customers, ...user } = data;

		return {
			success: true,
			data: {
				...user,
				employees: user.employees ?? undefined,
			},
			message: 'Usuario encontrado',
			code: 200,
		};
	} catch (error) {
		if (CustomError.isCustomError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener el usuario',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
