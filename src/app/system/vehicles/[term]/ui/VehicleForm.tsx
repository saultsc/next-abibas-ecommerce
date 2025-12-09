'use client';

import { useRouter } from 'next/navigation';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createUpdateVehicle, deleteVehicle } from '@/actions/vehicles';
import { CustomSelect, DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { Vehicle, VehicleStatus, VehicleType } from '@/interfaces';

interface Supplier {
	supplier_id: number;
	company_name: string;
}

interface Props {
	vehicle: Vehicle;
	vehicleTypes: VehicleType[];
	vehicleStatuses: VehicleStatus[];
	suppliers: Supplier[];
}

interface FormInputs {
	vehicle_type_id: number;
	make: string;
	model: string;
	year: number;
	license_plate: string;
	vin: string;
	engine_number: string;
	color: string;
	current_mileage: number;
	load_capacity_kg: number;
	vehicle_status_id: number;
	supplier_id: number;
	purchase_date: Date | null;
	purchase_price: number;
	state: string;
}

export const VehicleForm = (props: Props) => {
	const { vehicle, vehicleTypes, vehicleStatuses, suppliers } = props;

	const router = useRouter();

	const isEditMode = !!vehicle.vehicle_id;

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			vehicle_type_id: vehicle.vehicle_type_id ?? ('' as any),
			make: vehicle.make ?? '',
			model: vehicle.model ?? '',
			year: vehicle.year ?? new Date().getFullYear(),
			license_plate: vehicle.license_plate ?? '',
			vin: vehicle.vin ?? '',
			engine_number: vehicle.engine_number ?? '',
			color: vehicle.color ?? '',
			current_mileage: vehicle.current_mileage ?? 0,
			load_capacity_kg:
				typeof vehicle.load_capacity_kg === 'number'
					? vehicle.load_capacity_kg
					: Number(vehicle.load_capacity_kg) || 0,
			vehicle_status_id: vehicle.vehicle_status_id ?? ('' as any),
			supplier_id: vehicle.supplier_id ?? ('' as any),
			purchase_date: vehicle.purchase_date ? dayjs(vehicle.purchase_date).toDate() : null,
			purchase_price:
				typeof vehicle.purchase_price === 'number'
					? vehicle.purchase_price
					: Number(vehicle.purchase_price) || 0,
			state: vehicle.state ?? 'A',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		if (vehicle.vehicle_id) {
			formData.append('vehicle_id', vehicle.vehicle_id.toString());
		}

		formData.append('vehicle_type_id', data.vehicle_type_id.toString());
		formData.append('make', data.make);
		formData.append('model', data.model);
		formData.append('year', data.year.toString());
		formData.append('license_plate', data.license_plate);
		formData.append('vin', data.vin || '');
		formData.append('engine_number', data.engine_number || '');
		formData.append('color', data.color || '');
		formData.append('current_mileage', data.current_mileage.toString());
		formData.append('load_capacity_kg', data.load_capacity_kg.toString());
		formData.append('vehicle_status_id', data.vehicle_status_id.toString());

		if (data.supplier_id) {
			formData.append('supplier_id', data.supplier_id.toString());
		}

		if (data.purchase_date) {
			formData.append('purchase_date', data.purchase_date.toISOString());
		}

		if (data.purchase_price) {
			formData.append('purchase_price', data.purchase_price.toString());
		}

		formData.append('state', data.state);

		const { ok, message, vehicle: savedVehicle } = await createUpdateVehicle(formData);

		if (!ok) {
			toast.error(message || 'Error al guardar el vehículo');
			return;
		}

		toast.success(message || 'Vehículo guardado exitosamente');

		if (savedVehicle?.vehicle_id) {
			router.replace(`/system/vehicles/${savedVehicle.vehicle_id}`);
		}
	};

	const handleDelete = async () => {
		if (!vehicle.vehicle_id) return;

		const { ok, message } = await deleteVehicle(vehicle.vehicle_id);

		if (!ok) {
			toast.error(message || 'No se pudo eliminar el vehículo');
			return;
		}

		toast.success('Vehículo eliminado exitosamente');
		router.replace('/system/vehicles');
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
			{/* Columna Izquierda - Formulario Principal */}
			<div className="w-[70%] flex flex-col gap-6">
				{/* Información del Vehículo */}
				<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
					<h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
						Información del Vehículo
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<CustomSelect
							label="Tipo de Vehículo *"
							value={watch('vehicle_type_id')}
							onChange={(value) => setValue('vehicle_type_id', Number(value))}
							options={vehicleTypes.map((vt) => ({
								value: vt.vehicle_type_id,
								label: vt.type_name,
							}))}
							error={!!errors.vehicle_type_id}
							helperText={errors.vehicle_type_id?.message}
						/>{' '}
						<TextField
							label="Marca *"
							variant="filled"
							fullWidth
							{...register('make', {
								required: 'La marca es obligatoria',
								maxLength: { value: 100, message: 'Máximo 100 caracteres' },
							})}
							error={!!errors.make}
							helperText={errors.make?.message}
						/>
						<TextField
							label="Modelo *"
							variant="filled"
							fullWidth
							{...register('model', {
								required: 'El modelo es obligatorio',
								maxLength: { value: 100, message: 'Máximo 100 caracteres' },
							})}
							error={!!errors.model}
							helperText={errors.model?.message}
						/>
						<TextField
							label="Año *"
							variant="filled"
							type="number"
							fullWidth
							{...register('year', {
								required: 'El año es obligatorio',
								valueAsNumber: true,
								min: { value: 1900, message: 'Año inválido' },
								max: {
									value: new Date().getFullYear() + 1,
									message: 'Año inválido',
								},
							})}
							error={!!errors.year}
							helperText={errors.year?.message}
						/>
						<TextField
							label="Placa *"
							variant="filled"
							fullWidth
							{...register('license_plate', {
								required: 'La placa es obligatoria',
								maxLength: { value: 20, message: 'Máximo 20 caracteres' },
							})}
							error={!!errors.license_plate}
							helperText={errors.license_plate?.message}
						/>
						<TextField
							label="VIN"
							variant="filled"
							fullWidth
							{...register('vin', {
								maxLength: { value: 50, message: 'Máximo 50 caracteres' },
							})}
							error={!!errors.vin}
							helperText={errors.vin?.message}
						/>
						<TextField
							label="Número de Motor"
							variant="filled"
							fullWidth
							{...register('engine_number', {
								maxLength: { value: 50, message: 'Máximo 50 caracteres' },
							})}
							error={!!errors.engine_number}
							helperText={errors.engine_number?.message}
						/>
						<TextField
							label="Color"
							variant="filled"
							fullWidth
							{...register('color', {
								maxLength: { value: 50, message: 'Máximo 50 caracteres' },
							})}
							error={!!errors.color}
							helperText={errors.color?.message}
						/>
					</div>
				</div>

				{/* Especificaciones Técnicas */}
				<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
					<h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
						Especificaciones Técnicas
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<TextField
							label="Kilometraje Actual *"
							variant="filled"
							type="number"
							fullWidth
							{...register('current_mileage', {
								required: 'El kilometraje es obligatorio',
								valueAsNumber: true,
								min: { value: 0, message: 'Debe ser positivo' },
							})}
							error={!!errors.current_mileage}
							helperText={errors.current_mileage?.message}
						/>

						<TextField
							label="Capacidad de Carga (kg)"
							variant="filled"
							type="number"
							fullWidth
							{...register('load_capacity_kg', {
								valueAsNumber: true,
								min: { value: 0, message: 'Debe ser positivo' },
							})}
							error={!!errors.load_capacity_kg}
							helperText={errors.load_capacity_kg?.message}
						/>

						<CustomSelect
							label="Estado del Vehículo *"
							value={watch('vehicle_status_id')}
							onChange={(value) => setValue('vehicle_status_id', Number(value))}
							options={vehicleStatuses.map((vs) => ({
								value: vs.vehicle_status_id,
								label: vs.status_name,
							}))}
							error={!!errors.vehicle_status_id}
							helperText={errors.vehicle_status_id?.message}
						/>
					</div>
				</div>

				{/* Información de Compra */}
				<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
					<h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
						Información de Compra
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<CustomSelect
							label="Proveedor"
							value={watch('supplier_id') || ''}
							onChange={(value) =>
								setValue('supplier_id', value ? Number(value) : ('' as any))
							}
							options={suppliers.map((s) => ({
								value: s.supplier_id,
								label: s.company_name,
							}))}
						/>

						<DatePicker
							label="Fecha de Compra"
							value={watch('purchase_date') ? dayjs(watch('purchase_date')) : null}
							onChange={(date) =>
								setValue('purchase_date', date ? date.toDate() : null)
							}
							slotProps={{
								textField: {
									variant: 'filled',
									fullWidth: true,
								},
							}}
						/>

						<TextField
							label="Precio de Compra"
							variant="filled"
							type="number"
							fullWidth
							{...register('purchase_price', {
								valueAsNumber: true,
								min: { value: 0, message: 'Debe ser positivo' },
							})}
							error={!!errors.purchase_price}
							helperText={errors.purchase_price?.message}
						/>
					</div>
				</div>

				{/* Estado */}
				<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
					<StateSwitch
						state={watch('state')}
						onStateChange={(newState) => setValue('state', newState)}
						gender="el"
						entityName="vehículo"
					/>
				</div>
			</div>

			{/* Columna Derecha - Información del Sistema */}
			<div className="w-[30%] flex flex-col gap-6 sticky top-4 self-start">
				{/* Información del Sistema */}
				{vehicle.vehicle_id && (
					<SystemInfoCard
						idValue={vehicle.vehicle_id}
						createdAt={vehicle.created_at}
						updatedAt={vehicle.updated_at}
					/>
				)}

				{/* Botones */}
				<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
					<div className="flex flex-col gap-4">
						<button
							type="submit"
							className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
							Guardar
						</button>

						{vehicle.vehicle_id && (
							<DeleteButton
								onDelete={handleDelete}
								itemName={`${vehicle.make} ${vehicle.model} - ${vehicle.license_plate}`}
							/>
						)}
					</div>
				</div>
			</div>
		</form>
	);
};
