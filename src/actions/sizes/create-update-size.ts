'use server';

import { Response, Size } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const sizeSchema = {
	size_code: z.string().optional(),
	new_size_code: z
		.string()
		.min(1, 'El código del talla es obligatorio')
		.max(10, 'El código del talla debe tener máximo 10 caracteres'),
	state: z.enum(['A', 'I']).default('A'),
};

export const createOrUpdateSize = async (formData: FormData): Promise<Response<Size>> => {
	const data = Object.fromEntries(formData.entries());
	const sizeParsed = z.object(sizeSchema).parse(data);

	if (!sizeParsed) {
		return {
			success: false,
			message: 'Datos del talla inválidos',
		};
	}

	const { size_code, new_size_code, ...rest } = sizeParsed;
	try {
		let size;
		let message;

		const existingSize = await prisma.sizes.findUnique({
			where: { size_code },
		});

		if (existingSize) {
			size = await prisma.sizes.update({
				where: { size_code },
				data: { size_code: new_size_code, ...rest, updated_at: new Date() },
			});

			message = 'Talla actualizada exitosamente';
		} else {
			const isExisting = await prisma.sizes.findUnique({
				where: { size_code },
			});

			if (isExisting) throw new CustomError(ErrorCode.SIZE_ALREADY_EXISTS);

			size = await prisma.sizes.create({
				data: { size_code: new_size_code, ...rest },
			});

			message = 'Talla creada exitosamente';
		}

		revalidatePath('/system/sizes');
		revalidatePath(`/system/sizes/${size_code}`);

		return {
			success: true,
			message: message,
			data: size,
		};
	} catch (error) {
		if (CustomError.isCustomError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		// Error desconocido
		return {
			success: false,
			message: 'Error inesperado al procesar la talla',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
