'use server';

import { Product, Response } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const deleteProduct = async (product_id: number): Promise<Response<Product>> => {
	try {
		const isExisting = await prisma.products.findUnique({
			where: { product_id },
		});

		if (!isExisting) {
			throw CustomError.notFound(ErrorCode.PRODUCT_NOT_FOUND);
		}

		const existingReferences = await prisma.products.findFirst({
			where: { product_id },
			select: { product_variants: true },
		});

		if (existingReferences && existingReferences.product_variants.length > 0) {
			throw new CustomError(ErrorCode.PRODUCT_HAS_VARIANTS);
		}

		await prisma.products.delete({
			where: { product_id },
		});

		return {
			success: true,
			message: 'Producto eliminado exitosamente',
		};
	} catch (error) {
		console.error('Error al eliminar el producto:', error);

		if (CustomError.isCustomError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error inesperado al eliminar el producto',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
