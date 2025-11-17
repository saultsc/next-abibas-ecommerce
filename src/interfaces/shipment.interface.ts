import { Prisma } from '@prisma/client';

export interface Shipment {
	shipment_id: number;
	shipment_number: string;
	vehicle_id: number;
	driver_id: number;
	status_code: string;
	ship_date: Date;
	delivery_date: Date | null;
	notes: string | null;
	state: string;
	created_at: Date;
	updated_at: Date;
	shipment_orders?: ShipmentOrder[];
	deliveries?: Delivery[];
}

export interface ShipmentOrder {
	shipment_id: number;
	order_id: number;
	sequence: number;
	created_at: Date;
	updated_at: Date;
}

export interface Delivery {
	delivery_id: number;
	shipment_id: number;
	order_id: number;
	customer_id: number;
	received_by: string | null;
	delivery_date: Date;
	notes: string | null;
	signature_url: string | null;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type ShipmentWhereInput = Prisma.shipmentsWhereInput;
export type ShipmentInclude = Prisma.shipmentsInclude;

export type ShipmentOrderWhereInput = Prisma.shipment_ordersWhereInput;
export type ShipmentOrderInclude = Prisma.shipment_ordersInclude;

export type DeliveryWhereInput = Prisma.deliveriesWhereInput;
export type DeliveryInclude = Prisma.deliveriesInclude;
