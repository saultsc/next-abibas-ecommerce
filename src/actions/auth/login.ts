'use server';

import { cookies } from 'next/headers';

import { envs } from '@/config';
import { Response, User } from '@/interfaces';
import { CustomError, ErrorCode, generateToken, verifyPassword } from '@/lib';
import prisma from '@/lib/prisma';
import z from 'zod';

interface LoginResponse extends User {
	token: string;
}

const loginSchema = z.object({
	username: z.string().min(3).max(50),
	password: z.string().min(6).max(100),
});

export const login = async (formData: FormData): Promise<Response<LoginResponse>> => {
	const data = Object.fromEntries(formData.entries());

	const parsedData = loginSchema.safeParse(data);

	if (!parsedData.success)
		return {
			success: false,
			message: 'Datos de inicio de sesión inválidos',
			code: ErrorCode.VALIDATION_ERROR,
		};

	const { username, password } = parsedData.data;

	try {
		const user = await prisma.users.findFirst({
			where: {
				username,
			},
		});

		if (!user)
			throw CustomError.badRequest(
				ErrorCode.USER_INVALID_CREDENTIALS,
				'Usuario o contraseña incorrectos'
			);

		if (user.state !== 'A')
			throw CustomError.forbidden(
				ErrorCode.USER_INACTIVE,
				'El usuario está inactivo. Contacta al administrador.'
			);

		const isPasswordValid = await verifyPassword(password, user.password || '');

		if (!isPasswordValid)
			throw CustomError.badRequest(
				ErrorCode.USER_INVALID_CREDENTIALS,
				'Usuario o contraseña incorrectos'
			);

		await prisma.users.update({
			where: { user_id: user.user_id },
			data: { last_login: new Date() },
		});

		const token = generateToken(
			{
				user_id: user.user_id,
				username: user.username,
			},
			envs.JWT_EXPIRES_IN === 7200 ? '2h' : '7d'
		);

		const cookieStore = await cookies();
		cookieStore.set('token', token, {
			httpOnly: true,
			secure: envs.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: envs.JWT_EXPIRES_IN,
			path: '/',
		});

		const { password: _, ...loginUser } = user;

		return {
			success: true,
			data: {
				...loginUser,
				token,
			},
			message: 'Inicio de sesión exitoso',
			code: 200,
		};
	} catch (error) {
		console.error('Error en login:', error);

		if (error instanceof CustomError) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al iniciar sesión',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
