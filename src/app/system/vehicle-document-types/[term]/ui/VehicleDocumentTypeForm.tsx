'use client';
import { useRouter } from 'next/navigation';

import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { VehicleDocumentType } from '@/interfaces';

import { createOrUpdateVehicleDocumentType } from '@/actions/vehicle-document-types/create-update-vehicle-document-types';
import { deleteVehicleDocumentType } from '@/actions/vehicle-document-types/delete-vehicle-document-types';

interface Props {
	vehicleDocumentType: VehicleDocumentType;
}

interface FormInputs {
	type_name: string;
	state: string;
}

export const VehicleDocumentTypeForm = ({ vehicleDocumentType }: Props) => {
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			...vehicleDocumentType,
			state: vehicleDocumentType.state ?? 'A',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { type_name, state } = data;

		if (vehicleDocumentType.document_type_id) {
			formData.append('document_type_id', vehicleDocumentType.document_type_id.toString());
		}

		formData.append('type_name', type_name);
		formData.append('state', state);

		const {
			success,
			data: vehicleDocumentTypeData,
			message,
		} = await createOrUpdateVehicleDocumentType(formData);

		if (!success) {
			toast.error(message || 'Error al guardar el tipo de documento de vehículo');
			return;
		}

		toast.success(message || 'Tipo de documento de vehículo guardado exitosamente');
		router.replace(
			`/system/vehicle-document-types/${vehicleDocumentTypeData?.document_type_id}`
		);
	};

	const handleDelete = async () => {
		if (!vehicleDocumentType.document_type_id) return;
		const { success, message } = await deleteVehicleDocumentType(
			vehicleDocumentType.document_type_id
		);

		if (!success) {
			toast.error(message || 'No se pudo eliminar el tipo de documento de vehículo');
			return;
		}

		toast.success('Tipo de documento de vehículo eliminado exitosamente');
		router.replace('/system/vehicle-document-types');
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mb-6 pb-6">
			{/* Nombre del Tipo de Documento */}
			<div className="w-full mb-4">
				<TextField
					label="Tipo de Documento *"
					variant="filled"
					className="w-full"
					error={!!errors.type_name}
					helperText={errors.type_name?.message}
					{...register('type_name', {
						required: 'El nombre del tipo de documento de vehículo es requerido',
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
			{vehicleDocumentType.document_type_id && (
				<SystemInfoCard
					idValue={vehicleDocumentType.document_type_id}
					createdAt={vehicleDocumentType.created_at}
					updatedAt={vehicleDocumentType.updated_at}
				/>
			)}

			{/* Botones */}
			<div className="flex gap-4">
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
					Guardar
				</button>

				{vehicleDocumentType.document_type_id && (
					<DeleteButton
						onDelete={handleDelete}
						itemName={vehicleDocumentType.type_name}
					/>
				)}
			</div>
		</form>
	);
};
