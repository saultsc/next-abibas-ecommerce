'use client';

import { createUpdateCategory, deleteCategory } from '@/actions';
import { DeleteButton } from '@/components';
import { Category } from '@/interfaces';
import { Switch, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { IoCalendarOutline, IoInformationCircleOutline, IoKeyOutline } from 'react-icons/io5';

interface Props {
	category: Category;
}

interface FormInputs {
	category_name: string;
	is_active: boolean;
}

export const CategoryForm = ({ category }: Props) => {
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			category_name: category.category_name || '',
			is_active: category.is_active ?? true,
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { category_name, is_active } = data;

		if (category.category_id) {
			formData.append('category_id', category.category_id.toString());
		}

		formData.append('category_name', category_name);
		formData.append('is_active', is_active.toString());

		const { success, category: createOrUpdateCategory } = await createUpdateCategory(formData);

		if (!success) {
			console.log('Error al guardar la categoría');
			return;
		}

		router.replace(`/system/categories/${createOrUpdateCategory?.category_id}`);
	};

	const handleDelete = async () => {
		if (!category.category_id) return;

		const { success } = await deleteCategory(category.category_id);

		if (!success) {
			console.log('Error al eliminar la categoría');
		}

		router.replace('/system/categories');
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mb-6 pb-6">
			{/* Nombre de la Categoría */}
			<div className="w-full mb-4">
				<TextField
					label="Nombre de la Categoría *"
					variant="filled"
					className="w-full"
					error={!!errors.category_name}
					helperText={errors.category_name?.message}
					{...register('category_name', {
						required: 'El nombre de la categoría es requerido',
						minLength: {
							value: 2,
							message: 'El nombre debe tener al menos 2 caracteres',
						},
						maxLength: {
							value: 100,
							message: 'El nombre no puede exceder 100 caracteres',
						},
					})}
				/>
			</div>

			{/* Estado */}
			<div className="w-full mb-4">
				<p className="mb-2 font-semibold text-gray-700">Estado</p>
				<div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-300">
					<div className="flex-1">
						<p className="font-medium text-gray-700">Estado de la Categoría</p>
						<p className="text-sm text-gray-500 mt-1">
							{watch('is_active')
								? 'La categoría está activa y visible para los usuarios'
								: 'La categoría está desactivada y no será visible'}
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
							slotProps={{ input: { 'aria-label': 'Estado de categoría' } }}
						/>
					</div>
				</div>
			</div>

			{/* Información del Sistema */}
			{category.category_id && (
				<div className="w-full mb-6 p-4 bg-gray-50 rounded border border-gray-300">
					<p className="mb-3 font-semibold text-gray-700 flex items-center gap-2">
						<IoInformationCircleOutline className="text-xl text-gray-600" />
						Información del Sistema
					</p>
					<div className="space-y-3 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-gray-600 font-medium flex items-center gap-2">
								<IoKeyOutline className="text-base" />
								ID:
							</span>
							<span className="text-gray-900 font-semibold">
								{category.category_id}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-600 font-medium flex items-center gap-2">
								<IoCalendarOutline className="text-base" />
								Creada:
							</span>
							<span className="text-gray-900">
								{new Date(category.created_at).toLocaleDateString('es-ES')}
							</span>
						</div>
						{category.updated_at && (
							<div className="flex items-center justify-between">
								<span className="text-gray-600 font-medium flex items-center gap-2">
									<IoCalendarOutline className="text-base" />
									Actualizada:
								</span>
								<span className="text-gray-900">
									{new Date(category.updated_at).toLocaleDateString('es-ES')}
								</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Botones */}
			<div className="flex gap-4">
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
					Guardar
				</button>

				{category.category_id && (
					<DeleteButton onDelete={handleDelete} itemName={category.category_name} />
				)}
			</div>
		</form>
	);
};
