import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
	id_producto: number;
	titulo: string;
	descripcion: string;
	precio: Decimal;
	existencia: number;
	id_categoria: number;
	active: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface CartProduct {
	id: string;
	slug: string;
	title: string;
	price: number;
	quantity: number;
	size: Size;
	image: string;
}

export interface ProductImage {
	id_imagen: number;
	url: string;
	id_producto: number;
}

type Category = 'men' | 'women' | 'kid' | 'unisex';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type Type = 'shirts' | 'pants' | 'hoodies' | 'hats';
