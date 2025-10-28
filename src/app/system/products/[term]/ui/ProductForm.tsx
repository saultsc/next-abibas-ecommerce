'use client';

import { createOrUpdateProduct, searchCategories } from '@/actions';
import { CustomSelect, DeleteButton } from '@/components';
import { Category, Product, ProductImages, ProductVariants } from '@/interfaces';
import { Switch, TextareaAutosize, TextField } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ProductUploadImages } from './ProductUploadImages';

interface Props {
	product: Partial<Product> & { images?: ProductImages[]; variants?: ProductVariants[] };
	categories?: Category[];
}

interface FormInputs {
	product_name: string;
	sku: string;
	description: string | null;
	price: number;
	weight: number | null;
	category_id: number;
	is_active: boolean;
	variants?: ProductVariants[];
	images?: FileList;
}

export const ProductForm = ({ product, categories = [] }: Props) => {
	const router = useRouter();
	const [categoryOptions, setCategoryOptions] = useState<Category[]>(categories);
	const [isLoadingCategories, startTransition] = useTransition();
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const {
		handleSubmit,
		register,
		formState: { errors },
		getValues,
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			...product,
			price: product.price ? Number(product.price) : 0,
			weight: product.weight ? Number(product.weight) : null,
			images: undefined,
		},
		mode: 'onChange',
	});

	// Observers
	register('price', {
		min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
		valueAsNumber: true,
	});
	register('category_id', { required: 'La categoría es requerida' });
	register('is_active');
	register('description', {
		minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' },
		maxLength: { value: 500, message: 'La descripción no debe exceder los 500 caracteres' },
	});

	const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const cleanValue = event.target.value.replace(/[^0-9.]/g, '');
		const numericValue = parseFloat(cleanValue);
		setValue('price', isNaN(numericValue) ? 0 : numericValue, {
			shouldValidate: true,
		});
	};

	const handleCategorySearch = async (searchTerm: string) => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		if (!searchTerm) {
			setCategoryOptions(categories);
			return;
		}

		searchTimeoutRef.current = setTimeout(() => {
			startTransition(async () => {
				const { success, data } = await searchCategories(searchTerm);
				if (success) {
					setCategoryOptions(data ?? []);
				} else {
					setCategoryOptions([]);
				}
			});
		}, 500);
	};

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { images, ...productToSave } = data;

		if (product.product_id) {
			formData.append('product_id', product.product_id.toString() ?? '');
		}

		formData.append('product_name', productToSave.product_name);
		formData.append('sku', productToSave.sku);
		formData.append('category_id', productToSave.category_id.toString());
		formData.append('description', productToSave.description ?? '');
		formData.append('price', productToSave.price.toString());
		formData.append('weight', productToSave.weight?.toString() ?? '');
		formData.append('is_active', productToSave.is_active ? 'true' : 'false');

		if (images) {
			for (let i = 0; i < images.length; i++) {
				formData.append('images', images[i]);
			}
		}

		const { success, data: updatedProduct, message } = await createOrUpdateProduct(formData);
		if (!success) {
			console.log(message);
			return;
		}

		router.replace(`/system/products/${updatedProduct?.product_id}`);
	};

	const handleDelete = async () => {
		console.log('Producto eliminado');
		setTimeout(() => {}, 1500);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 mb-6 pb-6">
			{/* Columna Izquierda */}
			<div className="w-[60%] flex flex-col gap-4">
				{/* Textos */}
				<div className="w-full">
					<div className="flex flex-wrap gap-2">
						<div className="w-full flex gap-3 mb-4">
							<TextField
								label="Título *"
								variant="filled"
								className="w-full"
								error={!!errors.product_name}
								helperText={errors.product_name?.message}
								{...register('product_name', {
									required: 'Este campo es requerido',
								})}
							/>
							<NumericFormat
								value={Number(watch('price')) ?? 0}
								onChange={handlePriceChange}
								customInput={TextField}
								thousandSeparator=","
								decimalSeparator="."
								decimalScale={2}
								fixedDecimalScale
								valueIsNumericString
								prefix="$"
								variant="filled"
								label="Precio"
								className="w-full"
								error={!!errors.price}
								helperText={errors.price?.message}
								allowNegative={false}
							/>

							<CustomSelect
								className="w-full"
								id="category-select"
								label="Categoría"
								value={watch('category_id') || ''}
								onChange={(value) =>
									setValue('category_id', value as number, {
										shouldValidate: true,
									})
								}
								onSearch={handleCategorySearch}
								options={categoryOptions.map((category) => ({
									value: category.category_id,
									label: category.category_name,
								}))}
								error={!!errors.category_id}
								helperText={errors.category_id?.message}
								clearable
								required
								searchable
								loading={isLoadingCategories}
							/>
						</div>
					</div>
				</div>

				{/* Descripción */}
				<div className="w-full">
					<p className="mt-3 mb-2 font-semibold text-gray-700">Descripción</p>
					<TextareaAutosize
						minRows={6}
						value={watch('description') || ''}
						className={clsx(
							'w-full mt-2 bg-[#e0e0e0] border rounded p-2 resize-none focus:outline-none transition-all focus:ring',
							errors.description
								? 'border-red-500 focus:border-red-500 focus:ring-red-500'
								: 'border-black/30 focus:border-blue-500 focus:ring-blue-500'
						)}
						{...register('description')}
					/>
					{errors.description && (
						<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
					)}
				</div>

				{/* Subir imágenes */}
				<div className="w-full">
					<p className="mt-3 mb-2 font-semibold text-gray-700">Subir imágenes</p>
					<ProductUploadImages
						productImages={product.images}
						productTitle={product.product_name}
						register={register}
						setValue={setValue}
						maxImages={3}
					/>
				</div>

				{/* Disponible */}
				<div className="w-full mb-4">
					<p className="mb-2 font-semibold text-gray-700">Estado</p>
					<div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-300">
						<div className="flex-1">
							<p className="font-medium text-gray-700">Estado del producto</p>
							<p className="text-sm text-gray-500 mt-1">
								{watch('is_active')
									? 'El producto está activo y visible para los usuarios'
									: 'El producto está desactivado y no será visible'}
							</p>
						</div>
						<div className="flex items-center gap-3">
							<span
								className={`text-sm font-medium ${
									watch('is_active') ? 'text-green-600' : 'text-gray-400'
								}`}>
								{watch('is_active') ? 'Activa' : 'Inactiva'}
							</span>
							<Switch
								checked={watch('is_active') ?? true}
								onChange={(e) => {
									setValue('is_active', e.target.checked);
								}}
								slotProps={{ input: { 'aria-label': 'Estado del producto' } }}
							/>
						</div>
					</div>
				</div>

				{/* Botones */}
				<div className="flex gap-4">
					<button
						type="submit"
						className={
							'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
						}>
						Guardar
					</button>

					<DeleteButton onDelete={handleDelete} itemName={product.product_name} />
				</div>
			</div>

			{/* Columna Derecha */}
			<div className="w-[40%] flex flex-col gap-4">
				<div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center">
					<p className="text-gray-400 text-center">
						Espacio disponible para agregar más campos
					</p>
				</div>
			</div>
		</form>
	);
};
