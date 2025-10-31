import { deleteProductImage } from '@/actions';
import { ProductImages } from '@/interfaces';
import { ErrorCode } from '@/lib';
import Image from 'next/image';
import { useState } from 'react';
import { IoCloudUploadOutline, IoTrash } from 'react-icons/io5';
import { toast } from 'sonner';

type ProductImageInput = ProductImages | File;

interface Props {
	images: ProductImageInput[];
	onImagesChange: (images: ProductImageInput[]) => void;
}

export const ProductUploadImages = ({ images, onImagesChange }: Props) => {
	const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newFiles = Array.from(files);
		const maxImages = 5;
		const availableSlots = maxImages - images.length;

		if (newFiles.length > availableSlots) {
			toast.error(`Solo puedes subir ${availableSlots} imagen(es) más`);
			return;
		}

		const newPreviewUrls = new Map(previewUrls);
		newFiles.forEach((file) => {
			if (!newPreviewUrls.has(file)) {
				newPreviewUrls.set(file, URL.createObjectURL(file));
			}
		});
		setPreviewUrls(newPreviewUrls);

		onImagesChange([...images, ...newFiles]);

		e.target.value = '';
	};

	const handleRemoveImage = async (index: number) => {
		const imageToRemove = images[index];

		if (imageToRemove instanceof File) {
			if (previewUrls.has(imageToRemove)) {
				URL.revokeObjectURL(previewUrls.get(imageToRemove)!);
				const newPreviewUrls = new Map(previewUrls);
				newPreviewUrls.delete(imageToRemove);
				setPreviewUrls(newPreviewUrls);
			}

			onImagesChange(images.filter((_, i) => i !== index));
			return;
		}

		const { success, code, message } = await deleteProductImage(imageToRemove.image_id);

		if (code === ErrorCode.PRODUCT_IMAGE_NOT_FOUND) {
			onImagesChange(images.filter((_, i) => i !== index));
			return;
		}

		if (success) {
			onImagesChange(images.filter((_, i) => i !== index));
			toast.success(message || 'Imagen eliminada correctamente');
			return;
		}

		toast.error(message || 'No se pudo eliminar la imagen');
	};

	const getImageUrl = (image: ProductImageInput): string => {
		if (image instanceof File) {
			return previewUrls.get(image) || '';
		}
		return image.image_url;
	};

	const getImageKey = (image: ProductImageInput, index: number): string => {
		if (image instanceof File) {
			return `file-${index}-${image.name}`;
		}
		return `image-${image.image_id}`;
	};

	return (
		<div className="space-y-4">
			{/* Upload area - similar al botón de agregar variante */}
			{images.length < 5 && (
				<label
					htmlFor="image-upload"
					className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
					<div className="flex flex-col items-center justify-center pt-5 pb-6">
						<div className="bg-blue-100 rounded-full p-3 group-hover:bg-blue-200 transition-colors mb-3">
							<IoCloudUploadOutline className="w-10 h-10 text-blue-600" />
						</div>
						<p className="mb-2 text-sm text-blue-700 font-semibold">Click para subir</p>
						<p className="text-xs text-gray-600">PNG, JPG, WEBP (MAX. 5MB)</p>
						<p className="text-xs text-gray-500 mt-1">
							{images.length > 0
								? `${5 - images.length} imagen${
										5 - images.length !== 1 ? 'es' : ''
								  } restante${5 - images.length !== 1 ? 's' : ''}`
								: 'Máximo 5 imágenes'}
						</p>
					</div>
					<input
						id="image-upload"
						type="file"
						multiple
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>
				</label>
			)}

			{/* Preview de imágenes - ahora debajo del input */}
			{images.length > 0 && (
				<div className="grid grid-cols-5 gap-2">
					{images.map((image, index) => (
						<div
							key={getImageKey(image, index)}
							className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
							<Image
								src={getImageUrl(image)}
								alt={`Preview ${index + 1}`}
								fill
								className="object-cover"
							/>

							{/* Botón de eliminar - tacho de basura */}
							<button
								type="button"
								onClick={() => handleRemoveImage(index)}
								className="absolute top-1 right-1 text-white bg-red-500/80 hover:bg-red-600 rounded p-1 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md">
								<IoTrash className="w-3 h-3" />
							</button>

							{/* Badge de imagen principal */}
							{!(image instanceof File) && image.is_primary && (
								<span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
									Principal
								</span>
							)}

							{/* Badge de imagen nueva */}
							{image instanceof File && (
								<span className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
									Nueva
								</span>
							)}

							{/* Overlay al hacer hover */}
							<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
						</div>
					))}
				</div>
			)}
		</div>
	);
};
