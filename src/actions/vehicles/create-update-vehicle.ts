'use server';

import { prisma } from '@/lib';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const vehicleSchema = z.object({
	vehicle_id: z.coerce.number().optional(),
	vehicle_type_id: z.coerce.number().min(1, 'El tipo de vehículo es obligatorio'),
	make: z.string().min(1, 'La marca es obligatoria').max(100),
	model: z.string().min(1, 'El modelo es obligatorio').max(100),
	year: z.coerce
		.number()
		.min(1900, 'Año inválido')
		.max(new Date().getFullYear() + 1),
	license_plate: z.string().min(1, 'La placa es obligatoria').max(20),
	vin: z.string().max(50).optional().nullable(),
	engine_number: z.string().max(50).optional().nullable(),
	color: z.string().max(50).optional().nullable(),
	current_mileage: z.coerce.number().min(0, 'El kilometraje debe ser positivo'),
	load_capacity_kg: z.coerce.number().min(0).optional(),
	vehicle_status_id: z.coerce.number().min(1, 'El estado es obligatorio'),
	supplier_id: z.coerce.number().optional().nullable(),
	purchase_date: z.string().optional().nullable(),
	purchase_price: z.coerce.number().optional().nullable(),
	state: z.enum(['A', 'I']).default('A'),
});

export const createUpdateVehicle = async (formData: FormData) => {
	try {
		const data = Object.fromEntries(formData.entries());

		// Limpiar campos vacíos
		Object.keys(data).forEach((key) => {
			if (data[key] === '' || data[key] === 'null' || data[key] === 'undefined') {
				data[key] = null as any;
			}
		});

		const parsed = vehicleSchema.safeParse(data);

		if (!parsed.success) {
			return {
				ok: false,
				message: parsed.error.issues[0]?.message || 'Datos inválidos',
			};
		}

		const { vehicle_id, purchase_date, supplier_id, ...rest } = parsed.data;

		// Validar que el tipo de vehículo existe
		const vehicleTypeExists = await prisma.vehicle_types.findUnique({
			where: { vehicle_type_id: rest.vehicle_type_id },
		});

		if (!vehicleTypeExists) {
			return {
				ok: false,
				message: 'El tipo de vehículo no existe',
			};
		}

		// Validar que el estado del vehículo existe
		const vehicleStatusExists = await prisma.vehicle_statuses.findUnique({
			where: { vehicle_status_id: rest.vehicle_status_id },
		});

		if (!vehicleStatusExists) {
			return {
				ok: false,
				message: 'El estado del vehículo no existe',
			};
		}

		// Validar proveedor si se proporciona
		if (supplier_id && supplier_id > 0) {
			const supplierExists = await prisma.suppliers.findUnique({
				where: { supplier_id },
			});

			if (!supplierExists) {
				return {
					ok: false,
					message: 'El proveedor no existe',
				};
			}
		}

		// Verificar placa duplicada
		const existingPlate = await prisma.vehicles.findFirst({
			where: {
				license_plate: rest.license_plate,
				...(vehicle_id ? { NOT: { vehicle_id } } : {}),
			},
		});

		if (existingPlate) {
			return {
				ok: false,
				message: 'Ya existe un vehículo con esa placa',
			};
		}

		const vehicleData = {
			...rest,
			load_capacity_kg: rest.load_capacity_kg || 0,
			supplier_id: supplier_id && supplier_id > 0 ? supplier_id : null,
			purchase_date: purchase_date ? new Date(purchase_date) : null,
		};

		let vehicle;

		if (vehicle_id) {
			// Actualizar
			vehicle = await prisma.vehicles.update({
				where: { vehicle_id },
				data: {
					...vehicleData,
					updated_at: new Date(),
				},
			});
		} else {
			// Crear
			vehicle = await prisma.vehicles.create({
				data: vehicleData,
			});
		}

		revalidatePath('/system/vehicles');
		revalidatePath(`/system/vehicles/${vehicle.vehicle_id}`);

		return {
			ok: true,
			message: vehicle_id ? 'Vehículo actualizado' : 'Vehículo creado',
			vehicle,
		};
	} catch (error) {
		console.error('Error al crear/actualizar vehículo:', error);
		return {
			ok: false,
			message: 'Error al guardar el vehículo',
		};
	}
};
