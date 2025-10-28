import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Color } from './color.interface';
import { Size } from './size.interface';

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
	variants?: ProductVariants[];
	images?: ProductImages[];
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
	colors?: Color;
	sizes?: Size;
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

export type ProductWhereInput = Prisma.productsWhereInput;
export type ProductInclude = Prisma.productsInclude;
