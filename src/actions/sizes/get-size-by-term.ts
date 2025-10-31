'use server';

import { Response, Size, SizesWhereInput } from '@/interfaces';
import { AppError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const getSizeByTerm = async (term: string): Promise<Response<Size>> => {
	const where: SizesWhereInput = {
		...{ size_code: { contains: term } },
	};

	try {
		const size = await prisma.sizes.findFirst({
			where: where,
		});

		if (!size) throw AppError.notFound(ErrorCode.SIZE_NOT_FOUND);

		return {
			success: true,
			data: size,
		};
	} catch (error) {
		if (AppError.isAppError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		// Error desconocido
		return {
			success: false,
			message: 'Error inesperado al obtener la talla',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
