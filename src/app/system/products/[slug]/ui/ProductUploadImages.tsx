'use client';

import { ProductImage as ProductWithImage } from '@/interfaces';
import Image from 'next/image';
import { useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { IoCloudUploadOutline as CloudUpload } from 'react-icons/io5';
import { LuTrash as Delete } from 'react-icons/lu';

interface Props {
	productImages?: ProductWithImage[];
	productTitle?: string;
	register: UseFormRegister<any>;
	setValue: UseFormSetValue<any>;
	maxImages?: number;
}

export const ProductUploadImages = ({
	productImages,
	productTitle,
	register,
	setValue,
	maxImages = 10,
}: Props) => {
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const currentTotal = previewImages.length + (productImages?.length || 0);
		const availableSlots = maxImages - currentTotal;

		if (availableSlots <= 0) {
			// Todo: Alerta con toast
			return;
		}

		const newPreviews: string[] = [];
		const newFiles: File[] = [];
		const filesToProcess = Math.min(files.length, availableSlots);

		for (let i = 0; i < filesToProcess; i++) {
			const url = URL.createObjectURL(files[i]);
			newPreviews.push(url);
			newFiles.push(files[i]);
		}

		if (files.length > filesToProcess) {
			// Todo: Alerta con toast
		}

		setPreviewImages((prev) => [...prev, ...newPreviews]);

		// Actualizar el array de archivos
		const updatedFiles = [...selectedFiles, ...newFiles];
		setSelectedFiles(updatedFiles);

		// Crear un nuevo FileList y actualizar react-hook-form
		const dataTransfer = new DataTransfer();
		updatedFiles.forEach((file) => dataTransfer.items.add(file));
		setValue('images', dataTransfer.files, { shouldValidate: true });
	};

	const removeImage = (index: number) => {
		setPreviewImages((prev) => {
			URL.revokeObjectURL(prev[index]);
			return prev.filter((_, i) => i !== index);
		});

		// Actualizar también los archivos seleccionados
		const updatedFiles = selectedFiles.filter((_, i) => i !== index);
		setSelectedFiles(updatedFiles);

		// Actualizar react-hook-form
		const dataTransfer = new DataTransfer();
		updatedFiles.forEach((file) => dataTransfer.items.add(file));
		setValue('images', dataTransfer.files, { shouldValidate: true });
	};

	return (
		<div className="my-4">
			<label
				htmlFor="image-upload"
				className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
				<div className="flex flex-col items-center justify-center pt-5 pb-6">
					<CloudUpload className="w-10 h-10 mb-3 text-gray-400" />
					<p className="mb-2 text-sm text-gray-500">
						<span className="font-semibold">Click para subir</span> o arrastra y suelta
					</p>
					<p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
					<p className="text-xs text-gray-400 mt-1">Máximo {maxImages} imágenes</p>
				</div>
				<input
					id="image-upload"
					type="file"
					multiple
					accept="image/*"
					className="hidden"
					{...register('images')}
					onChange={handleImageChange}
				/>
			</label>

			{/* Vista previa de imágenes */}
			{previewImages.length > 0 && (
				<div className="mt-4">
					<p className="text-sm font-semibold mb-2 text-gray-700">
						Imágenes seleccionadas ({previewImages.length}/{maxImages})
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{previewImages.map((url, index) => (
							<div key={index} className="relative group">
								<div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
									<Image
										src={url}
										alt={`Preview ${index + 1}`}
										fill
										className="object-cover"
									/>
								</div>
								<button
									type="button"
									onClick={() => removeImage(index)}
									className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
									<Delete className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Imágenes existentes del producto */}
			{productImages && productImages.length > 0 && (
				<div className="mt-4">
					<p className="text-sm font-semibold mb-2 text-gray-700">Imágenes actuales</p>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{productImages.map((image, index) => (
							<div key={image.id} className="relative">
								<div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
									<Image
										src={`/products/${image.url}`}
										alt={productTitle || `Image ${index + 1}`}
										fill
										className="object-cover"
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
