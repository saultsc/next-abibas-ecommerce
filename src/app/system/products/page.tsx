export const revalidate = 0;

import { getPaginatedProducts } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { ProductImage } from '@/components/product/ProductImage';
import { Product } from '@/interfaces';
import { currencyFormat } from '@/utils';

import Link from 'next/link';
import { IoAddCircleOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
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
			cell: (p: Product) => {
				const hasImage = p.images && p.images.length > 0 && p.images[0]?.image_url;

				if (!hasImage) return null;

				return (
					<Link href={`products/${p.product_id}`}>
						<ProductImage
							src={p.images![0].image_url}
							width={80}
							height={80}
							alt={p.product_name}
							className="w-20 h-20 object-cover rounded"
						/>
					</Link>
				);
			},
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
			header: 'Precio Base',
			cell: (p: Product) => <span className="font-bold">{currencyFormat(p.price)}</span>,
		},
		{
			header: 'Talla(s)',
			cell: (p: Product) => {
				const sizes = Array.from(
					new Set((p.variants ?? []).map((v) => v.size_code).filter((s) => s && s.length))
				);

				return sizes.length > 0 ? (
					<span className="block truncate">{sizes.join(', ')}</span>
				) : null;
			},
		},
		{
			header: 'Color(es)',
			cell: (p: Product) => {
				const colors = Array.from(
					new Set(
						(p.variants ?? [])
							.map((v) => v.colors?.color_name)
							.filter((c) => c && c.length)
					)
				);

				return colors.length > 0 ? (
					<span className="block truncate">{colors.join(', ')}</span>
				) : null;
			},
		},
		{
			header: 'N.º variantes',
			cell: (p: Product) => {
				const variants = p.variants ?? [];
				return variants.length > 0 ? variants.length : null;
			},
		},
		{
			header: 'Categoría',
			cell: (p: Product) => p.category?.category_name || null,
		},
		{
			header: 'Estado',
			cell: (p: Product) => (
				<>
					<StateBadge state={p.state} />
				</>
			),
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
				<Table
					columns={productColumns}
					rows={products}
					rowHrefs={products.map((product) => `/system/products/${product.product_id}`)}
				/>
				<Pagination totalPages={totalPages} />
			</div>
		</>
	);
}
