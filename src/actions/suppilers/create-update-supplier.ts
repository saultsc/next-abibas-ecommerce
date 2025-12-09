'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib';
import dayjs from 'dayjs';
import z from 'zod';

import { Response, Supplier } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';

const supplierSchema = z.object({
	supplier_id: z.coerce
		.number()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	person_id: z.coerce
		.number()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	document_type_id: z.coerce.number().transform((val) => Number(val)),

	company_name: z.string().min(2).max(200).optional().or(z.literal('')),
	first_name: z.string().min(2).max(100),
	last_name: z.string().min(2).max(100),
	email: z.string().email().optional().or(z.literal('')),
	date_of_birth: z.coerce
		.date()
		.refine((date) => dayjs(date).isAfter(dayjs('1900-01-01')), {
			message: 'La fecha de nacimiento debe ser posterior a 1900',
		})
		.optional(),
	document_number: z.string().min(4).max(20),
	state: z.enum(['A', 'I']).default('A'),
	phones: z
		.array(
			z.object({
				phone_number: z.string().min(10).max(15),
				phone_type_id: z.number().min(1),
				party_id: z.number().min(1),
				state: z.enum(['A', 'I']).default('A'),
			})
		)
		.optional(),
});

export const createOrUpdateSupplier = async (formData: FormData): Promise<Response<Supplier>> => {
	const data = Object.fromEntries(formData.entries());

	const supplierParsed = supplierSchema.safeParse(data);

	if (!supplierParsed.success)
		return {
			success: false,
			message: 'Datos de suplidor inválidos',
			code: ErrorCode.VALIDATION_ERROR,
		};

	const { phones, supplier_id, ...supplierData } = supplierParsed.data;

	try {
		if (supplierData.company_name) {
			const isCompanyExist = await prisma.suppliers.findFirst({
				where: {
					company_name: supplierData.company_name,
				},
			});

			if (isCompanyExist && isCompanyExist.supplier_id !== supplier_id)
				throw CustomError.badRequest(ErrorCode.SUPPLIER_ALREADY_EXISTS);
		}

		if (supplierData.email) {
			const isEmailExist = await prisma.persons.findFirst({
				where: {
					email: supplierData.email,
				},
			});

			if (isEmailExist && isEmailExist.person_id !== supplierData.person_id)
				throw CustomError.badRequest(ErrorCode.EMAIL_ALREADY_EXISTS);
		}

		const isDocumentExist = await prisma.persons.findFirst({
			where: {
				document_number: supplierData.document_number,
			},
		});

		if (isDocumentExist && isDocumentExist.person_id !== supplierData.person_id)
			throw CustomError.badRequest(ErrorCode.DOCUMENT_ALREADY_EXISTS);

		let message;

		const prismaTx = await prisma.$transaction(async (tx) => {
			let supplier: Supplier;

			if (supplier_id) {
				const persons = await tx.persons.update({
					where: { person_id: supplierData.person_id },
					data: {
						first_name: supplierData.first_name,
						last_name: supplierData.last_name,
						email: supplierData.email || null,
						date_of_birth: supplierData.date_of_birth || null,
						document_type_id: supplierData.document_type_id,
						document_number: supplierData.document_number,
						updated_at: new Date(),
					},
				});

				const updatedSupplier = await tx.suppliers.update({
					where: { supplier_id: supplier_id },
					data: {
						company_name: supplierData.company_name || null,
						state: supplierData.state,
						updated_at: new Date(),
					},
				});

				supplier = { ...updatedSupplier, persons };

				message = 'Suplidor actualizado exitosamente';
			} else {
				const persons = await tx.persons.create({
					data: {
						first_name: supplierData.first_name,
						last_name: supplierData.last_name,
						email: supplierData.email || null,
						date_of_birth: supplierData.date_of_birth || null,
						document_type_id: supplierData.document_type_id,
						document_number: supplierData.document_number,
					},
				});

				const newSupplier = await tx.suppliers.create({
					data: {
						company_name: supplierData.company_name || null,
						state: supplierData.state,
						person_id: persons.person_id,
					},
				});

				supplier = { ...newSupplier, persons };

				message = 'Suplidor creado exitosamente';
			}

			// Todo: Process Phones

			// Todo: Process Addresses

			return supplier;
		});

		const supplier = prismaTx;

		revalidatePath('/system/suppliers');
		revalidatePath(`/system/suppliers/${supplier_id ?? supplier.supplier_id}`);

		return {
			success: true,
			message,
			data: supplier,
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
			message: 'Error al crear o actualizar el suplidor',
			code: ErrorCode.SUPPLIER_CREATION_FAILED,
		};
	}
};
