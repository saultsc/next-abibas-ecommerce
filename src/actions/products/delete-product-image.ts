'use server';

import { Response } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteProductImage = async (image_id: number): Promise<Response> => {
	try {
		const isExisting = await prisma.product_images.findUnique({
			where: { image_id },
		});

		if (!isExisting) throw CustomError.notFound(ErrorCode.PRODUCT_IMAGE_NOT_FOUND);

		await prisma.product_images.delete({
			where: { image_id },
		});

		if (isExisting.image_url) {
			await deleteImageFile(isExisting.image_url);
		}

		revalidatePath('/');
		revalidatePath('products');
		revalidatePath(`products/${isExisting.product_id}`);

		return {
			success: true,
			message: 'Imagen del producto eliminada correctamente',
			code: 200,
		};
	} catch (error) {
		if (CustomError.isCustomError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}
		return {
			success: false,
			message: 'Error al eliminar la imagen del producto',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};

const deleteImageFile = async (imageUrl: string) => {
	try {
		const fs = await import('fs/promises');
		const filePath = `public${imageUrl}`;

		await fs.access(filePath);
		await fs.unlink(filePath);
	} catch (error) {
		console.warn(`No se pudo eliminar el archivo: ${imageUrl}`, error);
	}
};
