'use server';

import { VehicleStatus, VehicleStatusWhereInput, Response } from '@/interfaces';
import prismaClient from '@/lib/prisma';

export const searchVehicleStatus = async (term: string): Promise<Response<VehicleStatus[]>> => {
    const where: VehicleStatusWhereInput = {
        ...(term
            ? !isNaN(Number(term))
                ? { vehicle_status_id: Number(term) }
                : { status_name: { contains: term } }
            : {}),
        ...{ state: 'A' },
    };

    try {
        const vehicleStatus = await prismaClient.vehicle_statuses.findMany({
            where,
        });

        return { success: true, data: vehicleStatus, message: 'Vehicle statuses encontradas' };
    } catch (error) {
    return { success: false, message: 'Error searching vehicle statuses' };
    }
};
