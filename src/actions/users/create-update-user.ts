'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib';
import dayjs from 'dayjs';
import z from 'zod';

import { Response, User } from '@/interfaces';
import { CustomError, ErrorCode, hashPassword } from '@/lib';

const userSchema = z.object({
	// Define user schema here
	user_id: z.coerce
		.number()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	person_id: z
		.union([z.string(), z.number()])
		.optional()
		.transform((val) => {
			if (!val || val === 'undefined' || val === 'null') return undefined;
			const num = Number(val);
			return isNaN(num) ? undefined : num;
		}),
	department_id: z.coerce.number().transform((val) => Number(val)),
	document_type_id: z.coerce.number().transform((val) => Number(val)),
	role_id: z.coerce.number().transform((val) => Number(val)),

	username: z.string().min(3).max(50),
	first_name: z.string().min(2).max(100),
	last_name: z.string().min(2).max(100),
	email: z.email(),
	password: z.string().min(6).max(100).optional(),
	date_of_birth: z.coerce.date().refine((date) => dayjs(date).isAfter(dayjs('1900-01-01')), {
		message: 'La fecha de nacimiento debe ser posterior a 1900',
	}),
	hire_date: z.coerce.date().refine((date) => dayjs(date).isAfter(dayjs('1900-01-01')), {
		message: 'La fecha de contratación debe ser posterior a 1900',
	}),
	document_number: z.string().min(4).max(20),
	state: z.enum(['A', 'I']).default('A'),
	phones: z
		.union([z.string(), z.array(z.any())])
		.optional()
		.transform((val) => {
			if (!val) return undefined;
			if (typeof val === 'string') {
				try {
					return JSON.parse(val);
				} catch {
					return undefined;
				}
			}
			return val;
		}),
	addresses: z
		.union([z.string(), z.array(z.any())])
		.optional()
		.transform((val) => {
			if (!val) return undefined;
			if (typeof val === 'string') {
				try {
					return JSON.parse(val);
				} catch {
					return undefined;
				}
			}
			return val;
		}),
});

export const createOrUpdateUser = async (formData: FormData): Promise<Response<User>> => {
	const data = Object.fromEntries(formData.entries());

	const userParsed = userSchema.safeParse(data);

	if (!userParsed.success)
		return {
			success: false,
			message: 'Datos de usuario inválidos',
			code: ErrorCode.VALIDATION_ERROR,
		};

	const { phones, addresses, user_id, ...userData } = userParsed.data;

	try {
		const isExist = await prisma.users.findFirst({
			where: {
				username: userData.username,
			},
		});

		if (isExist && isExist.user_id !== user_id)
			throw CustomError.badRequest(ErrorCode.USER_ALREADY_EXISTS);

		const isEmailExist = await prisma.persons.findFirst({
			where: {
				email: userData.email,
			},
		});

		if (isEmailExist && isEmailExist.person_id !== userData.person_id)
			throw CustomError.badRequest(ErrorCode.EMAIL_ALREADY_EXISTS);

		const isDocumentExist = await prisma.persons.findFirst({
			where: {
				document_number: userData.document_number,
			},
		});

		if (isDocumentExist && isDocumentExist.person_id !== userData.person_id)
			throw CustomError.badRequest(ErrorCode.DOCUMENT_ALREADY_EXISTS);

		let message;

		const prismaTx = await prisma.$transaction(async (tx) => {
			let user: User;

			if (user_id) {
				const persons = await tx.persons.update({
					where: { person_id: userData.person_id },
					data: {
						first_name: userData.first_name,
						last_name: userData.last_name,
						email: userData.email,
						document_type_id: userData.document_type_id,
						document_number: userData.document_number,
						date_of_birth: userData.date_of_birth,
						updated_at: new Date(),
					},
				});

				const userUpdateData: any = {
					username: userData.username,
					role_id: userData.role_id,
					state: userData.state,
					updated_at: new Date(),
				};

				if (userData.password && userData.password.length > 0) {
					const hashedPassword = await hashPassword(userData.password);
					userUpdateData.password = hashedPassword;
				}

				const updatedUser = await tx.users.update({
					where: { user_id: user_id },
					data: userUpdateData,
				});

				const employees = await tx.employees.update({
					where: { user_id: updatedUser.user_id },
					data: {
						hire_date: userData.hire_date,
						department_id: userData.department_id,
						updated_at: new Date(),
					},
				});

				const { password, ...rest } = updatedUser;

				user = { ...rest, persons: persons, employees };

				message = 'Usuario actualizado exitosamente';

				// Procesar teléfonos al actualizar
				if (phones && phones.length > 0) {
					for (const phone of phones) {
						if (phone.phone_id) {
							// Verificar si el teléfono existe en la BD
							const existingPhone = await tx.phones.findUnique({
								where: { phone_id: phone.phone_id },
							});

							if (existingPhone) {
								// Actualizar teléfono existente
								await tx.phones.update({
									where: { phone_id: phone.phone_id },
									data: {
										phone_number: phone.phone_number,
										phone_type_id: phone.phone_type_id,
										is_primary: phone.is_primary,
										state: phone.state || 'A',
										updated_at: new Date(),
									},
								});
							} else {
								// El ID es temporal, crear nuevo teléfono
								await tx.phones.create({
									data: {
										person_id: persons.person_id,
										phone_number: phone.phone_number,
										phone_type_id: phone.phone_type_id,
										is_primary: phone.is_primary,
										state: phone.state || 'A',
									},
								});
							}
						} else {
							// Crear nuevo teléfono
							await tx.phones.create({
								data: {
									person_id: persons.person_id,
									phone_number: phone.phone_number,
									phone_type_id: phone.phone_type_id,
									is_primary: phone.is_primary,
									state: phone.state || 'A',
								},
							});
						}
					}
				}

				// Procesar direcciones al actualizar
				if (addresses && addresses.length > 0) {
					for (const address of addresses) {
						if (address.address_id) {
							// Verificar si la dirección existe en la BD
							const existingAddress = await tx.addresses.findUnique({
								where: { address_id: address.address_id },
							});

							if (existingAddress) {
								// Actualizar dirección existente
								await tx.addresses.update({
									where: { address_id: address.address_id },
									data: {
										address_line1: address.address_line1,
										address_line2: address.address_line2,
										city_id: address.city_id,
										postal_code: address.postal_code,
										is_primary: address.is_primary,
										state: address.state || 'A',
										updated_at: new Date(),
									},
								});
							} else {
								// El ID es temporal, crear nueva dirección
								await tx.addresses.create({
									data: {
										person_id: persons.person_id,
										address_line1: address.address_line1,
										address_line2: address.address_line2,
										city_id: address.city_id,
										postal_code: address.postal_code,
										is_primary: address.is_primary,
										state: address.state || 'A',
									},
								});
							}
						} else {
							// Crear nueva dirección
							await tx.addresses.create({
								data: {
									person_id: persons.person_id,
									address_line1: address.address_line1,
									address_line2: address.address_line2,
									city_id: address.city_id,
									postal_code: address.postal_code,
									is_primary: address.is_primary,
									state: address.state || 'A',
								},
							});
						}
					}
				}
			} else {
				if (!userData.password) {
					throw CustomError.badRequest(ErrorCode.VALIDATION_ERROR);
				}

				const persons = await tx.persons.create({
					data: {
						first_name: userData.first_name,
						last_name: userData.last_name,
						email: userData.email,
						document_type_id: userData.document_type_id,
						document_number: userData.document_number,
						date_of_birth: userData.date_of_birth,
					},
				});

				const hashedPassword = await hashPassword(userData.password);

				const newUser = await tx.users.create({
					data: {
						username: userData.username,
						password: hashedPassword,
						role_id: userData.role_id,
						state: userData.state,
						person_id: persons.person_id,
					},
				});

				const employees = await tx.employees.create({
					data: {
						hire_date: userData.hire_date,
						department_id: userData.department_id,
						user_id: newUser.user_id,
					},
				});

				const { password, ...rest } = newUser;

				user = { ...rest, persons, employees };

				message = 'Usuario creado exitosamente';

				if (phones && phones.length > 0) {
					for (const phone of phones) {
						await tx.phones.create({
							data: {
								person_id: persons.person_id,
								phone_number: phone.phone_number,
								phone_type_id: phone.phone_type_id,
								is_primary: phone.is_primary,
								state: 'A',
							},
						});
					}
				}

				if (addresses && addresses.length > 0) {
					for (const address of addresses) {
						await tx.addresses.create({
							data: {
								person_id: persons.person_id,
								address_line1: address.address_line1,
								address_line2: address.address_line2,
								city_id: address.city_id,
								postal_code: address.postal_code,
								is_primary: address.is_primary,
								state: 'A',
							},
						});
					}
				}
			}

			return user;
		});

		const user = prismaTx;

		revalidatePath('/system/users');
		revalidatePath(`/system/users/${user_id ?? user.user_id}`);

		return {
			success: true,
			message,
			data: user,
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
			message: 'Error al crear o actualizar el usuario',
			code: ErrorCode.USER_CREATION_FAILED,
		};
	}
};
