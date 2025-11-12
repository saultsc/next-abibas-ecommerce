'use server';
import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { Product, Response } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

const productSchema = {
	product_id: z.coerce.number().optional(),
	product_name: z.string().min(1, 'El nombre del producto es obligatorio'),
	description: z.string().min(10).max(500).optional().or(z.literal('')),
	price: z.coerce
		.number()
		.min(0)
		.transform((val) => Number(val.toFixed(2))),
	category_id: z.coerce.number().transform((val) => Number(val)),
	state: z.enum(['A', 'I']).default('A'),
};

export const createOrUpdateProduct = async (formData: FormData): Promise<Response<Product>> => {
	const data = Object.fromEntries(formData.entries());
	const productParsed = z.object(productSchema).parse(data);

	if (!productParsed) {
		return {
			success: false,
			message: 'Datos del producto inválidos',
		};
	}

	const { product_id, ...rest } = productParsed;

	try {
		let message;
		let uploadedImageUrls: (string | null)[] = [];

		const imageFiles = formData.getAll('images') as File[];
		if (imageFiles && imageFiles.length > 0) {
			const uploadResult = await uploadImages(imageFiles);
			if (!uploadResult || uploadResult.every((url) => url === null)) {
				throw new CustomError(ErrorCode.PRODUCT_UPLOAD_IMAGES_FAILED);
			}
			uploadedImageUrls = uploadResult;
		}

		try {
			const prismaTx = await prisma.$transaction(async (tx) => {
				let product: Product;

				if (product_id) {
					product = await tx.products.update({
						where: { product_id },
						data: { ...rest, updated_at: new Date() },
					});

					message = 'Producto actualizado exitosamente';
				} else {
					const isExisting = await tx.products.findFirst({
						where: { product_name: rest.product_name },
					});

					if (isExisting) {
						throw new CustomError(ErrorCode.PRODUCT_ALREADY_EXISTS);
					}

					product = await tx.products.create({
						data: { ...rest },
					});

					message = 'Producto creado exitosamente';
				}

				if (uploadedImageUrls.length > 0) {
					const validImages = uploadedImageUrls.filter((url) => url !== null);

					if (validImages.length > 0) {
						await tx.product_images.createMany({
							data: validImages.map((image) => ({
								image_url: image!,
								product_id: product.product_id,
							})),
						});
					}
				}

				return product;
			});

			revalidatePath('/system/products');
			revalidatePath(`/system/products/${product_id}`);
			revalidatePath(`/products/${product_id}`);

			const { price, weight, ...restProduct } = prismaTx;

			return {
				success: true,
				message: message,
				data: {
					...restProduct,
					price: Number(price),
					weight: weight ? Number(weight) : null,
				},
			};
		} catch (txError) {
			if (uploadedImageUrls.length > 0) {
				await rollbackUploadedImages(uploadedImageUrls);
			}
			throw txError;
		}
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
			message: 'Error inesperado al procesar el producto',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};

const uploadImages = async (images: File[]) => {
	try {
		const uploadPromises = images.map(async (image) => {
			try {
				const buffer = await image.arrayBuffer();
				const bytes = new Uint8Array(buffer);

				const timestamp = Date.now();
				const randomString = Math.random().toString(36).substring(2, 15);
				const extension = image.name.split('.').pop() || 'jpg';
				const fileName = `${timestamp}-${randomString}.${extension}`;

				const filePath = `public/products/${fileName}`;

				const fs = await import('fs/promises');
				await fs.writeFile(filePath, bytes);

				return `/products/${fileName}`;
			} catch (error) {
				console.log(error);
				return null;
			}
		});

		const uploadedImages = await Promise.all(uploadPromises);
		return uploadedImages;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const rollbackUploadedImages = async (imageUrls: (string | null)[]) => {
	try {
		const fs = await import('fs/promises');

		const deletePromises = imageUrls.map(async (imageUrl) => {
			if (!imageUrl) return;

			try {
				const filePath = `public${imageUrl}`;
				await fs.access(filePath);
				await fs.unlink(filePath);
				console.log(`Rollback: Imagen eliminada ${imageUrl}`);
			} catch (error) {
				console.warn(`Rollback: No se pudo eliminar ${imageUrl}`, error);
			}
		});

		await Promise.all(deletePromises);
	} catch (error) {
		console.error('Error durante el rollback de imágenes:', error);
	}
};
