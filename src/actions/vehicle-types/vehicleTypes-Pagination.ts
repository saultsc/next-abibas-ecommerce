import { Response, VehicleType, VehicleTypesWhereInput } from '@/interfaces';
import prisma from '@/lib/prisma';

interface Params {
    page?: number;
    limit?: number;
    term?: string;
}

export const getPaginatedVehicleTypes = async (params: Params): Promise<Response<VehicleType[]>> => {
    const { page = 1, limit = 10, term } = params;
    const skip = (page - 1) * limit;

    const where: VehicleTypesWhereInput = {
        ...(term ? { type_name: { contains: term } } : {}),
    };

    try {
        const [vehicleTypes, totalCount] = await Promise.all([
            prisma.vehicle_types.findMany({
                take: limit,
                skip,
                where,
            }),
            prisma.vehicle_types.count({
                where,
            }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            success: true,
            currPage: page,
            totalPages,
            data: vehicleTypes,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error al obtener los tipos de vehículo',
            data: [],
        };
    }
};