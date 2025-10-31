'use server';

import { Category, CategoryWhereInput, Response } from '@/interfaces';
import { AppError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const getCategoryByTerm = async (term: string): Promise<Response<Category>> => {
	const isNumeric = !isNaN(Number(term));

	const where: CategoryWhereInput = {
		...(isNumeric ? { category_id: Number(term) } : { category_name: term }),
	};

	try {
		const category = await prisma.categories.findFirst({
			where,
		});

		if (!category) throw AppError.notFound(ErrorCode.CATEGORY_NOT_FOUND);

		return {
			success: true,
			data: category,
		};
	} catch (error) {
		if (AppError.isAppError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		return {
			success: false,
			message: 'Error al obtener la categoría',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
