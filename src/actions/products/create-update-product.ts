'use server';
import { Product, Response } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = {
	product_id: z.number().optional(),
	product_name: z.string().min(1, 'El nombre del producto es obligatorio'),
	sku: z.string().min(1, 'El SKU es obligatorio'),
	descripcion: z.string().min(10).max(500),
	price: z.coerce
		.number()
		.min(0)
		.transform((val) => Number(val.toFixed(2))),
	category_id: z.number(),
	is_active: z.boolean().default(true),
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
		const prismaTx = await prisma.$transaction(async (tx) => {
			let product: Product;

			if (product_id) {
				product = await tx.products.update({
					where: { product_id },
					data: { ...rest },
				});
			} else {
				const newProductId = (await prisma.products.count()) + 1;

				product = await tx.products.create({
					data: { product_id: newProductId, ...rest },
				});
			}

			if (formData.getAll('images')) {
				const images = await uploadImages(formData.getAll('images') as File[]);
				if (!images) {
					throw new Error('No se pudo cargar las imágenes, rollingback');
				}

				await prisma.product_images.createMany({
					data: images.map((image) => ({
						image_url: image!,
						product_id: product.product_id,
					})),
				});
			}

			return product;
		});

		revalidatePath('/system/products');
		revalidatePath(`/system/products/${product_id}`);
		revalidatePath(`/products/${product_id}`);

		return {
			success: true,
			data: prismaTx,
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al guardar el producto',
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
