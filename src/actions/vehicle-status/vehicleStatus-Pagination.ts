import { Response, VehicleStatus, VehicleStatusWhereInput } from '@/interfaces';
import { prisma } from '@/lib';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedVehicleStatuses = async (
	params: Params
): Promise<Response<VehicleStatus[]>> => {
	const { page = 1, limit = 10, term } = params;
	const skip = (page - 1) * limit;

	const where: VehicleStatusWhereInput = {
		...(term ? { status_name: { contains: term } } : {}),
	};

	try {
		const [vehicleStatuses, totalCount] = await Promise.all([
			prisma.vehicle_statuses.findMany({
				take: limit,
				skip,
				where,
			}),
			prisma.vehicle_statuses.count({
				where,
			}),
		]);

		const totalPages = Math.ceil(totalCount / limit);

		return {
			success: true,
			currPage: page,
			totalPages,
			data: vehicleStatuses,
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error al obtener los tipos de vehículo',
			data: [],
		};
	}
};
