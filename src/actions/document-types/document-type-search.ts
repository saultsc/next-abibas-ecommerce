'use server';

import prisma from '@/lib/prisma';

import { DocumentType, DocumentTypesWhereInput, Response } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchDocumentTypes = async (
	term: string,
	take: number = 30
): Promise<Response<DocumentType[]>> => {
	const isNumeric = !isNaN(Number(term));

	const where: DocumentTypesWhereInput = {
		...(term
			? isNumeric
				? { document_type_id: Number(term) }
				: { type_name: { contains: term } }
			: {}),
		...{ state: 'A' },
	};

	try {
		const documentTypes = await prisma.document_types.findMany({
			where,
			take,
		});

		return {
			success: true,
			data: documentTypes,
			message: 'Document types found successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error searching document types',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
