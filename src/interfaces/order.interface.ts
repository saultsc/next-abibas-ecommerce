import { Prisma } from '@/generated';
import { ProductVariants } from '@/interfaces';
import { Address } from 'cluster';

export interface Order {
	order_id: number;
	order_number: string;
	customer_id: number;
	shipping_address_id: number;
	order_status_id: number;
	subtotal: number;
	tax_amount: number;
	shipping_cost: number;
	discount_amount: number;
	total_amount: number;
	estimated_delivery_date: Date | null;
	actual_delivery_date: Date | null;
	notes: string | null;
	state: string;
	created_at: Date;
	updated_at: Date;
	order_items?: OrderItem[];
	order_statuses?: OrderStatus;
	addresses?: Address;
}

export interface OrderItem {
	order_id: number;
	variant_id: number;
	quantity: number;
	unit_price: number;
	discount: number;
	subtotal: number | null;
	created_at: Date;
	updated_at: Date;
	product_variants?: ProductVariants;
}

export interface OrderStatus {
	order_status_id: number;
	status_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type OrderWhereInput = Prisma.ordersWhereInput;
export type OrderInclude = Prisma.ordersInclude;
export type OrderItemWhereInput = Prisma.order_itemsWhereInput;
export type OrderItemInclude = Prisma.order_itemsInclude;
