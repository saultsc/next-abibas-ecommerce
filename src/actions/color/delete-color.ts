'use server';

import { Color, Response } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteColor = async (color_id: number): Promise<Response<Color>> => {
	try {
		const isExisting = await prisma.colors.findUnique({
			where: { color_id },
		});

		if (!isExisting) {
			return {
				success: false,
				message: 'Color no encontrado',
			};
		}

		const existingReferences = await prisma.colors.findFirst({
			where: { color_id },
			select: { product_variants: true },
		});

		if (existingReferences && existingReferences.product_variants.length > 0) {
			return {
				success: false,
				message:
					'No se puede eliminar el color porque está asociado a variantes de productos',
			};
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
		return {
			success: false,
			message: 'Error al eliminar el color',
		};
	}
};
