'use client';

import { TextareaAutosize, TextField } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

import { CustomSelect, DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { useSearch } from '@/hooks';
import { Category, Color, Product, ProductImages, ProductVariants, Size } from '@/interfaces';

import { ProductAddVariants } from './ProductAddVariants';
import { ProductUploadImages } from './ProductUploadImages';

import { searchCategories } from '@/actions/categories/category-search';
import { createOrUpdateProduct } from '@/actions/products/create-update-product';
import { deleteProduct } from '@/actions/products/delete-product';

interface Props {
	product: Partial<Product> & { images?: ProductImages[]; variants?: ProductVariants[] };
	categories?: Category[];
	colors?: Color[];
	sizes?: Size[];
}

type ProductImageInput = ProductImages | File;

interface FormInputs {
	product_name: string;
	sku: string;
	description: string | null;
	price: number;
	weight: number | null;
	category_id: number;
	state: string;
	variants?: ProductVariants[];
	images?: ProductImageInput[];
}

export const ProductForm = ({ product, categories = [], colors = [], sizes = [] }: Props) => {
	const router = useRouter();

	const {
		results: categoryOptions,
		handleSearch: handleCategorySearch,
		isLoading: isLoadingCategories,
	} = useSearch({
		initialData: categories,
		searchAction: searchCategories,
		debounceMs: 500,
	});

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			...product,
			price: product.price ? Number(product.price) : 0,
			weight: product.weight ? Number(product.weight) : null,
			state: product.state ?? 'A',
			images: product.images ?? [],
			variants: product.variants || [],
		},
		mode: 'onChange',
	});

	// Observers
	register('price', {
		min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
		valueAsNumber: true,
	});
	register('category_id', { required: 'La categoría es requerida' });
	register('description', {
		minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' },
		maxLength: { value: 500, message: 'La descripción no debe exceder los 500 caracteres' },
	});
	register('state');
	register('variants');

	const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const cleanValue = event.target.value.replace(/[^0-9.]/g, '');
		const numericValue = parseFloat(cleanValue);
		setValue('price', isNaN(numericValue) ? 0 : numericValue, {
			shouldValidate: true,
		});
	};

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { images, variants, ...productToSave } = data;

		if (product.product_id) {
			formData.append('product_id', product.product_id.toString() ?? '');
		}

		formData.append('product_name', productToSave.product_name);
		formData.append('category_id', productToSave.category_id.toString());
		formData.append('description', productToSave.description ?? '');
		formData.append('price', productToSave.price.toString());
		formData.append('weight', productToSave.weight?.toString() ?? '');
		formData.append('state', productToSave.state);

		// Agregar variantes como JSON
		if (variants && variants.length > 0) {
			formData.append('variants', JSON.stringify(variants));
		}

		if (images && images.length > 0) {
			// Separar imágenes existentes y nuevas
			const existingImages: ProductImages[] = [];
			const newFiles: File[] = [];

			images.forEach((img) => {
				if (img instanceof File) {
					newFiles.push(img);
				} else {
					existingImages.push(img);
				}
			});

			// Agregar IDs de imágenes existentes que se mantienen
			if (existingImages.length > 0) {
				formData.append(
					'existingImages',
					JSON.stringify(existingImages.map((img) => img.image_id))
				);
			}

			// Agregar nuevos archivos
			newFiles.forEach((file) => {
				formData.append('images', file);
			});
		}
		const { success, message } = await createOrUpdateProduct(formData);

		if (!success) {
			toast.error(message || 'No se pudo actualizar el producto');
			return;
		}

		toast.success(message || 'Producto actualizado exitosamente');
		router.replace(`/system/products`);
	};

	const handleDelete = async () => {
		const { success, message } = await deleteProduct(product.product_id!);

		if (!success) {
			toast.error(message || 'No se pudo eliminar el producto');
			return;
		}

		toast.success(message || 'Producto eliminado exitosamente');
		router.replace('/system/products');
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
									setValue('category_id', value ? Number(value) : ('' as any), {
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
						images={watch('images') || []}
						onImagesChange={(images: ProductImageInput[]) => setValue('images', images)}
					/>
				</div>

				{/* Estado */}
				<StateSwitch
					state={watch('state')}
					onStateChange={(newState) => setValue('state', newState)}
					entityName="producto"
					gender="el"
				/>

				{/* Información del Sistema */}
				{product.product_id && (
					<SystemInfoCard
						idValue={product.product_id}
						createdAt={product.created_at}
						updatedAt={product.updated_at}
					/>
				)}

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
			<div className="w-[40%] flex flex-col">
				<ProductAddVariants
					variants={watch('variants') || []}
					onVariantsChange={(variants) => setValue('variants', variants)}
					colors={colors}
					sizes={sizes}
				/>
			</div>
		</form>
	);
};
