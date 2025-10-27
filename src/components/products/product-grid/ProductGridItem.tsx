'use client';

import Image from 'next/image';
import Link from 'next/link';

import { SeedProduct } from '@/seed/seed';
import { useState } from 'react';

interface Props {
	product: SeedProduct;
}

export const ProductGridItem = ({ product }: Props) => {
	const [displayImage, setDisplayImage] = useState(product.productImage[0]);

	return (
		<div className="rounded-md overflow-hidden fade-in">
			<Link href={`/product/${product.slug}`}>
				<Image
					src={`/products/${displayImage}`}
					alt={`foto del producto ${product.title}`}
					width={500}
					height={500}
					priority
					className="w-full object-cover"
					onMouseEnter={() => setDisplayImage(product.productImage[1])}
					onMouseLeave={() => setDisplayImage(product.productImage[0])}
				/>
			</Link>

			<div className="p-4 flex flex-col">
				<Link className="hover:text-blue-600" href={`/product/${product.slug}`}>
					{product.title}
				</Link>
				<span className="font-bold">${product.price}</span>
			</div>
		</div>
	);
};
