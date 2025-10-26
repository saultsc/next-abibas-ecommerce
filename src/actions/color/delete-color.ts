'use server';

import { Color, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteColor = async (color_id: number): Promise<Response<Color>> => {
	try {
		await prismaClient.colors.update({
			where: { color_id },
			data: { is_active: false, is_delete: true, updated_at: new Date() },
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
