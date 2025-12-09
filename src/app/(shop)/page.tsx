import { getPaginatedProducts } from '@/actions/products/product-pagination';

import { ProductGrid, Title } from '@/components';

interface Props {
	searchParams: Promise<{
		page?: string;
	}>;
}

export default async function HomePage({ searchParams }: Props) {
	const { page } = await searchParams;
	const currentPage = page ? parseInt(page) : 1;

	const { data: products, totalPages } = await getPaginatedProducts({
		page: currentPage,
		limit: 12,
	});

	if (!products || products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-800 mb-4">
						No hay productos por ahora
					</h2>
					<p className="text-gray-600 mb-6">
						Vuelve pronto para ver nuestros productos disponibles
					</p>
				</div>
			</div>
		);
	}

	// Serializar productos para pasar a componentes cliente
	const serializedProducts = JSON.parse(
		JSON.stringify(
			products.map((product) => ({
				...product,
				price: Number(product.price),
				weight: product.weight ? Number(product.weight) : null,
				variants: product.variants?.map((variant) => ({
					...variant,
					price_adjustment: Number(variant.price_adjustment),
				})),
			}))
		)
	);

	return (
		<>
			<Title title="Catálogo" subTitle="Todos los productos" clssName="mb-2" />

			<ProductGrid products={serializedProducts} />

			{/* TODO: Agregar paginación */}
		</>
	);
}
