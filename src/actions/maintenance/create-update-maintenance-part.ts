'use server';

import { prisma } from '@/lib';
import { revalidatePath } from 'next/cache';

interface MaintenancePartData {
	maintenance_part_id?: number;
	completed_maintenance_id: number;
	part_description: string;
	part_number?: string | null;
	quantity: number;
	unit_cost: number;
	supplier_id?: number;
	state?: string;
}

export const createUpdateMaintenancePart = async (data: MaintenancePartData) => {
	try {
		const {
			maintenance_part_id,
			completed_maintenance_id,
			part_description,
			part_number,
			quantity,
			unit_cost,
			supplier_id,
			state = 'A',
		} = data;

		// Validaciones
		if (!completed_maintenance_id || completed_maintenance_id <= 0) {
			return {
				ok: false,
				message: 'El ID del mantenimiento es requerido',
			};
		}

		if (!part_description || part_description.trim() === '') {
			return {
				ok: false,
				message: 'La descripción de la parte es requerida',
			};
		}

		if (!quantity || quantity <= 0) {
			return {
				ok: false,
				message: 'La cantidad debe ser mayor a 0',
			};
		}

		if (unit_cost < 0) {
			return {
				ok: false,
				message: 'El costo unitario no puede ser negativo',
			};
		}

		// Calcular el total
		const total_cost = quantity * unit_cost;

		// Verificar que el mantenimiento existe
		const maintenance = await prisma.completed_maintenance.findUnique({
			where: { completed_maintenance_id },
		});

		if (!maintenance) {
			return {
				ok: false,
				message: 'El mantenimiento especificado no existe',
			};
		}

		// Verificar que el proveedor existe si se proporcionó
		if (supplier_id) {
			const supplier = await prisma.suppliers.findUnique({
				where: { supplier_id },
			});

			if (!supplier) {
				return {
					ok: false,
					message: 'El proveedor especificado no existe',
				};
			}
		}

		let maintenancePart;

		if (maintenance_part_id) {
			// Actualizar parte existente
			maintenancePart = await prisma.maintenance_parts.update({
				where: {
					maintenance_part_id,
				},
				data: {
					completed_maintenance_id,
					part_description: part_description.trim(),
					part_number: part_number?.trim() || null,
					quantity,
					unit_cost,
					...(supplier_id && { supplier_id }),
					state,
					updated_at: new Date(),
				},
			});
		} else {
			// Crear nueva parte
			maintenancePart = await prisma.maintenance_parts.create({
				data: {
					completed_maintenance_id,
					part_description: part_description.trim(),
					part_number: part_number?.trim() || null,
					quantity,
					unit_cost,
					...(supplier_id && { supplier_id }),
					state,
				},
			});
		}

		revalidatePath('/system/maintenance');

		// Serializar para convertir Decimal a número
		const serializedPart = JSON.parse(
			JSON.stringify(maintenancePart, (key, value) => {
				if (value && typeof value === 'object' && value.constructor.name === 'Decimal') {
					return Number(value);
				}
				return value;
			})
		);

		return {
			ok: true,
			maintenancePart: serializedPart,
			message: maintenance_part_id
				? 'Parte actualizada correctamente'
				: 'Parte agregada correctamente',
		};
	} catch (error) {
		console.error('Error al guardar parte de mantenimiento:', error);
		return {
			ok: false,
			message: 'Error al guardar parte de mantenimiento',
		};
	}
};
