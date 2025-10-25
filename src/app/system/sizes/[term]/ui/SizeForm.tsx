'use client';

import { createUpdateSize, deleteSize } from '@/actions';
import { DeleteButton } from '@/components';
import { Size } from '@/interfaces';
import { Switch, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { IoCalendarOutline, IoInformationCircleOutline, IoKeyOutline } from 'react-icons/io5';

interface Props {
	size: Size;
}

interface FormInputs {
	size_code: string;
	is_active: boolean;
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
			size_code: size.size_code || '',
			is_active: size.is_active ?? true,
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { size_code, is_active } = data;

		if (size.size_code) {
			formData.append('size_code', size.size_code);
		}

		formData.append('size_code', size_code);
		formData.append('is_active', is_active.toString());

		const { success, size: createOrUpdateSize } = await createUpdateSize(formData);

		if (!success) {
			console.log('Error al guardar el talla');
			return;
		}

		router.replace(`/system/sizes/${createOrUpdateSize?.size_code}`);
	};

	const handleDelete = async () => {
		if (!size.size_code) return;
		const { success } = await deleteSize(size.size_code);

		if (!success) {
			console.log('Error al eliminar el talla');
		}

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
					error={!!errors.size_code}
					helperText={errors.size_code?.message}
					{...register('size_code', {
						required: 'El código del talla es requerido',
						minLength: {
							value: 2,
							message: 'El código debe tener al menos 2 caracteres',
						},
						maxLength: {
							value: 100,
							message: 'El código no puede exceder 100 caracteres',
						},
					})}
				/>
			</div>

			{/* Estado */}
			<div className="w-full mb-4">
				<p className="mb-2 font-semibold text-gray-700">Estado</p>
				<div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-300">
					<div className="flex-1">
						<p className="font-medium text-gray-700">Estado del Talla</p>
						<p className="text-sm text-gray-500 mt-1">
							{watch('is_active')
								? 'El talla está activo y visible para los usuarios'
								: 'El talla está desactivado y no será visible'}
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
							slotProps={{ input: { 'aria-label': 'Estado del talla' } }}
						/>
					</div>
				</div>
			</div>

			{/* Información del Sistema */}
			{size.size_code && (
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
							<span className="text-gray-900 font-semibold">{size.size_code}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-600 font-medium flex items-center gap-2">
								<IoCalendarOutline className="text-base" />
								Creada:
							</span>
							<span className="text-gray-900">
								{new Date(size.created_at).toLocaleDateString('es-ES')}
							</span>
						</div>
						{size.updated_at && (
							<div className="flex items-center justify-between">
								<span className="text-gray-600 font-medium flex items-center gap-2">
									<IoCalendarOutline className="text-base" />
									Actualizada:
								</span>
								<span className="text-gray-900">
									{new Date(size.updated_at).toLocaleDateString('es-ES')}
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

				{size.size_code && (
					<DeleteButton onDelete={handleDelete} itemName={size.size_code} />
				)}
			</div>
		</form>
	);
};
