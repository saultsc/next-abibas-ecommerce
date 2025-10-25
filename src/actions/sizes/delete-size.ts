'use server';

import prismaClient from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteSize = async (size_code: string) => {
	try {
		const existingSize = await prismaClient.sizes.findUnique({
			where: { size_code },
		});

		if (!existingSize)
			return {
				success: false,
				message: 'No se puede eliminar una talla que no existe',
			};

		await prismaClient.sizes.update({
			where: { size_code },
			data: { is_active: false, is_delete: true, updated_at: new Date() },
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
