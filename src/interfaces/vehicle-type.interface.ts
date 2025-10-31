import { Decimal } from "@prisma/client/runtime/library";
import { Prisma } from '@prisma/client';


export interface VehicleType {
    vehicle_type_id: number;
    type_name: string;
    description: string | null;
    state: string;
    load_capacity_kg: number | Decimal;
    created_at: Date;
    updated_at: Date; 
}

export type VehicleTypesWhereInput = Prisma.vehicle_typesWhereInput;



