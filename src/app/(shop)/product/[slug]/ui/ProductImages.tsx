'use client';

import { ProductImages as ProductImage } from '@/interfaces';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
	images: ProductImage[];
	productName: string;
}

export const ProductImages = ({ images, productName }: Props) => {
	const [selectedImage, setSelectedImage] = useState(
		images[0]?.image_url || '/imgs/placeholder.jpg'
	);

	if (!images || images.length === 0) {
		return (
			<div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
				<p className="text-gray-500">No hay imágenes disponibles</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Imagen principal */}
			<div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
				<Image
					src={selectedImage}
					alt={productName}
					fill
					className="object-contain"
					priority
				/>
			</div>

			{/* Miniaturas */}
			{images.length > 1 && (
				<div className="grid grid-cols-5 gap-2">
					{images.map((image) => (
						<button
							key={image.image_id}
							onClick={() => setSelectedImage(image.image_url)}
							className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
								selectedImage === image.image_url
									? 'border-blue-500'
									: 'border-transparent hover:border-gray-300'
							}`}>
							<Image
								src={image.image_url}
								alt={`${productName} - ${image.image_id}`}
								fill
								className="object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
