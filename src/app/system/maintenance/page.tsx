export const revalidate = 0;

import { Column, Pagination, Table, Title } from '@/components';
import { dateOnlyFormat } from '@/utils';
import Link from 'next/link';
import {
	IoAddCircleOutline,
	IoCalendarOutline,
	IoCarOutline,
	IoPricetagOutline,
} from 'react-icons/io5';

interface MaintenanceRecord {
	maintenance_id: number;
	vehicle_make: string;
	vehicle_model: string;
	license_plate: string;
	maintenance_type: string;
	description: string;
	maintenance_date: Date;
	cost: number;
	mileage: number;
	service_provider: string;
	next_maintenance_date?: Date;
	state: string;
	created_at: Date;
	updated_at: Date;
}

// Datos estáticos de ejemplo - Vehículos de entrega
const staticMaintenanceData: MaintenanceRecord[] = [
	{
		maintenance_id: 1,
		vehicle_make: 'Mercedes-Benz',
		vehicle_model: 'Sprinter 2500',
		license_plate: 'DEL-001',
		maintenance_type: 'Mantenimiento Preventivo',
		description: 'Cambio de aceite, filtros y revisión general de motor diésel',
		maintenance_date: new Date('2024-11-15'),
		cost: 4500,
		mileage: 85000,
		service_provider: 'Mercedes-Benz Commercial',
		next_maintenance_date: new Date('2025-02-15'),
		state: 'active',
		created_at: new Date('2024-11-15'),
		updated_at: new Date('2024-11-15'),
	},
	{
		maintenance_id: 2,
		vehicle_make: 'Ford',
		vehicle_model: 'Transit 350',
		license_plate: 'DEL-002',
		maintenance_type: 'Reparación de Sistema de Carga',
		description: 'Reemplazo de puerta trasera y reparación de sistema hidráulico',
		maintenance_date: new Date('2024-11-10'),
		cost: 12500,
		mileage: 120000,
		service_provider: 'Ford Fleet Service',
		next_maintenance_date: new Date('2025-05-10'),
		state: 'active',
		created_at: new Date('2024-11-10'),
		updated_at: new Date('2024-11-10'),
	},
	{
		maintenance_id: 3,
		vehicle_make: 'Isuzu',
		vehicle_model: 'NPR HD',
		license_plate: 'DEL-003',
		maintenance_type: 'Cambio de Neumáticos',
		description: 'Reemplazo de 6 neumáticos de carga pesada',
		maintenance_date: new Date('2024-11-05'),
		cost: 28000,
		mileage: 145000,
		service_provider: 'Commercial Tire Center',
		next_maintenance_date: new Date('2025-11-05'),
		state: 'active',
		created_at: new Date('2024-11-05'),
		updated_at: new Date('2024-11-05'),
	},
	{
		maintenance_id: 4,
		vehicle_make: 'RAM',
		vehicle_model: 'ProMaster 2500',
		license_plate: 'DEL-004',
		maintenance_type: 'Revisión de Suspensión',
		description: 'Reemplazo de amortiguadores y revisión completa de suspensión',
		maintenance_date: new Date('2024-10-28'),
		cost: 8900,
		mileage: 98000,
		service_provider: 'RAM Commercial Service',
		next_maintenance_date: new Date('2025-04-28'),
		state: 'active',
		created_at: new Date('2024-10-28'),
		updated_at: new Date('2024-10-28'),
	},
	{
		maintenance_id: 5,
		vehicle_make: 'Chevrolet',
		vehicle_model: 'Express 3500',
		license_plate: 'DEL-005',
		maintenance_type: 'Reparación de Frenos',
		description:
			'Cambio de pastillas, discos y calibradores de freno en ejes delantero y trasero',
		maintenance_date: new Date('2024-10-20'),
		cost: 15200,
		mileage: 132000,
		service_provider: 'Fleet Brake Specialists',
		next_maintenance_date: new Date('2025-04-20'),
		state: 'active',
		created_at: new Date('2024-10-20'),
		updated_at: new Date('2024-10-20'),
	},
	{
		maintenance_id: 6,
		vehicle_make: 'Nissan',
		vehicle_model: 'NV2500 HD',
		license_plate: 'DEL-006',
		maintenance_type: 'Mantenimiento de Sistema Eléctrico',
		description: 'Reemplazo de alternador y batería de alta capacidad',
		maintenance_date: new Date('2024-10-15'),
		cost: 6800,
		mileage: 76000,
		service_provider: 'Nissan Commercial Parts',
		next_maintenance_date: new Date('2025-10-15'),
		state: 'active',
		created_at: new Date('2024-10-15'),
		updated_at: new Date('2024-10-15'),
	},
	{
		maintenance_id: 7,
		vehicle_make: 'Mercedes-Benz',
		vehicle_model: 'Sprinter 3500',
		license_plate: 'DEL-007',
		maintenance_type: 'Reparación de Sistema de Refrigeración',
		description: 'Cambio de radiador, termostato y mangueras del sistema de enfriamiento',
		maintenance_date: new Date('2024-10-08'),
		cost: 9500,
		mileage: 102000,
		service_provider: 'Mercedes-Benz Commercial',
		next_maintenance_date: new Date('2025-04-08'),
		state: 'active',
		created_at: new Date('2024-10-08'),
		updated_at: new Date('2024-10-08'),
	},
	{
		maintenance_id: 8,
		vehicle_make: 'Ford',
		vehicle_model: 'E-Transit',
		license_plate: 'DEL-008',
		maintenance_type: 'Inspección de Batería Eléctrica',
		description:
			'Diagnóstico completo del sistema de batería eléctrica y actualización de software',
		maintenance_date: new Date('2024-09-30'),
		cost: 3200,
		mileage: 45000,
		service_provider: 'Ford Electric Fleet Service',
		next_maintenance_date: new Date('2025-03-30'),
		state: 'active',
		created_at: new Date('2024-09-30'),
		updated_at: new Date('2024-09-30'),
	},
	{
		maintenance_id: 9,
		vehicle_make: 'Isuzu',
		vehicle_model: 'FTR',
		license_plate: 'DEL-009',
		maintenance_type: 'Mantenimiento Mayor',
		description:
			'Servicio de 150,000 km - Cambio de kit de distribución, embrague y revisión completa',
		maintenance_date: new Date('2024-09-20'),
		cost: 32000,
		mileage: 150000,
		service_provider: 'Isuzu Fleet Center',
		next_maintenance_date: new Date('2025-03-20'),
		state: 'active',
		created_at: new Date('2024-09-20'),
		updated_at: new Date('2024-09-20'),
	},
	{
		maintenance_id: 10,
		vehicle_make: 'RAM',
		vehicle_model: 'ProMaster City',
		license_plate: 'DEL-010',
		maintenance_type: 'Reparación de Transmisión',
		description: 'Reemplazo de caja de cambios automática y fluido de transmisión',
		maintenance_date: new Date('2024-09-10'),
		cost: 18500,
		mileage: 115000,
		service_provider: 'RAM Commercial Service',
		next_maintenance_date: new Date('2025-09-10'),
		state: 'active',
		created_at: new Date('2024-09-10'),
		updated_at: new Date('2024-09-10'),
	},
];

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function MaintenancePage({ searchParams }: Props) {
	const resolved = await searchParams;
	const page = resolved?.page ? parseInt(resolved.page) : 1;

	// Simulando paginación con datos estáticos
	const limit = 10;
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedData = staticMaintenanceData.slice(startIndex, endIndex);
	const totalPages = Math.ceil(staticMaintenanceData.length / limit);

	const maintenanceColumns: Column<MaintenanceRecord>[] = [
		{
			header: 'Vehículo',
			cell: (m: MaintenanceRecord) => (
				<Link
					href={`/system/maintenance/${m.maintenance_id}`}
					className="hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoCarOutline className="text-lg shrink-0" />
					<span
						className="truncate max-w-[150px]"
						title={`${m.vehicle_make} ${m.vehicle_model}`}>
						{`${m.vehicle_make} ${m.vehicle_model}`}
					</span>
				</Link>
			),
		},
		{
			header: 'Placa',
			cell: (m: MaintenanceRecord) => (
				<span className="text-gray-600 text-sm font-medium">{m.license_plate}</span>
			),
		},
		{
			header: 'Tipo de Mantenimiento',
			cell: (m: MaintenanceRecord) => (
				<span
					className="text-gray-700 text-sm font-medium truncate max-w-[180px] block"
					title={m.maintenance_type}>
					{m.maintenance_type}
				</span>
			),
		},
		{
			header: 'Fecha de Mantenimiento',
			cell: (m: MaintenanceRecord) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm whitespace-nowrap">
					<IoCalendarOutline className="text-base" />
					{dateOnlyFormat(m.maintenance_date)}
				</span>
			),
		},
		{
			header: 'Costo',
			cell: (m: MaintenanceRecord) => (
				<span className="flex items-center gap-1 text-gray-700 text-sm font-semibold whitespace-nowrap">
					<IoPricetagOutline className="text-base" />${m.cost.toFixed(2).toLocaleString()}
				</span>
			),
		},
		{
			header: 'Kilometraje',
			cell: (m: MaintenanceRecord) => (
				<span className="text-gray-600 text-sm whitespace-nowrap">
					{m.mileage.toLocaleString()} km
				</span>
			),
		},
		{
			header: 'Proveedor de Servicio',
			cell: (m: MaintenanceRecord) => (
				<span
					className="text-gray-600 text-sm truncate max-w-[150px] block"
					title={m.service_provider}>
					{m.service_provider}
				</span>
			),
		},
	];

	return (
		<>
			<Title title="Mantenimientos de Vehículos" />

			<div className="flex justify-end mb-5">
				<Link href="maintenance/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table
					columns={maintenanceColumns}
					rows={paginatedData}
					rowHrefs={paginatedData.map((m) => `/system/maintenance/${m.maintenance_id}`)}
				/>
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
