import { notFound } from 'next/navigation';

import {
	ProductMobileSlideShow,
	ProductSlideShow,
	QuantitySelector,
	SizeSelector,
} from '@/components';
import { titleFonts } from '@/config/fonts';
import { initialData } from '@/seed/seed';

interface Props {
	params: Promise<{
		slug: string;
	}>;
}

export default async function ({ params }: Props) {
	const { slug } = await params;

	const product = initialData.products.find((p) => p.slug === slug);

	if (!product) {
		notFound();
	}

	return (
		<div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
			{/* Mobile Slideshow */}
			<ProductMobileSlideShow
				images={product.productImage}
				title={product.title}
				className="block md:hidden"
			/>

			{/* Desktop Slideshow */}
			<div className="col-span-2 md:col-span-2">
				<ProductSlideShow
					images={product.productImage}
					title={product.title}
					className="hidden md:block"
				/>
			</div>

			{/* Detalles */}
			<div className="col-span-1 px-5 ">
				<h1 className={`${titleFonts.className} antialiased font-bold text-xl`}>
					{product.title}
				</h1>
				<p className="text-lg mb-5">${product.price}</p>

				{/* Selector de tallas */}
				<SizeSelector
					selectedSize={product.sizes[0] as any}
					availableSize={product.sizes as any}
				/>

				{/* Selector de cantidad */}
				<QuantitySelector quantity={1} />

				{/* Button */}
				<button className="btn-primary my-5">Agregar al carrito</button>

				{/* Descripcion */}
				<h3 className="font-bold text-sm">Descripcion</h3>
				<p className="font-light">{product.description}</p>
			</div>
		</div>
	);
}
