'use client';

import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogTitle, IconButton, Switch, TextField } from '@mui/material';
import { IoAdd, IoClose } from 'react-icons/io5';

import { deleteProductVariant, searchColors, searchSizes } from '@/actions';
import { CustomSelect } from '@/components';
import { useSearch } from '@/hooks';
import { Color, ProductVariants, Size } from '@/interfaces';
import { ErrorCode } from '@/lib';
import { useState } from 'react';

interface Props {
	variants: ProductVariants[];
	onVariantsChange: (variants: ProductVariants[]) => void;
	colors?: Color[];
	sizes?: Size[];
}

interface VariantFormData {
	color_id: number;
	size_code: string;
	price_adjustment: number;
	stock_quantity: number;
	reorder_level: number;
	state: string;
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
		price_adjustment: 0,
		stock_quantity: 0,
		reorder_level: 0,
		state: 'A',
	});

	const handleAddVariant = () => {
		const newVariant: ProductVariants = {
			variant_id: Date.now(),
			product_id: 0,
			...formData,
			price_adjustment: formData.price_adjustment,
			state: 'A',
			created_at: new Date(),
			updated_at: new Date(),
		};

		onVariantsChange([...variants, newVariant]);
		setIsModalOpen(false);

		// Reset form
		setFormData({
			color_id: 0,
			size_code: '',
			price_adjustment: 0,
			stock_quantity: 0,
			reorder_level: 0,
			state: 'A',
		});
	};

	const handleRemoveVariant = async (variant_id: number) => {
		const { success, code, message } = await deleteProductVariant(variant_id);

		if (code === ErrorCode.VARIANT_NOT_FOUND) {
			onVariantsChange(variants.filter((v) => v.variant_id !== variant_id));
			return;
		}

		if (success) {
			onVariantsChange(variants.filter((v) => v.variant_id !== variant_id));
			toast.success(message || 'Variante eliminada correctamente');
			return;
		}

		toast.error(message || 'No se pudo eliminar la variante');
	};

	const {
		results: sizeOptions,
		handleSearch: handleSizeSearch,
		isLoading: isLoadingSizes,
	} = useSearch({
		initialData: sizes,
		searchAction: searchSizes,
		debounceMs: 500,
	});

	const {
		results: colorOptions,
		handleSearch: handleColorSearch,
		isLoading: isLoadingColors,
	} = useSearch({
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
				maxWidth="md"
				fullWidth
				PaperProps={{
					className: 'rounded-xl',
				}}>
				<DialogTitle className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
					<div>
						<h2 className="text-xl font-bold text-gray-800">Agregar Nueva Variante</h2>
						<p className="text-sm text-gray-600 mt-1">
							Complete los detalles de la variante del producto
						</p>
					</div>
					<IconButton
						onClick={() => setIsModalOpen(false)}
						className="hover:bg-blue-200 transition-colors">
						<IoClose size={24} />
					</IconButton>
				</DialogTitle>
				<DialogContent className="pt-6 pb-4">
					<div className="space-y-5 mt-12">
						{/* Fila 1: Color y Talla */}
						<div className="grid grid-cols-2 gap-4">
							<CustomSelect
								className="w-full"
								label="Color"
								value={formData.color_id || ''}
								onChange={(value) =>
									setFormData({ ...formData, color_id: value as number })
								}
								onSearch={handleColorSearch}
								loading={isLoadingColors}
								options={colorOptions.map((color) => ({
									value: color.color_id,
									label: color.color_name,
								}))}
								required
								clearable
							/>

							<CustomSelect
								className="w-full"
								label="Talla"
								value={formData.size_code || ''}
								onChange={(value) =>
									setFormData({ ...formData, size_code: value as string })
								}
								loading={isLoadingSizes}
								onSearch={handleSizeSearch}
								options={sizeOptions.map((size) => ({
									value: size.size_code,
									label: size.size_code,
								}))}
								required
								clearable
							/>
						</div>

						{/* Fila 2: SKU y Ajuste de Precio */}
						<div className="grid grid-cols-2 gap-4">
							<NumericFormat
								value={formData.price_adjustment}
								onValueChange={(values) => {
									setFormData({
										...formData,
										price_adjustment: values.floatValue || 0,
									});
								}}
								customInput={TextField}
								thousandSeparator=","
								decimalSeparator="."
								decimalScale={2}
								fixedDecimalScale
								valueIsNumericString
								prefix="$"
								variant="filled"
								label="Ajuste de Precio"
								fullWidth
								allowNegative
								placeholder="$0.00"
								helperText="Positivo para aumentar, negativo para reducir"
							/>
						</div>

						{/* Fila 3: Stock y Nivel de Reorden */}
						<div className="grid grid-cols-2 gap-4">
							<TextField
								label="Cantidad en Stock"
								variant="filled"
								fullWidth
								type="number"
								value={formData.stock_quantity}
								onChange={(e) =>
									setFormData({
										...formData,
										stock_quantity: Number(e.target.value),
									})
								}
								inputProps={{ min: 0 }}
							/>

							<TextField
								label="Nivel de Reorden"
								variant="filled"
								fullWidth
								type="number"
								value={formData.reorder_level}
								onChange={(e) =>
									setFormData({
										...formData,
										reorder_level: Number(e.target.value),
									})
								}
								inputProps={{ min: 0 }}
								helperText="Alerta cuando el stock sea menor a este valor"
							/>
						</div>

						{/* Estado */}
						<div className="border-t border-gray-200 pt-4">
							<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
								<div className="flex-1">
									<p className="font-medium text-gray-700">
										Estado de la variante
									</p>
									<p className="text-sm text-gray-500 mt-1">
										{formData.state === 'A'
											? 'La variante estará activa y disponible para la venta'
											: 'La variante estará desactivada y no será visible'}
									</p>
								</div>
								<div className="flex items-center gap-3">
									<span
										className={`text-sm font-medium ${
											formData.state === 'A'
												? 'text-green-600'
												: 'text-gray-400'
										}`}>
										{formData.state === 'A' ? 'Activa' : 'Inactiva'}
									</span>
									<Switch
										checked={formData.state === 'A'}
										onChange={(e) => {
											setFormData({
												...formData,
												state: e.target.checked ? 'A' : 'I',
											});
										}}
										slotProps={{
											input: { 'aria-label': 'Estado de la variante' },
										}}
									/>
								</div>
							</div>
						</div>

						{/* Botones */}
						<div className="flex gap-3 pt-2 border-t border-gray-200">
							<button
								type="button"
								onClick={handleAddVariant}
								disabled={
									!formData.color_id ||
									!formData.size_code ||
									formData.stock_quantity < 0
								}
								className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
								Agregar
							</button>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
								Cancelar
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
