'use server';

import { AppError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteSize = async (size_code: string) => {
	try {
		const existingSize = await prisma.sizes.findUnique({
			where: { size_code },
		});

		if (!existingSize) {
			throw AppError.notFound(ErrorCode.SIZE_NOT_FOUND);
		}

		const existingReferences = await prisma.sizes.findFirst({
			where: { size_code },
			select: { product_variants: true },
		});

		if (existingReferences && existingReferences.product_variants.length > 0) {
			throw new AppError(ErrorCode.SIZE_HAS_VARIANTS);
		}

		await prisma.sizes.delete({
			where: { size_code },
		});

		revalidatePath('/system/sizes');

		return {
			success: true,
			message: 'Talla eliminada exitosamente',
		};
	} catch (error) {
		console.error('Error al eliminar la talla:', error);

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
			message: 'Error inesperado al eliminar la talla',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
