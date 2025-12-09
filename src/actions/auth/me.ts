'use server';

import { cookies, headers } from 'next/headers';

import { Response, User } from '@/interfaces';
import { CustomError, ErrorCode, prisma, verifyToken } from '@/lib';

/**
 * Obtiene la información del usuario autenticado desde el JWT
 * Busca el token en el header Authorization (Bearer token) o en las cookies
 */
export const me = async (): Promise<Response<User>> => {
	try {
		// Obtener headers y cookies
		const headersList = await headers();
		const cookieStore = await cookies();

		let token: string | undefined;

		const authHeader = headersList.get('authorization');
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.substring(7);
		}

		if (!token) {
			token = cookieStore.get('token')?.value;
		}

		if (!token) throw CustomError.unauthorized(ErrorCode.UNAUTHORIZED);

		const decoded = verifyToken(token);

		if (!decoded) throw CustomError.unauthorized(ErrorCode.INVALID_TOKEN);

		const { user_id } = decoded;

		const user = await prisma.users.findUnique({
			where: {
				user_id: user_id,
				state: 'A',
			},
			include: {
				roles: true,
			},
		});

		if (!user) throw CustomError.notFound(ErrorCode.USER_NOT_FOUND);

		if (user.state !== 'A') {
			throw CustomError.forbidden(ErrorCode.USER_INACTIVE);
		}

		const { password, ...me } = user;

		return {
			success: true,
			data: me,
			message: 'Usuario obtenido exitosamente',
			code: 200,
		};
	} catch (error) {
		console.log({ error });

		if (error instanceof CustomError) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener la información del usuario',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
