'use server';
import { Product, Response } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = {
	id_producto: z.number().optional(),
	titulo: z.string().min(3).max(100),
	descripcion: z.string().min(10).max(500),
	precio: z.coerce
		.number()
		.min(0)
		.transform((val) => Number(val.toFixed(2))),
	id_categoria: z.number(),
	existencia: z.number().optional(),
	active: z.boolean().default(true),
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

	const { id_producto, ...rest } = productParsed;

	try {
		const prismaTx = await prisma.$transaction(async (tx) => {
			let product: Product;

			if (id_producto) {
				product = await tx.productos.update({
					where: { id_producto },
					data: { ...rest },
				});
			} else {
				const newProductId = (await prisma.productos.count()) + 1;

				product = await tx.productos.create({
					data: { id_producto: newProductId, ...rest },
				});
			}

			if (formData.getAll('images')) {
				const images = await uploadImages(formData.getAll('images') as File[]);
				if (!images) {
					throw new Error('No se pudo cargar las imágenes, rollingback');
				}

				await prisma.imagenes_url.createMany({
					data: images.map((image) => ({
						url: image!,
						id_producto: product.id_producto,
					})),
				});
			}

			return product;
		});

		revalidatePath('/system/products');
		revalidatePath(`/system/products/${id_producto}`);
		revalidatePath(`/products/${id_producto}`);

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
