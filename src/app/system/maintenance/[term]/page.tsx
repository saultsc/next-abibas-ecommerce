import { Title } from '@/components';
import { MaintenanceForm } from './ui';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

// Datos estáticos simulados para tipos de mantenimiento
const mockMaintenanceTypes = [
	{
		maintenance_type_id: 1,
		type_name: 'Mantenimiento Preventivo',
		description: 'Revisión general programada',
	},
	{
		maintenance_type_id: 2,
		type_name: 'Cambio de Aceite',
		description: 'Cambio de aceite y filtros',
	},
	{
		maintenance_type_id: 3,
		type_name: 'Cambio de Neumáticos',
		description: 'Reemplazo de neumáticos',
	},
	{
		maintenance_type_id: 4,
		type_name: 'Reparación de Frenos',
		description: 'Mantenimiento del sistema de frenos',
	},
	{
		maintenance_type_id: 5,
		type_name: 'Reparación de Suspensión',
		description: 'Mantenimiento del sistema de suspensión',
	},
	{
		maintenance_type_id: 6,
		type_name: 'Reparación de Transmisión',
		description: 'Mantenimiento de la transmisión',
	},
	{
		maintenance_type_id: 7,
		type_name: 'Sistema Eléctrico',
		description: 'Reparación y mantenimiento eléctrico',
	},
	{
		maintenance_type_id: 8,
		type_name: 'Sistema de Refrigeración',
		description: 'Mantenimiento del sistema de enfriamiento',
	},
	{
		maintenance_type_id: 9,
		type_name: 'Mantenimiento Mayor',
		description: 'Servicio completo de alto kilometraje',
	},
	{
		maintenance_type_id: 10,
		type_name: 'Reparación de Carrocería',
		description: 'Reparaciones de chapa y pintura',
	},
];

// Datos estáticos simulados para proveedores
const mockSuppliers = [
	{ supplier_id: 1, company_name: 'Mercedes-Benz Commercial' },
	{ supplier_id: 2, company_name: 'Ford Fleet Service' },
	{ supplier_id: 3, company_name: 'Commercial Tire Center' },
	{ supplier_id: 4, company_name: 'RAM Commercial Service' },
	{ supplier_id: 5, company_name: 'Fleet Brake Specialists' },
	{ supplier_id: 6, company_name: 'Nissan Commercial Parts' },
	{ supplier_id: 7, company_name: 'Isuzu Fleet Center' },
	{ supplier_id: 8, company_name: 'Ford Electric Fleet Service' },
	{ supplier_id: 9, company_name: 'AutoZone Commercial' },
	{ supplier_id: 10, company_name: "O'Reilly Fleet Services" },
];

// Datos estáticos simulados para vehículos
const mockVehicles = [
	{
		vehicle_id: 1,
		make: 'Mercedes-Benz',
		model: 'Sprinter 2500',
		year: 2022,
		license_plate: 'DEL-001',
	},
	{ vehicle_id: 2, make: 'Ford', model: 'Transit 350', year: 2021, license_plate: 'DEL-002' },
	{ vehicle_id: 3, make: 'Isuzu', model: 'NPR HD', year: 2020, license_plate: 'DEL-003' },
	{ vehicle_id: 4, make: 'RAM', model: 'ProMaster 2500', year: 2023, license_plate: 'DEL-004' },
	{
		vehicle_id: 5,
		make: 'Chevrolet',
		model: 'Express 3500',
		year: 2021,
		license_plate: 'DEL-005',
	},
	{ vehicle_id: 6, make: 'Nissan', model: 'NV2500 HD', year: 2022, license_plate: 'DEL-006' },
	{
		vehicle_id: 7,
		make: 'Mercedes-Benz',
		model: 'Sprinter 3500',
		year: 2023,
		license_plate: 'DEL-007',
	},
	{ vehicle_id: 8, make: 'Ford', model: 'E-Transit', year: 2024, license_plate: 'DEL-008' },
	{ vehicle_id: 9, make: 'Isuzu', model: 'FTR', year: 2020, license_plate: 'DEL-009' },
	{ vehicle_id: 10, make: 'RAM', model: 'ProMaster City', year: 2022, license_plate: 'DEL-010' },
];

// Datos de mantenimiento estático para edición (simulando una consulta)
const mockMaintenanceData = {
	completed_maintenance_id: 1,
	vehicle_id: 1,
	maintenance_type_id: 1,
	description: 'Cambio de aceite sintético y filtro de aceite',
	mileage_at_service: 85000,
	start_date: new Date('2024-11-15'),
	completion_date: new Date('2024-11-15'),
	supplier_id: 1,
	total_cost: 4500,
	warranty_days: 90,
	notes: 'Servicio completado sin problemas',
	state: 'A',
	created_at: new Date('2024-11-15'),
	updated_at: new Date('2024-11-15'),
};

export default async function MaintenanceByTermPage({ params }: Props) {
	const { term } = await params;

	// Simulando que traemos el mantenimiento por term
	const maintenance = term === 'new' ? null : mockMaintenanceData;

	const title = term === 'new' ? 'Nuevo mantenimiento' : 'Editar mantenimiento';

	return (
		<>
			<Title title={title} backUrl="/system/maintenance" />

			<MaintenanceForm
				maintenance={maintenance}
				maintenanceTypes={mockMaintenanceTypes}
				suppliers={mockSuppliers}
				vehicles={mockVehicles}
			/>
		</>
	);
}
