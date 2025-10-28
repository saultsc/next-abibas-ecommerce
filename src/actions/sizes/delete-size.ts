'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteSize = async (size_code: string) => {
	try {
		const existingSize = await prisma.sizes.findUnique({
			where: { size_code },
		});

		if (!existingSize)
			return {
				success: false,
				message: 'No se puede eliminar una talla que no existe',
			};

		const existingReferences = await prisma.sizes.findFirst({
			where: { size_code },
			select: { product_variants: true },
		});

		if (existingReferences && existingReferences.product_variants.length > 0) {
			return {
				success: false,
				message:
					'No se puede eliminar la talla porque está asociada a variantes de productos',
			};
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
		return {
			success: false,
			message: 'Error al eliminar la talla',
		};
	}
};
