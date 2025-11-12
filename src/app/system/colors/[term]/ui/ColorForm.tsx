'use client';

import { createOrUpdateColor, deleteColor } from '@/actions';
import { DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { Color } from '@/interfaces';
import { TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
	color: Color;
}

interface FormInputs {
	color_name: string;
	hex_code: string;
	state: string;
}

export const ColorForm = ({ color }: Props) => {
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			...color,
			hex_code: color.hex_code ?? '',
			state: color.state ?? 'A',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { color_name, state, hex_code } = data;

		if (color.color_id) {
			formData.append('color_id', color.color_id.toString());
		}

		formData.append('color_name', color_name);
		formData.append('hex_code', hex_code);
		formData.append('state', state.toString());

		const { success, message } = await createOrUpdateColor(formData);

		if (!success) {
			toast.error(message || 'Error al guardar el color');
			return;
		}

		toast.success(message || 'Color guardado exitosamente');

		router.replace(`/system/colors`);
	};

	const handleDelete = async () => {
		if (!color.color_id) return;

		const { success, message } = await deleteColor(color.color_id);

		if (!success) {
			toast.error(message || 'No se pudo eliminar el color');
			return;
		}

		toast.success(message || 'Color eliminado exitosamente');

		router.replace('/system/colors');
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mb-6 pb-6">
			{/* Nombre del Color */}
			<div className="w-full mb-4">
				<TextField
					label="Color *"
					variant="filled"
					className="w-full"
					error={!!errors.color_name}
					helperText={errors.color_name?.message}
					{...register('color_name', {
						required: 'El nombre de color es requerido',
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

			{/* Código Hexadecimal */}
			<div className="w-full mb-4">
				<p className="mb-2 font-semibold text-gray-700">Código Hexadecimal (Opcional)</p>
				<div className="flex gap-4 items-end">
					<div className="flex-1">
						<TextField
							label="Código HEX"
							variant="filled"
							className="w-full"
							placeholder="#FF5733"
							error={!!errors.hex_code}
							helperText={
								errors.hex_code?.message || 'Formato: #RRGGBB (ejemplo: #FF5733)'
							}
							value={watch('hex_code') || ''}
							{...register('hex_code', {
								pattern: {
									value: /^#[0-9A-Fa-f]{6}$/,
									message:
										'Formato inválido. Debe ser #RRGGBB (ejemplo: #FF5733)',
								},
								maxLength: {
									value: 7,
									message: 'El código no puede exceder 7 caracteres',
								},
							})}
						/>
					</div>
					<div className="flex flex-col items-center gap-1 mb-6">
						<label className="text-xs text-gray-600 font-medium">
							Selector de Color
						</label>
						<div className="relative">
							<input
								type="color"
								value={watch('hex_code') || '#000000'}
								onChange={(e) => setValue('hex_code', e.target.value)}
								className="w-20 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
								title="Selecciona un color"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Estado */}
			<StateSwitch
				state={watch('state')}
				onStateChange={(newState) => setValue('state', newState)}
				entityName="color"
				gender="el"
			/>

			{/* Información del Sistema */}
			{color.color_id && (
				<SystemInfoCard
					idValue={color.color_id}
					createdAt={color.created_at}
					updatedAt={color.updated_at}
				/>
			)}

			{/* Botones */}
			<div className="flex gap-4">
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
					Guardar
				</button>

				{color.color_id && (
					<DeleteButton onDelete={handleDelete} itemName={color.color_name} />
				)}
			</div>
		</form>
	);
};
