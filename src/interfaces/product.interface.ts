import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
	product_id: number;
	product_name: string;
	sku: string;
	price: Decimal;
	category_id: number;
	is_active: boolean;
	description?: string;
	weight?: Decimal;
	created_at: Date;
	updated_at: Date;
	images?: ProductImages[];
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
