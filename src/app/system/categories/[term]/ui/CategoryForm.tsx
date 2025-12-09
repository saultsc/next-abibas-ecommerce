'use client';
import { useRouter } from 'next/navigation';

import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { Category } from '@/interfaces';

import { createOrUpdateCategory } from '@/actions/categories/create-update-category';
import { deleteCategory } from '@/actions/categories/delete-category';

interface Props {
	category: Category;
}

interface FormInputs {
	category_name: string;
	state: string;
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
			...category,
			state: category.state ?? 'A',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { category_name, state } = data;

		if (category.category_id) {
			formData.append('category_id', category.category_id.toString());
		}

		formData.append('category_name', category_name);
		formData.append('state', state);

		const { success, message } = await createOrUpdateCategory(formData);

		if (!success) {
			toast.error(message || 'Error al guardar la categoría');
			return;
		}

		toast.success(message || 'Categoría guardada exitosamente');
		router.replace(`/system/categories`);
	};

	const handleDelete = async () => {
		if (!category.category_id) return;

		const { success, message } = await deleteCategory(category.category_id);

		if (!success) {
			toast.error(message || 'No se pudo eliminar la categoría');
			return;
		}

		toast.success('Categoría eliminada exitosamente');
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
			<StateSwitch
				state={watch('state')}
				onStateChange={(newState) => setValue('state', newState)}
				entityName="categoría"
				gender="la"
			/>

			{/* Información del Sistema */}
			{category.category_id && (
				<SystemInfoCard
					idValue={category.category_id}
					createdAt={category.created_at}
					updatedAt={category.updated_at}
				/>
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
