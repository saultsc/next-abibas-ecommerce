'use client';

import { CustomSelect, StateSwitch, SystemInfoCard } from '@/components';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ShipmentOrders } from './ShipmentOrders';

interface Vehicle {
	vehicle_id: number;
	make: string;
	model: string;
	license_plate: string;
}

interface Driver {
	employee_id: number;
	first_name: string;
	last_name: string;
}

interface ShippingStatus {
	status_code: string;
	description: string;
}

interface Shipment {
	shipment_id?: number;
	shipment_number?: string;
	vehicle_id?: number;
	driver_id?: number;
	status_code?: string;
	ship_date?: Date;
	delivery_date?: Date | null;
	notes?: string;
	state?: string;
	created_at?: Date;
	updated_at?: Date;
}

interface ShipmentFormProps {
	shipment: Shipment | null;
	vehicles: Vehicle[];
	drivers: Driver[];
	shippingStatuses: ShippingStatus[];
	isNew: boolean;
}

interface FormInputs {
	vehicle_id: number;
	driver_id: number;
	status_code: string;
	ship_date: Date;
	delivery_date: Date | null;
	notes: string;
	state: string;
}

export function ShipmentForm({
	shipment,
	vehicles,
	drivers,
	shippingStatuses,
	isNew,
}: ShipmentFormProps) {
	const router = useRouter();
	const isEditMode = !isNew;

	const [vehicleSearch, setVehicleSearch] = useState('');
	const [driverSearch, setDriverSearch] = useState('');

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			vehicle_id: shipment?.vehicle_id ?? ('' as any),
			driver_id: shipment?.driver_id ?? ('' as any),
			status_code: shipment?.status_code ?? 'PENDING',
			ship_date: shipment?.ship_date ?? dayjs().toDate(),
			delivery_date: shipment?.delivery_date ?? null,
			notes: shipment?.notes ?? '',
			state: shipment?.state ?? 'A',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		console.log('Form Data:', data);

		// Simulando guardado
		toast.success(isEditMode ? 'Envío actualizado exitosamente' : 'Envío creado exitosamente');

		// Esperar 1 segundo y redirigir
		setTimeout(() => {
			router.replace('/system/shipments');
		}, 1000);
	};

	// Filtros para búsqueda
	const filteredVehicles = vehicles.filter(
		(vehicle) =>
			vehicle.make.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
			vehicle.model.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
			vehicle.license_plate.toLowerCase().includes(vehicleSearch.toLowerCase())
	);

	const filteredDrivers = drivers.filter(
		(driver) =>
			driver.first_name.toLowerCase().includes(driverSearch.toLowerCase()) ||
			driver.last_name.toLowerCase().includes(driverSearch.toLowerCase())
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 mb-6 pb-6">
			{/* Columna Izquierda - Información del Envío */}
			<div className="w-[70%] flex flex-col gap-6">
				{/* Sección: Información del Envío */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Información del Envío
					</h3>
					<div className="flex flex-col gap-4">
						{/* Número de Envío (solo en edición) */}
						{!isNew && shipment?.shipment_number && (
							<TextField
								label="Número de Envío"
								value={shipment.shipment_number}
								variant="filled"
								className="w-full"
								disabled
							/>
						)}

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
								label: `${vehicle.make} ${vehicle.model} - ${vehicle.license_plate}`,
							}))}
							error={!!errors.vehicle_id}
							helperText={errors.vehicle_id?.message}
							clearable
							required
						/>

						{/* Conductor */}
						<CustomSelect
							className="w-full"
							id="driver-select"
							label="Conductor"
							value={watch('driver_id') || ''}
							{...register('driver_id', {
								required: 'Este campo es requerido',
							})}
							onChange={(value) => {
								setValue('driver_id', value ? Number(value) : ('' as any), {
									shouldValidate: true,
								});
							}}
							onSearch={(value) => setDriverSearch(value)}
							options={filteredDrivers.map((driver) => ({
								value: driver.employee_id,
								label: `${driver.first_name} ${driver.last_name}`,
							}))}
							error={!!errors.driver_id}
							helperText={errors.driver_id?.message}
							clearable
							required
						/>

						{/* Estado del Envío */}
						<CustomSelect
							className="w-full"
							id="status-select"
							label="Estado del Envío"
							value={watch('status_code') || ''}
							{...register('status_code', {
								required: 'Este campo es requerido',
							})}
							onChange={(value) => {
								setValue('status_code', value as string, {
									shouldValidate: true,
								});
							}}
							options={shippingStatuses.map((status) => ({
								value: status.status_code,
								label: status.description,
							}))}
							error={!!errors.status_code}
							helperText={errors.status_code?.message}
							required
						/>

						{/* Fechas de Envío y Entrega */}
						<div className="flex gap-4">
							<DatePicker
								label="Fecha de Envío *"
								value={watch('ship_date') ? dayjs(watch('ship_date')) : null}
								format="DD/MM/YYYY"
								slotProps={{
									textField: {
										variant: 'filled',
										error: !!errors.ship_date,
										helperText: errors.ship_date?.message,
										fullWidth: true,
									},
									field: { clearable: true },
								}}
								{...register('ship_date', {
									required: 'Este campo es requerido',
								})}
								onChange={(date) =>
									setValue(
										'ship_date',
										date ? dayjs(date).toDate() : (null as any),
										{
											shouldValidate: true,
										}
									)
								}
							/>

							<DatePicker
								label="Fecha de Entrega"
								value={
									watch('delivery_date') ? dayjs(watch('delivery_date')) : null
								}
								format="DD/MM/YYYY"
								slotProps={{
									textField: {
										variant: 'filled',
										error: !!errors.delivery_date,
										helperText: errors.delivery_date?.message,
										fullWidth: true,
									},
									field: { clearable: true },
								}}
								onChange={(date) =>
									setValue('delivery_date', date ? dayjs(date).toDate() : null, {
										shouldValidate: true,
									})
								}
							/>
						</div>

						{/* Notas / Observaciones */}
						<TextField
							label="Notas / Observaciones"
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
					</div>
				</div>

				{/* Órdenes del Envío */}
				{!isNew && shipment?.shipment_id && (
					<ShipmentOrders shipmentId={shipment.shipment_id} />
				)}
			</div>

			{/* Columna Derecha - Sidebar */}
			<div className="w-[30%] flex flex-col gap-6">
				{/* Estado del Sistema */}
				<div className="w-full">
					<StateSwitch
						state={watch('state')}
						onStateChange={(newState: string) =>
							setValue('state', newState, { shouldValidate: true })
						}
						entityName="envío"
						gender="el"
					/>
				</div>

				{/* Botones de acción */}
				<div className="w-full flex flex-col gap-3">
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
						{isEditMode ? 'Guardar Cambios' : 'Crear Envío'}
					</button>

					<button
						type="button"
						onClick={() => router.back()}
						className="w-full bg-gray-200 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium">
						Cancelar
					</button>
				</div>

				{/* Información del sistema */}
				{isEditMode && shipment && (
					<SystemInfoCard
						createdAt={shipment.created_at!}
						updatedAt={shipment.updated_at!}
					/>
				)}
			</div>
		</form>
	);
}
