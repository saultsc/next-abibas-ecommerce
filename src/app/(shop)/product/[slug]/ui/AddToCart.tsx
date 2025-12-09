'use client';

import { QuantitySelector } from '@/components';
import { Product, ProductVariants } from '@/interfaces';
import { useCartStore } from '@/store';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
	product: Product;
}

export const AddToCart = ({ product }: Props) => {
	const addToCart = useCartStore((state) => state.addToCart);

	const [selectedVariant, setSelectedVariant] = useState<ProductVariants | null>(
		product.variants?.[0] || null
	);
	const [quantity, setQuantity] = useState(1);

	// Agrupar variantes por color
	const colors = Array.from(new Set(product.variants?.map((v) => v.color_id))).map((colorId) => {
		const variant = product.variants?.find((v) => v.color_id === colorId);
		return {
			color_id: colorId,
			color_name: variant?.colors?.color_name,
			hex_code: variant?.colors?.hex_code,
		};
	});

	// Obtener tallas disponibles para el color seleccionado
	const availableSizes = product.variants
		?.filter((v) => v.color_id === selectedVariant?.color_id)
		.map((v) => ({
			size_code: v.size_code,
			stock: v.stock_quantity,
		}));

	const handleColorChange = (colorId: number) => {
		const newVariant = product.variants?.find((v) => v.color_id === colorId);
		if (newVariant) {
			setSelectedVariant(newVariant);
			setQuantity(1);
		}
	};

	const handleSizeChange = (sizeCode: string) => {
		const newVariant = product.variants?.find(
			(v) => v.color_id === selectedVariant?.color_id && v.size_code === sizeCode
		);
		if (newVariant) {
			setSelectedVariant(newVariant);
			setQuantity(1);
		}
	};

	const handleAddToCart = () => {
		if (!selectedVariant) {
			toast.error('Por favor selecciona una variante');
			return;
		}

		if (selectedVariant.stock_quantity < quantity) {
			toast.error('Stock insuficiente');
			return;
		}

		const finalPrice = Number(product.price) + Number(selectedVariant.price_adjustment);

		addToCart({
			variantId: selectedVariant.variant_id,
			productId: product.product_id,
			productName: product.product_name,
			variantSku: `${product.product_id}-${selectedVariant.color_id}-${selectedVariant.size_code}`,
			sizeName: selectedVariant.size_code,
			colorName: selectedVariant.colors?.color_name || '',
			colorHex: selectedVariant.colors?.hex_code || null,
			quantity,
			price: finalPrice,
			stock: selectedVariant.stock_quantity,
			imageUrl: product.images?.[0]?.image_url || null,
		});

		toast.success('Producto agregado al carrito');
	};

	if (!product.variants || product.variants.length === 0) {
		return (
			<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
				<p className="text-yellow-800">Este producto no tiene variantes disponibles</p>
			</div>
		);
	}

	return (
		<div className="space-y-5">
			{/* Selector de Color */}
			<div>
				<h3 className="font-bold text-sm mb-2">Color</h3>
				<div className="flex gap-2">
					{colors.map((color) => (
						<button
							key={color.color_id}
							onClick={() => handleColorChange(color.color_id)}
							className={`px-4 py-2 rounded-lg border-2 transition-all ${
								selectedVariant?.color_id === color.color_id
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-300 hover:border-gray-400'
							}`}
							title={color.color_name || ''}>
							<div className="flex items-center gap-2">
								{color.hex_code && (
									<div
										className="w-6 h-6 rounded-full border border-gray-300"
										style={{ backgroundColor: color.hex_code }}
									/>
								)}
								<span className="text-sm">{color.color_name}</span>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Selector de Talla */}
			<div>
				<h3 className="font-bold text-sm mb-2">Talla</h3>
				<div className="flex gap-2">
					{availableSizes?.map((size) => (
						<button
							key={size.size_code}
							onClick={() => handleSizeChange(size.size_code)}
							disabled={size.stock === 0}
							className={`px-4 py-2 rounded-lg border-2 transition-all ${
								selectedVariant?.size_code === size.size_code
									? 'border-blue-500 bg-blue-50'
									: size.stock === 0
									? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
									: 'border-gray-300 hover:border-gray-400'
							}`}>
							{size.size_code}
						</button>
					))}
				</div>
			</div>

			{/* Stock disponible */}
			{selectedVariant && (
				<p className="text-sm text-gray-600">
					Stock disponible:{' '}
					<span className="font-semibold">{selectedVariant.stock_quantity}</span>
				</p>
			)}

			{/* Selector de cantidad */}
			<QuantitySelector
				quantity={quantity}
				onQuantityChanged={setQuantity}
				maxQuantity={selectedVariant?.stock_quantity || 0}
			/>

			{/* Precio final */}
			{selectedVariant && (
				<div className="text-2xl font-bold">
					${(Number(product.price) + Number(selectedVariant.price_adjustment)).toFixed(2)}
					{Number(selectedVariant.price_adjustment) !== 0 && (
						<span className="text-sm text-gray-500 ml-2">
							(${Number(selectedVariant.price_adjustment).toFixed(2)} ajuste)
						</span>
					)}
				</div>
			)}

			{/* Botón agregar al carrito */}
			<button
				onClick={handleAddToCart}
				disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
				className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
				Agregar al carrito
			</button>
		</div>
	);
};
