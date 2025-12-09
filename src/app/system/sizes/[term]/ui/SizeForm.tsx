'use client';

import { useRouter } from 'next/navigation';

import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { Size } from '@/interfaces';

import { createOrUpdateSize } from '@/actions/sizes/create-update-size';
import { deleteSize } from '@/actions/sizes/delete-size';

interface Props {
	size: Size;
}

interface FormInputs {
	size_code: string;
	new_size_code: string;
	state: string;
}

export const SizeForm = ({ size }: Props) => {
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			...size,
			state: size.state ?? 'A',
			new_size_code: size.size_code ?? '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { size_code, new_size_code, state } = data;

		if (size.size_code) {
			formData.append('size_code', size.size_code);
		}

		formData.append('size_code', size_code);
		formData.append('new_size_code', new_size_code);
		formData.append('state', state);

		const { success, data: sizeData, message } = await createOrUpdateSize(formData);

		if (!success) {
			toast.error(message || 'Error al guardar la talla');
			return;
		}

		toast.success(message || 'Talla guardada exitosamente');
		router.replace(`/system/sizes`);
	};

	const handleDelete = async () => {
		const { success, message } = await deleteSize(size.size_code);

		if (!success) {
			toast.error(message || 'No se pudo eliminar la talla');
			return;
		}

		toast.success(message || 'Talla eliminada exitosamente');
		router.replace('/system/sizes');
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mb-6 pb-6">
			{/* Código del Talla */}
			<div className="w-full mb-4">
				<TextField
					label="Código del Talla *"
					variant="filled"
					className="w-full"
					error={!!errors.new_size_code}
					helperText={errors.new_size_code?.message}
					{...register('new_size_code', {
						required: 'El código del talla es requerido',
						maxLength: {
							value: 10,
							message: 'El código no puede exceder 10 caracteres',
						},
					})}
				/>
			</div>

			{/* Estado */}
			<StateSwitch
				state={watch('state')}
				onStateChange={(newState) => setValue('state', newState)}
				gender="la"
				entityName="talla"
			/>

			{/* Información del Sistema */}
			{size.size_code && (
				<SystemInfoCard
					idValue={size.size_code}
					createdAt={size.created_at}
					updatedAt={size.updated_at}
				/>
			)}

			{/* Botones */}
			<div className="flex gap-4">
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
					Guardar
				</button>

				{size.size_code && (
					<DeleteButton onDelete={handleDelete} itemName={size.size_code} />
				)}
			</div>
		</form>
	);
};
