'use client';

import { Category, Product, ProductImage as ProductWithImage } from '@/interfaces';
import {
	Button,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
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
			sizes: product.sizes ?? [],
		},
		mode: 'onChange',
	});

	// Observers
	register('price', {
		min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
		valueAsNumber: true,
	});
	register('gender', { required: 'El género es requerido' });

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
		<form onSubmit={handleSubmit(onSubmit)} className="">
			{/* Textos */}
			<div className="w-full">
				<div className="flex gap-2">
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

					<FormControl
						variant="filled"
						className="w-full min-w-[120px]"
						error={!!errors.gender}>
						<InputLabel id="gender-select-label">Genero *</InputLabel>
						<Select
							labelId="gender-select-label"
							id="gender-select"
							value={watch('gender') || ''}
							label="Genero"
							onChange={(e: SelectChangeEvent) => {
								const value = e.target.value as Gender | '';
								setValue('gender', value as Gender, { shouldValidate: true });
							}}>
							<MenuItem value="">
								<em>Ninguno</em>
							</MenuItem>
							<MenuItem value="men">Hombres</MenuItem>
							<MenuItem value="women">Mujeres</MenuItem>
							<MenuItem value="kid">Niños</MenuItem>
							<MenuItem value="unisex">Unisex</MenuItem>
						</Select>
						<FormHelperText>{errors.gender?.message}</FormHelperText>
					</FormControl>
				</div>
			</div>

			{/* Selector de tallas y fotos */}
			<div className="w-[50%]">
				<p className="mt-3 mb-1 font-semibold text-gray-700">Subir imágenes</p>
				<ProductUploadImages
					productImages={product.ProductImage}
					productTitle={product.title}
					register={register}
					setValue={setValue}
					maxImages={3}
				/>
			</div>

			<Button type="submit" variant="contained" fullWidth>
				Guardar
			</Button>
		</form>
	);
};
