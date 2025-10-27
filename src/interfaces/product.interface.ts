import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
	product_id: number;
	product_name: string;
	sku: string;
	description: string | null;
	price: Decimal;
	weight: Decimal | null;
	category_id: number;
	is_active: boolean;
	is_delete: boolean;
	created_at: Date;
	updated_at: Date;
	images?: ProductImages[];
	variants?: ProductVariants[];
}

export interface ProductVariants {
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
