'use client';

import { CustomSelect } from '@/components/ui/CustomSelect';
import { Category, Product, ProductImage as ProductWithImage } from '@/interfaces';
import { Switch, TextareaAutosize, TextField } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ProductUploadImages } from './ProductUploadImages';

interface Props {
	product: Partial<Product> & { ProductImage?: ProductWithImage[] };
	categories: Category[];
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export type Gender = 'men' | 'women' | 'kid' | 'unisex';

interface FormInputs {
	title: string;
	slug: string;
	description: string;
	price: number;
	inStock: number;
	sizes: string[];
	gender: Gender;
	categoryId: string;
	images?: FileList;
	disponible: boolean;
}

export const ProductForm = ({ product, categories }: Props) => {
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { isValid, errors },
		getValues,
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			...product,
			price: product.price ?? 0,
			sizes: product.sizes ?? [],
			disponible: product.disponible ?? true,
		},
		mode: 'onChange',
	});

	// Observers
	register('price', {
		min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
		valueAsNumber: true,
	});
	register('gender', { required: 'El género es requerido' });
	register('categoryId', { required: 'La categoría es requerida' });
	register('disponible');
	register('description', {
		minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' },
	});

	const onSizeChanged = (size: string) => {
		const sizes = new Set(getValues('sizes'));
		sizes.has(size) ? sizes.delete(size) : sizes.add(size);
		setValue('sizes', Array.from(sizes));
	};

	const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const cleanValue = event.target.value.replace(/[^0-9.]/g, '');
		const numericValue = parseFloat(cleanValue);
		setValue('price', isNaN(numericValue) ? 0 : numericValue, { shouldValidate: true });
	};

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		console.log({ data });

		const { images, ...productToSave } = data;

		if (product.id) {
			formData.append('id', product.id ?? '');
		}

		formData.append('title', productToSave.title);
		formData.append('description', productToSave.description);
		formData.append('price', productToSave.price.toString());
		formData.append('sizes', productToSave.sizes.toString());
		formData.append('categoryId', productToSave.categoryId);
		formData.append('gender', productToSave.gender);

		if (images) {
			for (let i = 0; i < images.length; i++) {
				formData.append('images', images[i]);
			}
		}

		const { ok, product: updatedProduct } = (await {}) as { ok: boolean; product?: Product };

		if (!ok) {
			console.log('Error al guardar el producto');
			return;
		}

		router.replace(`/system/products/${updatedProduct?.slug}`);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
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
								error={!!errors.title}
								helperText={errors.title?.message}
								{...register('title', { required: 'Este campo es requerido' })}
							/>
							<NumericFormat
								value={watch('price') ?? 0}
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
								id="gender-select"
								label="Genero"
								value={watch('gender') || ''}
								onChange={(value) =>
									setValue('gender', value as Gender, { shouldValidate: true })
								}
								options={[
									{ value: 'men', label: 'Hombres' },
									{ value: 'women', label: 'Mujeres' },
									{ value: 'kid', label: 'Niños' },
									{ value: 'unisex', label: 'Unisex' },
								]}
								error={!!errors.gender}
								helperText={errors.gender?.message}
								clearable
								required
							/>

							<CustomSelect
								id="category-select"
								label="Categoría"
								value={watch('categoryId') || ''}
								onChange={(value) =>
									setValue('categoryId', value as string, {
										shouldValidate: true,
									})
								}
								options={categories.map((category) => ({
									value: category.id,
									label: category.name,
								}))}
								helperText={errors.categoryId?.message}
								error={!!errors.categoryId}
								clearable
								required
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
						productImages={product.ProductImage}
						productTitle={product.title}
						register={register}
						setValue={setValue}
						maxImages={3}
					/>
				</div>

				{/* Disponible */}
				<div>
					<p className="mb-2 font-semibold text-gray-700">Diposible</p>
					<Switch
						checked={watch('disponible') ?? true}
						onChange={(e) => {
							setValue('disponible', e.target.checked);
						}}
						slotProps={{ input: { 'aria-label': 'controlled' } }}
					/>
				</div>

				{/* Botones */}
				<div className="flex gap-4">
					<button
						type="submit"
						className={
							'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors'
						}>
						Guardar
					</button>

					<button
						type="button"
						className={
							'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors'
						}>
						Eliminar
					</button>
				</div>
			</div>

			{/* Columna Derecha - Espacio en blanco para agregar contenido */}
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
