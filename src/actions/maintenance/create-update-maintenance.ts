'use server';

import { prisma } from '@/lib';
import { revalidatePath } from 'next/cache';

interface MaintenancePart {
	maintenance_part_id?: number;
	part_description: string;
	part_number?: string | null;
	quantity: number;
	unit_cost: number;
	total_cost?: number;
	supplier_id?: number;
	state?: string;
}

interface MaintenanceDocument {
	maintenance_document_id?: number;
	document_url: string;
	document_name?: string | null;
}

export const createUpdateMaintenance = async (formData: FormData) => {
	// Extraer datos del FormData
	const data = Object.fromEntries(formData.entries());

	const completed_maintenance_id = data.completed_maintenance_id
		? Number(data.completed_maintenance_id)
		: undefined;
	const scheduled_maintenance_id = data.scheduled_maintenance_id
		? Number(data.scheduled_maintenance_id)
		: null;
	const vehicle_id = Number(data.vehicle_id);
	const maintenance_type_id = Number(data.maintenance_type_id);
	const description = data.description as string;
	const mileage_at_service = Number(data.mileage_at_service);
	const start_date = new Date(data.start_date as string);
	const completion_date = data.completion_date ? new Date(data.completion_date as string) : null;
	const supplier_id = Number(data.supplier_id);
	const total_cost = Number(data.total_cost);
	const warranty_days = Number(data.warranty_days);
	const notes = data.notes as string | undefined;
	const state = (data.state as string) || 'A';

	// Obtener partes del FormData
	const partsJson = formData.get('parts') as string;
	const parts = partsJson ? JSON.parse(partsJson) : [];

	// Obtener IDs de documentos existentes que se mantienen
	const existingDocumentsJson = formData.get('existingDocuments') as string;
	const existingDocumentIds = existingDocumentsJson ? JSON.parse(existingDocumentsJson) : [];

	// Obtener archivos de documentos
	const documentFiles = formData.getAll('documents') as File[];

	console.log('📄 Documentos recibidos:', documentFiles.length);
	console.log(
		'📄 Tipos de documentos:',
		documentFiles.map((f) => f.name)
	);

	let uploadedDocumentUrls: (string | null)[] = [];

	try {
		// Subir nuevos archivos de documentos
		if (documentFiles && documentFiles.length > 0) {
			console.log('⬆️ Intentando subir documentos...');
			const uploadResult = await uploadDocuments(documentFiles);
			console.log('✅ Resultado de la subida:', uploadResult);
			if (uploadResult) {
				uploadedDocumentUrls = uploadResult;
				console.log('📋 URLs guardadas:', uploadedDocumentUrls);
			} else {
				console.log('❌ uploadResult es null o undefined');
			}
		} else {
			console.log('⚠️ No hay archivos de documentos para subir');
		}

		// Validaciones
		if (!vehicle_id || vehicle_id <= 0) {
			return {
				ok: false,
				message: 'Debe seleccionar un vehículo válido',
			};
		}

		if (!maintenance_type_id || maintenance_type_id <= 0) {
			return {
				ok: false,
				message: 'Debe seleccionar un tipo de mantenimiento válido',
			};
		}

		if (!description || description.trim() === '') {
			return {
				ok: false,
				message: 'La descripción es requerida',
			};
		}

		if (!supplier_id || supplier_id <= 0) {
			return {
				ok: false,
				message: 'Debe seleccionar un proveedor válido',
			};
		}

		if (mileage_at_service < 0) {
			return {
				ok: false,
				message: 'El kilometraje no puede ser negativo',
			};
		}

		if (total_cost < 0) {
			return {
				ok: false,
				message: 'El costo total no puede ser negativo',
			};
		}

		// Verificar que el vehículo existe
		const vehicle = await prisma.vehicles.findUnique({
			where: { vehicle_id },
		});

		if (!vehicle) {
			return {
				ok: false,
				message: 'El vehículo especificado no existe',
			};
		}

		// Verificar que el tipo de mantenimiento existe
		const maintenanceType = await prisma.maintenance_types.findUnique({
			where: { maintenance_type_id },
		});

		if (!maintenanceType) {
			return {
				ok: false,
				message: 'El tipo de mantenimiento especificado no existe',
			};
		}

		// Verificar que el proveedor existe
		const supplier = await prisma.suppliers.findUnique({
			where: { supplier_id },
		});

		if (!supplier) {
			return {
				ok: false,
				message: 'El proveedor especificado no existe',
			};
		}

		let maintenance;

		// Usar transacción para garantizar consistencia
		console.log('🔄 Iniciando transacción...');
		maintenance = await prisma.$transaction(async (tx) => {
			let savedMaintenance;

			if (completed_maintenance_id) {
				console.log('✏️ Actualizando mantenimiento existente:', completed_maintenance_id);
				// Actualizar mantenimiento existente
				savedMaintenance = await tx.completed_maintenance.update({
					where: {
						completed_maintenance_id,
					},
					data: {
						scheduled_maintenance_id,
						vehicle_id,
						maintenance_type_id,
						description: description.trim(),
						mileage_at_service,
						start_date,
						completion_date,
						supplier_id,
						total_cost,
						warranty_days,
						notes: notes?.trim() || null,
						state,
						updated_at: new Date(),
					},
				});

				// Procesar partes al actualizar
				if (parts && parts.length > 0) {
					for (const part of parts) {
						if (part.maintenance_part_id) {
							// Verificar si la parte existe en la BD
							const existingPart = await tx.maintenance_parts.findUnique({
								where: { maintenance_part_id: part.maintenance_part_id },
							});

							if (existingPart) {
								// Actualizar parte existente
								await tx.maintenance_parts.update({
									where: { maintenance_part_id: part.maintenance_part_id },
									data: {
										part_description: part.part_description,
										part_number: part.part_number || null,
										quantity: part.quantity,
										unit_cost: part.unit_cost,
										...(part.supplier_id && { supplier_id: part.supplier_id }),
										state: part.state || 'A',
										updated_at: new Date(),
									},
								});
							} else {
								// El ID es temporal, crear nueva parte
								await tx.maintenance_parts.create({
									data: {
										completed_maintenance_id:
											savedMaintenance.completed_maintenance_id,
										part_description: part.part_description,
										part_number: part.part_number || null,
										quantity: part.quantity,
										unit_cost: part.unit_cost,
										...(part.supplier_id && { supplier_id: part.supplier_id }),
										state: part.state || 'A',
									},
								});
							}
						} else {
							// Crear nueva parte
							await tx.maintenance_parts.create({
								data: {
									completed_maintenance_id:
										savedMaintenance.completed_maintenance_id,
									part_description: part.part_description,
									part_number: part.part_number || null,
									quantity: part.quantity,
									unit_cost: part.unit_cost,
									...(part.supplier_id && { supplier_id: part.supplier_id }),
									state: part.state || 'A',
								},
							});
						}
					}
				}

				// Gestionar documentos: eliminar los que no están en existingDocumentIds
				if (existingDocumentIds.length > 0) {
					const documentsToDelete = await tx.maintenance_documents.findMany({
						where: {
							completed_maintenance_id: savedMaintenance.completed_maintenance_id,
							maintenance_document_id: { notIn: existingDocumentIds },
						},
					});

					if (documentsToDelete.length > 0) {
						await tx.maintenance_documents.deleteMany({
							where: {
								completed_maintenance_id: savedMaintenance.completed_maintenance_id,
								maintenance_document_id: { notIn: existingDocumentIds },
							},
						});

						// Eliminar archivos físicos
						await rollbackUploadedDocuments(
							documentsToDelete.map((doc) => doc.document_url)
						);
					}
				} else {
					// Si no hay documentos existentes, eliminar todos
					const documentsToDelete = await tx.maintenance_documents.findMany({
						where: {
							completed_maintenance_id: savedMaintenance.completed_maintenance_id,
						},
					});

					if (documentsToDelete.length > 0) {
						await tx.maintenance_documents.deleteMany({
							where: {
								completed_maintenance_id: savedMaintenance.completed_maintenance_id,
							},
						});

						// Eliminar archivos físicos
						await rollbackUploadedDocuments(
							documentsToDelete.map((doc) => doc.document_url)
						);
					}
				}
			} else {
				console.log('➕ Creando nuevo mantenimiento');
				// Crear nuevo mantenimiento
				savedMaintenance = await tx.completed_maintenance.create({
					data: {
						scheduled_maintenance_id,
						vehicle_id,
						maintenance_type_id,
						description: description.trim(),
						mileage_at_service,
						start_date,
						completion_date,
						supplier_id,
						total_cost,
						warranty_days,
						notes: notes?.trim() || null,
						state,
					},
				});

				// Crear partes si hay
				if (parts && parts.length > 0) {
					for (const part of parts) {
						await tx.maintenance_parts.create({
							data: {
								completed_maintenance_id: savedMaintenance.completed_maintenance_id,
								part_description: part.part_description,
								part_number: part.part_number || null,
								quantity: part.quantity,
								unit_cost: part.unit_cost,
								...(part.supplier_id && { supplier_id: part.supplier_id }),
								state: part.state || 'A',
							},
						});
					}
				}
			}

			console.log(
				'📦 Documentos a guardar - uploadedDocumentUrls.length:',
				uploadedDocumentUrls.length
			);
			console.log('📦 Array completo:', JSON.stringify(uploadedDocumentUrls));

			// Agregar nuevos documentos subidos
			if (uploadedDocumentUrls.length > 0) {
				console.log('💾 Guardando documentos en BD:', uploadedDocumentUrls);
				const validDocuments = uploadedDocumentUrls.filter((url) => url !== null);

				if (validDocuments.length > 0) {
					for (const docUrl of validDocuments) {
						const doc = await tx.maintenance_documents.create({
							data: {
								completed_maintenance_id: savedMaintenance.completed_maintenance_id,
								document_url: docUrl!,
								document_name: null,
							},
						});
						console.log('✅ Documento guardado:', doc);
					}
				}
			} else {
				console.log('⚠️ No hay documentos para guardar');
			}

			return savedMaintenance;
		});

		revalidatePath('/system/maintenance');

		// Serializar para convertir Decimal a número
		const serializedMaintenance = JSON.parse(
			JSON.stringify(maintenance, (key, value) => {
				if (value && typeof value === 'object' && value.constructor.name === 'Decimal') {
					return Number(value);
				}
				return value;
			})
		);

		return {
			ok: true,
			maintenance: serializedMaintenance,
			message: completed_maintenance_id
				? 'Mantenimiento actualizado correctamente'
				: 'Mantenimiento creado correctamente',
		};
	} catch (error) {
		console.error('Error al guardar mantenimiento:', error);

		// Rollback de documentos subidos si hay error
		if (uploadedDocumentUrls && uploadedDocumentUrls.length > 0) {
			await rollbackUploadedDocuments(uploadedDocumentUrls);
		}

		return {
			ok: false,
			message: 'Error al guardar mantenimiento',
		};
	}
};

// Función para subir documentos
const uploadDocuments = async (documents: File[]) => {
	try {
		console.log('📤 uploadDocuments - Procesando', documents.length, 'archivos');

		const uploadPromises = documents.map(async (document) => {
			try {
				console.log('📄 Procesando archivo:', document.name, 'Tamaño:', document.size);

				const buffer = await document.arrayBuffer();
				const bytes = new Uint8Array(buffer);

				const timestamp = Date.now();
				const randomString = Math.random().toString(36).substring(2, 15);
				const extension = document.name.split('.').pop() || 'pdf';
				const fileName = `${timestamp}-${randomString}.${extension}`;

				const filePath = `public/maintenance-docs/${fileName}`;

				const fs = await import('fs/promises');
				await fs.writeFile(filePath, bytes);

				console.log('✅ Archivo guardado en:', filePath);

				return `/maintenance-docs/${fileName}`;
			} catch (error) {
				console.log('❌ Error al subir documento:', error);
				return null;
			}
		});

		const uploadedDocuments = await Promise.all(uploadPromises);
		console.log('📦 Documentos subidos:', uploadedDocuments);
		return uploadedDocuments;
	} catch (error) {
		console.log('❌ Error en uploadDocuments:', error);
		return null;
	}
};

// Función para eliminar documentos en caso de rollback
const rollbackUploadedDocuments = async (documentUrls: (string | null)[]) => {
	try {
		const fs = await import('fs/promises');

		const deletePromises = documentUrls.map(async (documentUrl) => {
			if (!documentUrl) return;

			try {
				const filePath = `public${documentUrl}`;
				await fs.access(filePath);
				await fs.unlink(filePath);
				console.log(`Rollback: Documento eliminado ${documentUrl}`);
			} catch (error) {
				console.warn(`Rollback: No se pudo eliminar ${documentUrl}`, error);
			}
		});

		await Promise.all(deletePromises);
	} catch (error) {
		console.error('Error durante el rollback de documentos:', error);
	}
};
