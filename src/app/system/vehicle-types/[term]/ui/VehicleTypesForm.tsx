'use client';
import { useRouter } from 'next/navigation';

import { DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { VehicleType } from '@/interfaces';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createOrUpdateVehicleType } from '@/actions/vehicle-types/create-update-vehicleTypes';
import { deleteVehicleType } from '@/actions/vehicle-types/delete-vehicleTypes';

interface Props {
	vehicleType: VehicleType;
}

interface FormInputs {
	type_name: string;
	description: string | null;
	load_capacity_kg: number;
	state: string;
}

export const VehicleTypesForm = ({ vehicleType }: Props) => {
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			type_name: vehicleType.type_name,
			description: vehicleType.description ?? '',
			load_capacity_kg:
				typeof vehicleType.load_capacity_kg === 'number'
					? vehicleType.load_capacity_kg
					: Number(vehicleType.load_capacity_kg),
			state: vehicleType.state ?? 'A',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { type_name, state } = data;

		if (vehicleType.vehicle_type_id) {
			formData.append('vehicle_type_id', vehicleType.vehicle_type_id.toString());
		}

		formData.append('type_name', type_name);
		formData.append('description', data.description || '');
		formData.append('load_capacity_kg', data.load_capacity_kg.toString());
		formData.append('state', state);

		const {
			success,
			data: vehicleTypeData,
			message,
		} = await createOrUpdateVehicleType(formData);

		if (!success) {
			toast.error(message || 'Error al guardar el tipo de vehículo');
			return;
		}

		toast.success(message || 'Tipo de vehículo guardado exitosamente');
		router.replace(`/system/vehicle-types/${vehicleTypeData?.vehicle_type_id}`);
	};

	const handleDelete = async () => {
		if (!vehicleType.vehicle_type_id) return;
		const { success, message } = await deleteVehicleType(vehicleType.vehicle_type_id);

		if (!success) {
			toast.error(message || 'No se pudo eliminar el tipo de vehículo');
			return;
		}

		toast.success('Tipo de vehículo eliminado exitosamente');
		router.replace('/system/vehicle-types');
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mb-6 pb-6">
			{/* Nombre del tipo de vehículo */}
			<div className="w-full mb-4">
				<TextField
					label="Nombre del tipo de vehículo *"
					variant="filled"
					className="w-full"
					error={!!errors.type_name}
					helperText={errors.type_name?.message}
					{...register('type_name', {
						required: 'El nombre del tipo de vehículo es requerido',
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

			{/* Descripción */}
			<div className="w-full mb-4">
				<TextField
					label="Descripción"
					variant="filled"
					className="w-full"
					{...register('description')}
				/>
			</div>
			{/* Capacidad de carga (kg) */}
			<div className="w-full mb-4">
				<TextField
					label="Capacidad de carga (kg) *"
					variant="filled"
					className="w-full"
					error={!!errors.load_capacity_kg}
					helperText={errors.load_capacity_kg?.message}
					type="number"
					inputProps={{
						min: 0,
						step: 'any',
						pattern: '[0-9]*',
						inputMode: 'numeric',
					}}
					onKeyDown={(e) => {
						if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
							e.preventDefault();
						}
					}}
					{...register('load_capacity_kg', {
						valueAsNumber: true,
						required: 'La capacidad de carga es requerida',
						min: {
							value: 0,
							message: 'La capacidad de carga debe ser mayor o igual a 0',
						},
						validate: (value) => {
							if (isNaN(value)) {
								return 'Debe ingresar un número válido';
							}
							return true;
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
			{vehicleType.vehicle_type_id && (
				<SystemInfoCard
					idValue={vehicleType.vehicle_type_id}
					createdAt={vehicleType.created_at}
					updatedAt={vehicleType.updated_at}
				/>
			)}

			{/* Botones */}
			<div className="flex gap-4">
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
					Guardar
				</button>

				{vehicleType.vehicle_type_id && (
					<DeleteButton onDelete={handleDelete} itemName={vehicleType.type_name} />
				)}
			</div>
		</form>
	);
};
