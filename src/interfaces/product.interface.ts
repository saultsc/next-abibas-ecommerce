import { Category, Color, Size } from '@/interfaces';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
	product_id: number;
	product_name: string;
	description: string | null;
	price: Decimal | number;
	weight: Decimal | number | null;
	category_id: number;
	state: string;
	created_at: Date;
	updated_at: Date;
	variants?: ProductVariants[];
	images?: ProductImages[];
	category?: Category;
}

export interface ProductVariants {
	variant_id: number;
	product_id: number;
	color_id: number;
	size_code: string;
	price_adjustment: Decimal | number;
	stock_quantity: number;
	reorder_level: number;
	state: string;
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
	state: string;
	created_at: Date;
	updated_at: Date;
}

export type ProductWhereInput = Prisma.productsWhereInput;
export type ProductInclude = Prisma.productsInclude;

export type ProductVariantsWhereInput = Prisma.product_variantsWhereInput;
export type ProductVariantsInclude = Prisma.product_variantsInclude;

export type ProductImageWhereInput = Prisma.product_imagesWhereInput;
export type ProductImageInclude = Prisma.product_imagesInclude;
