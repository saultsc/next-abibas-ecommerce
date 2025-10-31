// 'use server';

// import { Response, VehicleType, VehicleTypesWhereInput } from '@/interfaces';
// import { AppError, ErrorCode } from '@/lib';
// import prisma from '@/lib/prisma';

// export const getVehicleTypesByTerm = async (term: string): Promise<Response<VehicleType[]>> => {
//     const where: VehicleTypesWhereInput = {
//         ...{ type_name: { contains: term } },
//     };

//     try {
//         const vehicleTypes = await prisma.vehicle_types.findFirst({
//             where: where,
//         });

//         if (!vehicleTypes) throw AppError.notFound(ErrorCode.VEHICLE_TYPE_NOT_FOUND);
//         return {
//             success: true,
//             data: vehicleTypes,
//         };
//     } catch (error) {
//         if (AppError.isAppError(error)) {
//             return {
//                 success: false,
//                 message: error.message,
//                 code: error.code,
//             };
//         }

//         // Error desconocido
//         return {
//             success: false,
//             message: 'Error inesperado al obtener el tipo de vehículo',
//             code: ErrorCode.INTERNAL_ERROR,
//         };
//     }
// };
