export const revalidate = 0;

import { completedMaintenanceSearch } from '@/actions/maintenance';
import { Column, Pagination, Table, Title } from '@/components';
import { dateOnlyFormat } from '@/utils';
import Link from 'next/link';
import {
	IoAddCircleOutline,
	IoCalendarOutline,
	IoCarOutline,
	IoPricetagOutline,
} from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function MaintenancePage({ searchParams }: Props) {
	const resolved = await searchParams;
	const page = resolved?.page ? parseInt(resolved.page) : 1;

	// Obtener datos de mantenimientos desde la base de datos
	const result = await completedMaintenanceSearch({ page, take: 10 });

	if (!result.ok) {
		return (
			<div>
				<Title title="Mantenimientos de Vehículos" />
				<p className="text-red-500">Error al cargar los mantenimientos</p>
			</div>
		);
	}

	const { maintenances = [], totalPages = 0 } = result;

	const maintenanceColumns: Column<any>[] = [
		{
			header: 'Vehículo',
			cell: (m: any) => (
				<Link
					href={`/system/maintenance/${m.completed_maintenance_id}`}
					className="hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoCarOutline className="text-lg shrink-0" />
					<span
						className="truncate max-w-[150px]"
						title={`${m.vehicles.make} ${m.vehicles.model}`}>
						{`${m.vehicles.make} ${m.vehicles.model}`}
					</span>
				</Link>
			),
		},
		{
			header: 'Placa',
			cell: (m: any) => (
				<span className="text-gray-600 text-sm font-medium">
					{m.vehicles.license_plate}
				</span>
			),
		},
		{
			header: 'Tipo de Mantenimiento',
			cell: (m: any) => (
				<span
					className="text-gray-700 text-sm font-medium truncate max-w-[180px] block"
					title={m.maintenance_types.type_name}>
					{m.maintenance_types.type_name}
				</span>
			),
		},
		{
			header: 'Fecha de Mantenimiento',
			cell: (m: any) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm whitespace-nowrap">
					<IoCalendarOutline className="text-base" />
					{dateOnlyFormat(m.start_date)}
				</span>
			),
		},
		{
			header: 'Costo',
			cell: (m: any) => (
				<span className="flex items-center gap-1 text-gray-700 text-sm font-semibold whitespace-nowrap">
					<IoPricetagOutline className="text-base" />${Number(m.total_cost).toFixed(2)}
				</span>
			),
		},
		{
			header: 'Kilometraje',
			cell: (m: any) => (
				<span className="text-gray-600 text-sm whitespace-nowrap">
					{m.mileage_at_service.toLocaleString()} km
				</span>
			),
		},
		{
			header: 'Proveedor de Servicio',
			cell: (m: any) => (
				<span
					className="text-gray-600 text-sm truncate max-w-[150px] block"
					title={m.suppliers.company_name}>
					{m.suppliers.company_name}
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
					rows={maintenances}
					rowHrefs={maintenances.map(
						(m) => `/system/maintenance/${m.completed_maintenance_id}`
					)}
				/>
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
