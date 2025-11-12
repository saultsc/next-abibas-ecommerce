import {
	DocumentType,
	DocumentTypesInclude,
	DocumentTypesWhereInput,
	Response,
} from '@/interfaces';
import { ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedDocumentTypes = async (
	params: Params
): Promise<Response<DocumentType[]>> => {
	const { page = 1, limit = 10, term = '' } = params;
	const skip = (page - 1) * limit;

	const isNumeric = !isNaN(Number(term));

	const where: DocumentTypesWhereInput = {
		...(term
			? isNumeric
				? { document_type_id: Number(term) }
				: { type_name: { contains: term } }
			: {}),
	};

	const include: DocumentTypesInclude = {};

	try {
		const [data, total] = await Promise.all([
			prisma.document_types.findMany({
				skip,
				take: limit,
				where,
				include,
			}),
			prisma.document_types.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			success: true,
			data,
			currPage: page,
			totalPages,
			message: 'Document types fetched successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error fetching document types',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
