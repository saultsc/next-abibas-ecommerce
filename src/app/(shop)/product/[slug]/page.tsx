import { notFound } from 'next/navigation';

import { getProductByTerm } from '@/actions/products/get-product-by-term';
import { titleFonts } from '@/config/fonts';

import { AddToCart } from './ui/AddToCart';
import { ProductImages } from './ui/ProductImages';

interface Props {
	params: Promise<{
		slug: string;
	}>;
}

export default async function ProductPage({ params }: Props) {
	const { slug } = await params;

	const { data: product, success } = await getProductByTerm(slug);

	if (!success || !product) {
		notFound();
	}

	// Serializar el producto para pasar a componentes cliente
	const serializedProduct = JSON.parse(
		JSON.stringify({
			...product,
			price: Number(product.price),
			weight: product.weight ? Number(product.weight) : null,
			variants: product.variants?.map((variant) => ({
				...variant,
				price_adjustment: Number(variant.price_adjustment),
			})),
		})
	);

	return (
		<div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
			{/* Imágenes del producto */}
			<div className="col-span-1 md:col-span-2">
				<ProductImages images={product.images || []} productName={product.product_name} />
			</div>

			{/* Detalles y agregar al carrito */}
			<div className="col-span-1 px-5">
				<h1 className={`${titleFonts.className} antialiased font-bold text-xl`}>
					{product.product_name}
				</h1>

				<p className="text-lg mb-5">${Number(product.price).toFixed(2)}</p>

				{/* Descripción */}
				{product.description && (
					<>
						<h3 className="font-bold text-sm mb-2">Descripción</h3>
						<p className="font-light mb-5">{product.description}</p>
					</>
				)}

				{/* Selector de variantes y agregar al carrito */}
				<AddToCart product={serializedProduct} />
			</div>
		</div>
	);
}
