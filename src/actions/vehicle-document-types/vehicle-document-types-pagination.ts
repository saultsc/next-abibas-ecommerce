import { Response, vehicleDocumentType, vehicle_document_typesWhereInput } from '@/interfaces';
import { prisma } from '@/lib';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedVehicleDocumentTypes = async (
	params: Params
): Promise<Response<vehicleDocumentType[]>> => {
	const { page = 1, limit = 10, term } = params;
	const skip = (page - 1) * limit;

	const where: vehicle_document_typesWhereInput = {
		...(term ? { type_name: { contains: term } } : {}),
	};

	try {
		const [vehicleDocumentTypes, totalCount] = await Promise.all([
			prisma.vehicle_document_types.findMany({
				take: limit,
				skip,
				where,
			}),
			prisma.vehicle_document_types.count({
				where,
			}),
		]);

		const totalPages = Math.ceil(totalCount / limit);

		return {
			success: true,
			currPage: page,
			totalPages,
			data: vehicleDocumentTypes,
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al obtener los tipos de documentos de vehículos',
			data: [],
		};
	}
};
