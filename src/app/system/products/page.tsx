export const revalidate = 0;

import { getPaginatedProducts } from '@/actions';
import { Column, Pagination, Table, Title } from '@/components';
import { ProductImage } from '@/components/product/ProductImage';
import { Product } from '@/interfaces';
import { currencyFormat } from '@/utils';

import Link from 'next/link';
import { IoAddCircleOutline } from 'react-icons/io5';

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

	const { data: products = [], totalPages = 0 } = await getPaginatedProducts({
		page,
	});

	const productColumns: Column<Product>[] = [
		{
			header: 'Imagen',
			cell: (p: Product) => (
				<Link href={`products/${p.product_id}`}>
					<ProductImage
						src={p.images?.[0]?.image_url || ''}
						width={80}
						height={80}
						alt={p.product_name}
						className="w-20 h-20 object-cover rounded"
					/>
				</Link>
			),
		},
		{
			header: 'Titulo',
			cell: (p: Product) => (
				<Link href={`products/${p.product_id}`} className="hover:underline">
					{p.product_name}
				</Link>
			),
		},
		{
			header: 'Precio',
			cell: (p: Product) => <span className="font-bold">{currencyFormat(p.price)}</span>,
		},
		{
			header: 'Categoría',
			cell: (p: Product) => <>{p.category_id}</>,
		},
	];

	return (
		<>
			<Title title="Productos" />

			<div className="flex justify-end mb-5">
				<Link href="products/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table columns={productColumns} rows={products} />
				{totalPages > 1 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
