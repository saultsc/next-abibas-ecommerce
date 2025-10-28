'use client';

import { searchColors, searchSizes } from '@/actions';
import { CustomSelect } from '@/components';
import { useSearchWithDebounce } from '@/hooks';
import { Color, ProductVariants, Size } from '@/interfaces';
import { Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import { IoAdd, IoClose } from 'react-icons/io5';

interface Props {
	variants: ProductVariants[];
	onVariantsChange: (variants: ProductVariants[]) => void;
	colors?: Color[];
	sizes?: Size[];
}

interface VariantFormData {
	color_id: number;
	size_code: string;
	sku_variant: string;
	price_adjustment: number;
	stock_quantity: number;
	reorder_level: number;
}

export const ProductAddVariants = ({
	variants,
	onVariantsChange,
	colors = [],
	sizes = [],
}: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState<VariantFormData>({
		color_id: 0,
		size_code: '',
		sku_variant: '',
		price_adjustment: 0,
		stock_quantity: 0,
		reorder_level: 0,
	});

	const handleAddVariant = () => {
		const newVariant: ProductVariants = {
			variant_id: Date.now(), // Temporal ID único
			product_id: 0,
			...formData,
			price_adjustment: formData.price_adjustment as any,
			is_active: true,
			is_delete: false,
			created_at: new Date(),
			updated_at: new Date(),
		};

		onVariantsChange([...variants, newVariant]);
		setIsModalOpen(false);

		// Reset form
		setFormData({
			color_id: 0,
			size_code: '',
			sku_variant: '',
			price_adjustment: 0,
			stock_quantity: 0,
			reorder_level: 0,
		});
	};

	const handleRemoveVariant = (variantId: number) => {
		onVariantsChange(variants.filter((v) => v.variant_id !== variantId));
	};

	const {
		results: sizeOptions,
		handleSearch: handleSizeSearch,
		isLoading: isLoadingSizes,
	} = useSearchWithDebounce({
		initialData: sizes,
		searchAction: searchSizes,
		debounceMs: 500,
	});

	const {
		results: colorOptions,
		handleSearch: handleColorSearch,
		isLoading: isLoadingColors,
	} = useSearchWithDebounce({
		initialData: colors,
		searchAction: searchColors,
		debounceMs: 500,
	});

	return (
		<div className="w-full flex flex-col p-4 border-2 border-dashed border-gray-300 rounded-lg">
			<p className="mb-4 font-semibold text-gray-700 text-lg">Variantes del Producto</p>

			<div className="flex flex-col gap-3">
				{/* Cards de variantes existentes - Ahora en layout vertical */}
				{variants.map((variant) => (
					<div
						key={variant.variant_id}
						className="w-full relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
						<button
							type="button"
							onClick={() => handleRemoveVariant(variant.variant_id)}
							className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors cursor-pointer">
							<IoClose size={16} />
						</button>

						<div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pr-7">
							<div className="flex flex-col">
								<span className="text-[10px] font-semibold text-gray-500 uppercase">
									Color
								</span>
								<span className="text-sm font-medium text-gray-800">
									{variant.colors?.color_name ||
										colorOptions.find((c) => c.color_id === variant.color_id)
											?.color_name ||
										'N/A'}
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-[10px] font-semibold text-gray-500 uppercase">
									Talla
								</span>
								<span className="text-sm font-medium text-gray-800">
									{variant.sizes?.size_code ||
										sizeOptions.find((s) => s.size_code === variant.size_code)
											?.size_code ||
										variant.size_code}
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-[10px] font-semibold text-gray-500 uppercase">
									Stock
								</span>
								<span className="text-sm font-medium text-green-600">
									{variant.stock_quantity} uni.
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-[10px] font-semibold text-gray-500 uppercase">
									SKU
								</span>
								<span className="text-xs font-mono text-gray-600">
									{variant.sku_variant}
								</span>
							</div>
						</div>

						{Number(variant.price_adjustment) !== 0 && (
							<div className="mt-1.5 pt-1.5 border-t border-gray-200">
								<span className="text-[10px] text-gray-500">Ajuste: </span>
								<span
									className={`text-xs font-semibold ${
										Number(variant.price_adjustment) > 0
											? 'text-green-600'
											: 'text-red-600'
									}`}>
									{Number(variant.price_adjustment) > 0 ? '+' : ''}$
									{Number(variant.price_adjustment).toFixed(2)}
								</span>
							</div>
						)}
					</div>
				))}

				{/* Card para agregar nueva variante */}
				<button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="w-full border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-lg p-4 flex flex-col items-center justify-center gap-1.5 hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer">
					<div className="bg-blue-100 rounded-full p-2 group-hover:bg-blue-200 transition-colors">
						<IoAdd size={24} className="text-blue-600" />
					</div>
					<span className="text-sm text-blue-700 font-semibold">
						Agregar Nueva Variante
					</span>
				</button>
			</div>

			{/* Modal para agregar variante */}
			<Dialog
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				maxWidth="sm"
				fullWidth>
				<DialogTitle className="flex items-center justify-between">
					<span>Agregar Nueva Variante</span>
					<IconButton onClick={() => setIsModalOpen(false)}>
						<IoClose />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<div className="space-y-4 pt-2">
						<CustomSelect
							className="w-full"
							label="Color"
							value={formData.color_id || ''}
							onChange={(value) =>
								setFormData({ ...formData, color_id: value as number })
							}
							onSearch={handleColorSearch}
							loading={isLoadingColors}
							options={colors.map((color) => ({
								value: color.color_id,
								label: color.color_name,
							}))}
							required
							clearable
							searchable
						/>

						<CustomSelect
							className="w-full"
							label="Talla"
							value={formData.size_code || ''}
							onChange={(handleSizeSearch) =>
								setFormData({ ...formData, size_code: handleSizeSearch as string })
							}
							loading={isLoadingSizes}
							onSearch={handleSizeSearch}
							options={sizes.map((size) => ({
								value: size.size_code,
								label: size.size_code,
							}))}
							required
							clearable
							searchable
						/>

						<TextField
							label="SKU Variante *"
							variant="filled"
							fullWidth
							value={formData.sku_variant}
							onChange={(e) =>
								setFormData({ ...formData, sku_variant: e.target.value })
							}
						/>

						<TextField
							label="Ajuste de Precio"
							variant="filled"
							fullWidth
							type="number"
							value={formData.price_adjustment}
							onChange={(e) =>
								setFormData({
									...formData,
									price_adjustment: Number(e.target.value),
								})
							}
						/>

						<TextField
							label="Cantidad en Stock *"
							variant="filled"
							fullWidth
							type="number"
							value={formData.stock_quantity}
							onChange={(e) =>
								setFormData({ ...formData, stock_quantity: Number(e.target.value) })
							}
						/>

						<TextField
							label="Nivel de Reorden"
							variant="filled"
							fullWidth
							type="number"
							value={formData.reorder_level}
							onChange={(e) =>
								setFormData({ ...formData, reorder_level: Number(e.target.value) })
							}
						/>

						<div className="flex gap-3 pt-2">
							<button
								type="button"
								onClick={handleAddVariant}
								disabled={
									!formData.color_id ||
									!formData.size_code ||
									!formData.sku_variant
								}
								className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
								Agregar
							</button>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
								Cancelar
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
