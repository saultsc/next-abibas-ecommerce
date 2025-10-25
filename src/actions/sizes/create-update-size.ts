'use server';

import prismaClient from '@/lib/prisma';
import { z } from 'zod';

const sizeSchema = {
	size_code: z.string().min(1, 'El código del talla es obligatorio'),
	is_active: z.preprocess((val) => val === 'true', z.boolean().default(true)),
};

export const createUpdateSize = async (formData: FormData) => {
	const data = Object.fromEntries(formData.entries());
	const sizeParsed = z.object(sizeSchema).parse(data);

	if (!sizeParsed) {
		return {
			success: false,
			message: 'Datos del talla inválidos',
		};
	}

	const { size_code, ...rest } = sizeParsed;
	try {
		let size;
		if (size_code) {
			size = await prismaClient.sizes.update({
				where: { size_code },
				data: { ...rest, updated_at: new Date() },
			});
		} else {
			size = await prismaClient.sizes.create({
				data: { size_code, ...rest },
			});
		}
		return {
			success: true,
			message: 'Talla guardada exitosamente',
			size,
		};
	} catch (error) {
		console.error('Error al crear/actualizar la talla:', error);
		return {
			success: false,
			message: 'Error al guardar la talla',
		};
	}
};
