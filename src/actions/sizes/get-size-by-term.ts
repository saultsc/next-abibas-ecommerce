'use server';

import { Response, Size, SizeWhereInput } from '@/interfaces';
import { CustomError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const getSizeByTerm = async (term: string): Promise<Response<Size>> => {
	const where: SizeWhereInput = {
		...{ size_code: { contains: term } },
	};

	try {
		const size = await prisma.sizes.findFirst({
			where: where,
		});

		if (!size) throw CustomError.notFound(ErrorCode.SIZE_NOT_FOUND);

		return {
			success: true,
			data: size,
		};
	} catch (error) {
		if (CustomError.isCustomError(error)) {
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
