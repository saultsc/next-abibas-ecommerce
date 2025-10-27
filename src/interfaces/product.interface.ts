import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
	is_active: boolean;
	is_delete: boolean;
	created_at: Date;
	updated_at: Date;
	category_id: number;
	product_id: number;
	product_name: string;
	sku: string;
	description: string | null;
	price: Decimal;
	weight: Decimal | null;
}

export interface ProductVariant {
	variant_id: number;
	product_id: number;
	color_id: number;
	size_code: string;
	sku_variant: string;
	price_adjustment: Decimal;
	stock_quantity: number;
	reorder_level: number;
	is_active: boolean;
	is_delete: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface ProductImages {
	image_id: number;
	product_id: number;
	image_url: string;
	is_primary: boolean;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
}
