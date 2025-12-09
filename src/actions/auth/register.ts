'use server';
import { envs } from '@/config';
import { Response, User } from '@/interfaces';
import { CustomError, ErrorCode, generateToken, hashPassword, prisma } from '@/lib';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import z from 'zod';

const registerSchema = z.object({
	username: z.string().min(3).max(50),
	email: z.email().max(100),
	password: z.string().min(6).max(100),
	first_name: z.string().min(1).max(100),
	last_name: z.string().min(1).max(100),
	date_of_birth: z.coerce.date().refine((date) => dayjs(date).isBefore(dayjs()), {
		message: 'La fecha de nacimiento debe ser una fecha válida en el pasado',
	}),
});

export const register = async (formData: FormData): Promise<Response<User>> => {
	const data = Object.fromEntries(formData.entries());

	const parsedData = registerSchema.safeParse(data);

	if (!parsedData.success) {
		return {
			success: false,
			message: 'Datos de registro inválidos',
			code: ErrorCode.VALIDATION_ERROR,
		};
	}

	const { username, password, ...person } = parsedData.data;

	try {
		const isExistUsername = await prisma.users.findFirst({
			where: {
				username,
			},
		});

		const isExistEmail = await prisma.persons.findFirst({
			where: {
				email: person.email,
			},
		});

		if (isExistUsername) {
			return {
				success: false,
				message: 'El nombre de usuario ya está en uso',
				code: ErrorCode.USER_ALREADY_EXISTS,
			};
		}

		if (isExistEmail) {
			return {
				success: false,
				message: 'El correo electrónico ya está en uso',
				code: ErrorCode.EMAIL_ALREADY_EXISTS,
			};
		}

		const prismaTx = await prisma.$transaction(async (tx) => {
			const newPerson = await tx.persons.create({
				data: {
					...person,
				},
			});

			const hashedPassword = await hashPassword(password);

			const user = await tx.users.create({
				data: {
					username,
					password: hashedPassword,
					person_id: newPerson.person_id,
				},
			});

			const customer = await tx.customers.create({
				data: {
					user_id: user.user_id,
				},
			});

			return {
				...user,
				persons: newPerson,
				customers: customer,
			};
		});

		const token = generateToken(
			{
				user_id: prismaTx.user_id,
				username: prismaTx.username,
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

		await prisma.users.update({
			where: { user_id: prismaTx.user_id },
			data: { last_login: new Date() },
		});

		const { password: _, ...newUser } = prismaTx;

		return {
			success: true,
			message: 'Registro exitoso',
			data: {
				...newUser,
				customers: {
					...newUser.customers,
					total_spent: Number(newUser.customers.total_spent),
				},
			},
		};
	} catch (error) {
		if (error instanceof CustomError) {
			return { success: false, message: error.message, code: error.code };
		}

		return {
			success: false,
			message: 'Error al registrar el usuario',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
