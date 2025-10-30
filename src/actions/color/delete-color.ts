'use server';

import { Color, Response } from '@/interfaces';
import { AppError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteColor = async (color_id: number): Promise<Response<Color>> => {
	try {
		const isExisting = await prisma.colors.findUnique({
			where: { color_id },
		});

		if (!isExisting) {
			throw AppError.notFound(ErrorCode.COLOR_NOT_FOUND);
		}

		const existingReferences = await prisma.colors.findFirst({
			where: { color_id },
			select: { product_variants: true },
		});

		if (existingReferences && existingReferences.product_variants.length > 0) {
			throw new AppError(ErrorCode.COLOR_HAS_VARIANTS);
		}

		await prisma.colors.delete({
			where: { color_id },
		});

		revalidatePath('/system/colors');

		return {
			success: true,
			message: 'Color eliminado exitosamente',
		};
	} catch (error) {
		console.error('Error al eliminar el color:', error);

		// Si es un error personalizado, devolver su mensaje y código
		if (AppError.isAppError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		// Error desconocido
		return {
			success: false,
			message: 'Error inesperado al eliminar el color',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
