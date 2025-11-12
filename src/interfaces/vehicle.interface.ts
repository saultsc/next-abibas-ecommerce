import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface VehicleType {
	vehicle_type_id: number;
	type_name: string;
	description: string | null;
	state: string;
	load_capacity_kg: Decimal | number;
	created_at: Date;
	updated_at: Date;
}

export interface VehicleStatus {
	vehicle_status_id: number;
	status_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export interface VehicleDocumentType {
	document_type_id: number;
	type_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export interface Vehicle {
	vehicle_id: number;
	vehicle_type_id: number;
	make: string;
	model: string;
	year: number;
	license_plate: string;
	vin: string | null;
	engine_number?: string | null;
	color: string | null;
	current_mileage: number;
	load_capacity_kg?: Decimal | number;
	vehicle_status_id: number;
	supplier_id: number | null;
	purchase_date: Date | null;
	purchase_price: Decimal | number | null;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type VehiclesWhereInput = Prisma.vehiclesWhereInput;
export type VehiclesInclude = Prisma.vehiclesInclude;

export type VehicleTypesWhereInput = Prisma.vehicle_typesWhereInput;
export type VehicleTypesInclude = Prisma.vehicle_typesInclude;

export type VehicleStatusWhereInput = Prisma.vehicle_statusesWhereInput;
export type VehicleStatusInclude = Prisma.vehicle_statusesInclude;

export type VehicleDocumentTypesWhereInput = Prisma.vehicle_document_typesWhereInput;
export type VehicleDocumentTypesInclude = Prisma.vehicle_document_typesInclude;
