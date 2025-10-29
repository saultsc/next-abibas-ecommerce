'use client';

import { createOrUpdateColor, deleteColor } from '@/actions';
import { DeleteButton } from '@/components';
import { Color } from '@/interfaces';
import { Switch, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { IoCalendarOutline, IoInformationCircleOutline, IoKeyOutline } from 'react-icons/io5';

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

		const { success, data: colorData, message } = await createOrUpdateColor(formData);

		if (!success) {
			console.log(message);
			return;
		}

		router.replace(`/system/colors/${colorData?.color_id}`);
	};

	const handleDelete = async () => {
		if (!color.color_id) return;

		const { success, message } = await deleteColor(color.color_id);

		if (!success) {
			console.log(message);
		}

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
			<div className="w-full mb-4">
				<p className="mb-2 font-semibold text-gray-700">Estado</p>
				<div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-300">
					<div className="flex-1">
						<p className="font-medium text-gray-700">Estado de la Categoría</p>
						<p className="text-sm text-gray-500 mt-1">
							{watch('state')
								? 'La categoría está activa y visible para los usuarios'
								: 'La categoría está desactivada y no será visible'}
						</p>
					</div>

					<div className="flex items-center gap-3">
						<span
							className={`text-sm font-medium ${
								watch('state') === 'A' ? 'text-green-600' : 'text-gray-400'
							}`}>
							{watch('state') === 'A' ? 'Activa' : 'Inactiva'}
						</span>
						<Switch
							checked={watch('state') === 'A'}
							onChange={(e) => {
								setValue('state', e.target.checked ? 'A' : 'I');
							}}
							slotProps={{ input: { 'aria-label': 'Estado del color' } }}
						/>
					</div>
				</div>
			</div>

			{/* Información del Sistema */}
			{color.color_id && (
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
							<span className="text-gray-900 font-semibold">{color.color_id}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-600 font-medium flex items-center gap-2">
								<IoCalendarOutline className="text-base" />
								Creada:
							</span>
							<span className="text-gray-900">
								{new Date(color.created_at).toLocaleDateString('es-ES')}
							</span>
						</div>
						{color.updated_at && (
							<div className="flex items-center justify-between">
								<span className="text-gray-600 font-medium flex items-center gap-2">
									<IoCalendarOutline className="text-base" />
									Actualizada:
								</span>
								<span className="text-gray-900">
									{new Date(color.updated_at).toLocaleDateString('es-ES')}
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

				{color.color_id && (
					<DeleteButton onDelete={handleDelete} itemName={color.color_name} />
				)}
			</div>
		</form>
	);
};
