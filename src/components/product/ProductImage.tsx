'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Props {
	src?: string;
	alt: string;
	className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
	style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
	width: number;
	height: number;
}

export const ProductImage = ({ src, alt, className, style, width, height }: Props) => {
	const [imgSrc, setImgSrc] = useState(() => {
		if (!src) return '/imgs/placeholder.jpg';
		if (src.startsWith('http')) return src;
		if (src.startsWith('/products/')) return src;
		return `/products/${src}`;
	});

	return (
		<Image
			src={imgSrc}
			width={width}
			height={height}
			alt={alt}
			className={className}
			style={style}
			onError={() => {
				setImgSrc('/imgs/placeholder.jpg');
			}}
		/>
	);
};
