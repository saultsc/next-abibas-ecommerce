'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Product } from '@/interfaces';
import { useState } from 'react';

interface Props {
	product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
	const firstImage = product.images?.[0]?.image_url || '/imgs/placeholder.jpg';
	const secondImage = product.images?.[1]?.image_url || firstImage;

	const [displayImage, setDisplayImage] = useState(firstImage);

	return (
		<div className="rounded-md overflow-hidden fade-in">
			<Link href={`/product/${product.product_id}`}>
				<Image
					src={displayImage}
					alt={`foto del producto ${product.product_name}`}
					width={500}
					height={500}
					priority
					className="w-full object-cover"
					onMouseEnter={() => setDisplayImage(secondImage)}
					onMouseLeave={() => setDisplayImage(firstImage)}
				/>
			</Link>

			<div className="p-4 flex flex-col">
				<Link className="hover:text-blue-600" href={`/product/${product.product_id}`}>
					{product.product_name}
				</Link>
				<span className="font-bold">${Number(product.price).toFixed(2)}</span>
			</div>
		</div>
	);
};
