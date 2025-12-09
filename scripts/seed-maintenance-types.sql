-- Seed para tipos de mantenimiento
INSERT INTO maintenance_types (type_name, description, state, created_at, updated_at)
VALUES 
	('Mantenimiento Preventivo', 'Revisión general programada del vehículo', 'A', GETDATE(), GETDATE()),
	('Cambio de Aceite', 'Cambio de aceite de motor y filtros', 'A', GETDATE(), GETDATE()),
	('Cambio de Neumáticos', 'Reemplazo de neumáticos', 'A', GETDATE(), GETDATE()),
	('Reparación de Frenos', 'Mantenimiento del sistema de frenos', 'A', GETDATE(), GETDATE()),
	('Reparación de Suspensión', 'Mantenimiento del sistema de suspensión', 'A', GETDATE(), GETDATE()),
	('Reparación de Transmisión', 'Mantenimiento de la transmisión', 'A', GETDATE(), GETDATE()),
	('Sistema Eléctrico', 'Reparación y mantenimiento eléctrico', 'A', GETDATE(), GETDATE()),
	('Sistema de Refrigeración', 'Mantenimiento del sistema de enfriamiento', 'A', GETDATE(), GETDATE()),
	('Mantenimiento Mayor', 'Servicio completo de alto kilometraje', 'A', GETDATE(), GETDATE()),
	('Reparación de Carrocería', 'Reparaciones de chapa y pintura', 'A', GETDATE(), GETDATE()),
	('Alineación y Balanceo', 'Alineación y balanceo de ruedas', 'A', GETDATE(), GETDATE()),
	('Cambio de Batería', 'Reemplazo de batería del vehículo', 'A', GETDATE(), GETDATE()),
	('Limpieza de Inyectores', 'Limpieza del sistema de inyección', 'A', GETDATE(), GETDATE()),
	('Revisión de Aire Acondicionado', 'Mantenimiento del sistema de climatización', 'A', GETDATE(), GETDATE()),
	('Cambio de Embrague', 'Reemplazo del sistema de embrague', 'A', GETDATE(), GETDATE());

-- Seed para estados de mantenimiento
INSERT INTO maintenance_statuses (status_name, state, created_at, updated_at)
VALUES 
	('Programado', 'A', GETDATE(), GETDATE()),
	('En Proceso', 'A', GETDATE(), GETDATE()),
	('Completado', 'A', GETDATE(), GETDATE()),
	('Cancelado', 'A', GETDATE(), GETDATE()),
	('Pendiente de Aprobación', 'A', GETDATE(), GETDATE());
