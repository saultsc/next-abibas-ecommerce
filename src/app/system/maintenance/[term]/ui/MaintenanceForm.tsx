'use client';

import { useRouter } from 'next/navigation';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CustomSelect, DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { useState } from 'react';
import { MaintenanceDocuments } from './MaintenanceDocuments';
import { MaintenanceParts } from './MaintenanceParts';

interface MaintenanceType {
	maintenance_type_id: number;
	type_name: string;
	description?: string;
}

interface Supplier {
	supplier_id: number;
	company_name: string;
}

interface Vehicle {
	vehicle_id: number;
	make: string;
	model: string;
	year: number;
	license_plate: string;
}

interface Maintenance {
	completed_maintenance_id?: number;
	vehicle_id?: number;
	maintenance_type_id?: number;
	description?: string;
	mileage_at_service?: number;
	start_date?: Date;
	completion_date?: Date;
	supplier_id?: number;
	total_cost?: number;
	warranty_days?: number;
	notes?: string;
	state?: string;
	created_at?: Date;
	updated_at?: Date;
}

interface Props {
	maintenance: Maintenance | null;
	maintenanceTypes: MaintenanceType[];
	suppliers: Supplier[];
	vehicles: Vehicle[];
}

interface FormInputs {
	vehicle_id: number;
	maintenance_type_id: number;
	description: string;
	mileage_at_service: number;
	start_date: Date;
	completion_date: Date | null;
	supplier_id: number;
	total_cost: number;
	warranty_days: number;
	notes: string;
	state: string;
}

export const MaintenanceForm = (props: Props) => {
	const { maintenance, maintenanceTypes, suppliers, vehicles } = props;

	const router = useRouter();

	const isEditMode = !!maintenance?.completed_maintenance_id;

	const [maintenanceTypeSearch, setMaintenanceTypeSearch] = useState('');
	const [supplierSearch, setSupplierSearch] = useState('');
	const [vehicleSearch, setVehicleSearch] = useState('');

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			vehicle_id: maintenance?.vehicle_id ?? ('' as any),
			maintenance_type_id: maintenance?.maintenance_type_id ?? ('' as any),
			description: maintenance?.description ?? '',
			mileage_at_service: maintenance?.mileage_at_service ?? 0,
			start_date: maintenance?.start_date ?? dayjs().toDate(),
			completion_date: maintenance?.completion_date ?? null,
			supplier_id: maintenance?.supplier_id ?? ('' as any),
			total_cost: maintenance?.total_cost ?? 0,
			warranty_days: maintenance?.warranty_days ?? 0,
			notes: maintenance?.notes ?? '',
			state: maintenance?.state ?? 'A',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		console.log('Form Data:', data);

		// Simulando guardado
		toast.success(
			isEditMode
				? 'Mantenimiento actualizado exitosamente'
				: 'Mantenimiento creado exitosamente'
		);

		// Esperar 1 segundo y redirigir
		setTimeout(() => {
			router.replace('/system/maintenance');
		}, 1000);
	};

	const handleDelete = async () => {
		// Simulando eliminación
		toast.success('Mantenimiento eliminado exitosamente');

		setTimeout(() => {
			router.replace('/system/maintenance');
		}, 1000);
	};

	// Filtros para búsqueda simulada
	const filteredMaintenanceTypes = maintenanceTypes.filter((type) =>
		type.type_name.toLowerCase().includes(maintenanceTypeSearch.toLowerCase())
	);

	const filteredSuppliers = suppliers.filter((supplier) =>
		supplier.company_name.toLowerCase().includes(supplierSearch.toLowerCase())
	);

	const filteredVehicles = vehicles.filter(
		(vehicle) =>
			vehicle.make.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
			vehicle.model.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
			vehicle.license_plate.toLowerCase().includes(vehicleSearch.toLowerCase())
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 mb-6 pb-6">
			{/* Columna Izquierda - Información del Mantenimiento */}
			<div className="w-[70%] flex flex-col gap-6">
				{/* Sección: Información del Vehículo */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Información del Vehículo
					</h3>
					<div className="flex flex-col gap-4">
						{/* Vehículo */}
						<CustomSelect
							className="w-full"
							id="vehicle-select"
							label="Vehículo"
							value={watch('vehicle_id') || ''}
							{...register('vehicle_id', {
								required: 'Este campo es requerido',
							})}
							onChange={(value) => {
								setValue('vehicle_id', value ? Number(value) : ('' as any), {
									shouldValidate: true,
								});
							}}
							onSearch={(value) => setVehicleSearch(value)}
							options={filteredVehicles.map((vehicle) => ({
								value: vehicle.vehicle_id,
								label: `${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.license_plate}`,
							}))}
							error={!!errors.vehicle_id}
							helperText={errors.vehicle_id?.message}
							clearable
							required
						/>

						{/* Kilometraje al momento del servicio */}
						<TextField
							label="Kilometraje al momento del servicio *"
							type="number"
							variant="filled"
							className="w-full"
							error={!!errors.mileage_at_service}
							helperText={errors.mileage_at_service?.message}
							{...register('mileage_at_service', {
								required: 'Este campo es requerido',
								min: {
									value: 0,
									message: 'El kilometraje debe ser mayor a 0',
								},
							})}
						/>
					</div>
				</div>

				{/* Sección: Detalles del Mantenimiento */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Detalles del Mantenimiento
					</h3>
					<div className="flex flex-col gap-4">
						{/* Tipo de Mantenimiento */}
						<CustomSelect
							className="w-full"
							id="maintenance-type-select"
							label="Tipo de Mantenimiento"
							value={watch('maintenance_type_id') || ''}
							{...register('maintenance_type_id', {
								required: 'Este campo es requerido',
							})}
							onChange={(value) => {
								setValue(
									'maintenance_type_id',
									value ? Number(value) : ('' as any),
									{
										shouldValidate: true,
									}
								);
							}}
							onSearch={(value) => setMaintenanceTypeSearch(value)}
							options={filteredMaintenanceTypes.map((type) => ({
								value: type.maintenance_type_id,
								label: type.type_name,
							}))}
							error={!!errors.maintenance_type_id}
							helperText={errors.maintenance_type_id?.message}
							clearable
							required
						/>

						{/* Descripción */}
						<TextField
							label="Descripción *"
							variant="filled"
							className="w-full"
							multiline
							rows={3}
							error={!!errors.description}
							helperText={errors.description?.message}
							{...register('description', {
								required: 'Este campo es requerido',
								maxLength: {
									value: 1000,
									message: 'La descripción no puede exceder 1000 caracteres',
								},
							})}
						/>

						{/* Fecha de inicio y Fecha de finalización */}
						<div className="flex gap-4">
							<DatePicker
								label="Fecha de inicio *"
								value={watch('start_date') ? dayjs(watch('start_date')) : null}
								format="DD/MM/YYYY"
								slotProps={{
									textField: {
										variant: 'filled',
										error: !!errors.start_date,
										helperText: errors.start_date?.message,
										fullWidth: true,
									},
									field: { clearable: true },
								}}
								{...register('start_date', {
									required: 'Este campo es requerido',
								})}
								onChange={(date) =>
									setValue(
										'start_date',
										date ? dayjs(date).toDate() : (null as any),
										{
											shouldValidate: true,
										}
									)
								}
							/>

							<DatePicker
								label="Fecha de finalización"
								value={
									watch('completion_date')
										? dayjs(watch('completion_date'))
										: null
								}
								format="DD/MM/YYYY"
								slotProps={{
									textField: {
										variant: 'filled',
										error: !!errors.completion_date,
										helperText: errors.completion_date?.message,
										fullWidth: true,
									},
									field: { clearable: true },
								}}
								onChange={(date) =>
									setValue(
										'completion_date',
										date ? dayjs(date).toDate() : null,
										{
											shouldValidate: true,
										}
									)
								}
							/>
						</div>
					</div>
				</div>

				{/* Sección: Información del Proveedor y Costos */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">Proveedor y Costos</h3>
					<div className="flex flex-col gap-4">
						{/* Proveedor */}
						<CustomSelect
							className="w-full"
							id="supplier-select"
							label="Proveedor de Servicio"
							value={watch('supplier_id') || ''}
							{...register('supplier_id', {
								required: 'Este campo es requerido',
							})}
							onChange={(value) => {
								setValue('supplier_id', value ? Number(value) : ('' as any), {
									shouldValidate: true,
								});
							}}
							onSearch={(value) => setSupplierSearch(value)}
							options={filteredSuppliers.map((supplier) => ({
								value: supplier.supplier_id,
								label: supplier.company_name,
							}))}
							error={!!errors.supplier_id}
							helperText={errors.supplier_id?.message}
							clearable
							required
						/>

						{/* Costo total y Días de garantía */}
						<div className="flex gap-4">
							<TextField
								label="Costo Total *"
								type="number"
								variant="filled"
								className="w-full"
								error={!!errors.total_cost}
								helperText={errors.total_cost?.message}
								{...register('total_cost', {
									required: 'Este campo es requerido',
									min: {
										value: 0,
										message: 'El costo debe ser mayor o igual a 0',
									},
								})}
								inputProps={{
									step: '0.01',
								}}
							/>

							<TextField
								label="Días de Garantía *"
								type="number"
								variant="filled"
								className="w-full"
								error={!!errors.warranty_days}
								helperText={errors.warranty_days?.message}
								{...register('warranty_days', {
									required: 'Este campo es requerido',
									min: {
										value: 0,
										message: 'Los días de garantía deben ser mayor o igual a 0',
									},
								})}
							/>
						</div>

						{/* Notas */}
						<TextField
							label="Notas adicionales"
							variant="filled"
							className="w-full"
							multiline
							rows={3}
							error={!!errors.notes}
							helperText={errors.notes?.message}
							{...register('notes', {
								maxLength: {
									value: 1000,
									message: 'Las notas no pueden exceder 1000 caracteres',
								},
							})}
						/>

						<StateSwitch
							state={watch('state')}
							onStateChange={(newState) => setValue('state', newState)}
							gender="el"
							entityName="mantenimiento"
						/>
					</div>
				</div>

				{/* Información del Sistema */}
				{maintenance?.completed_maintenance_id && (
					<SystemInfoCard
						idValue={maintenance.completed_maintenance_id}
						createdAt={maintenance.created_at}
						updatedAt={maintenance.updated_at}
					/>
				)}

				{/* Botones */}
				<div className="flex gap-4">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
						Guardar
					</button>

					{maintenance?.completed_maintenance_id && (
						<DeleteButton
							onDelete={handleDelete}
							itemName={`Mantenimiento #${maintenance.completed_maintenance_id}`}
						/>
					)}
				</div>
			</div>

			{/* Columna Derecha - Información Adicional */}
			<div className="w-[30%] flex flex-col gap-6 sticky top-4 self-start">
				{/* Partes y Materiales */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Partes y Materiales
					</h3>
					<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[200px] max-h-[400px] overflow-y-auto">
						<MaintenanceParts />
					</div>
				</div>

				{/* Documentos */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">Documentos</h3>
					<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[200px] max-h-[300px] overflow-y-auto">
						<MaintenanceDocuments />
					</div>
				</div>
			</div>
		</form>
	);
};
