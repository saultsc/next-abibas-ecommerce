export const revalidate = 0;

import { Column, Pagination, Table, Title } from '@/components';
import { ProductImage } from '@/components/product/ProductImage';
import { Product } from '@/interfaces';
import { currencyFormat } from '@/utils';

import Link from 'next/link';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

// Momentaneo
interface fetchingProductsResponse {
	products: Product[];
	currentPage: number;
	totalPages: number;
}

export default async function OrdersPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { products = [], currentPage, totalPages } = {} as fetchingProductsResponse;

	const productColumns: Column<Product>[] = [
		{
			header: 'Imagen',
			cell: (p: Product) => (
				<Link href={`products/${p.slug}`}>
					<ProductImage
						src={p.productImage[0]?.url || ''}
						width={80}
						height={80}
						alt={p.title}
						className="w-20 h-20 object-cover rounded"
					/>
				</Link>
			),
		},
		{
			header: 'Titulo',
			cell: (p: Product) => (
				<Link href={`products/${p.slug}`} className="hover:underline">
					{p.title}
				</Link>
			),
		},
		{
			header: 'Precio',
			cell: (p: Product) => <span className="font-bold">{currencyFormat(p.price)}</span>,
		},
		{
			header: 'Género',
			cell: (p: Product) => <>{p.gender}</>,
		},
		{
			header: 'Existencia',
			cell: (p: Product) => <span className="font-bold">{p.inStock}</span>,
		},
		{
			header: 'Tallas',
			cell: (p: Product) => <span className="font-bold">{p.sizes.join(', ')}</span>,
		},
	];

	return (
		<>
			<Title title="Productos" />

			<div className="flex justify-end mb-5">
				<Link href="products/new" className="btn-primary">
					Nuevo producto
				</Link>
			</div>

			<div className="mb-10">
				<Table columns={productColumns} rows={products} />
				{totalPages > 1 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
