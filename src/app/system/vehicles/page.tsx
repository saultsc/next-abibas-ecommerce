export const revalidate = 0;

import { getPaginatedVehicles } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { Vehicle } from '@/interfaces';
import Link from 'next/link';
import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function VehiclePage({ searchParams }: Props) {
	const resolved = await searchParams;
	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: vehicle = [], totalPages = 0 } = await getPaginatedVehicles({
		page,
	});

	const vehicleColumns: Column<Vehicle>[] = [
		{
			header: 'Marca',
			cell: (c: Vehicle) => (
				<Link
					href={`vehicle/${c.vehicle_id}`}
					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
					{c.make}
				</Link>
			),
		},
		{
			header: 'Modelo',
			cell: (c: Vehicle) => <span className="text-gray-600 text-sm">{c.model}</span>,
		},
		{
			header: 'Año',
			cell: (c: Vehicle) => <span className="text-gray-600 text-sm">{c.year}</span>,
		},
		{
			header: 'Placa',
			cell: (c: Vehicle) => <span className="text-gray-600 text-sm">{c.license_plate}</span>,
		},
		{
			header: 'Kilometraje',
			cell: (c: Vehicle) => (
				<span className="text-gray-600 text-sm">
					{c.current_mileage.toLocaleString()} km
				</span>
			),
		},
		{
			header: 'Estado',
			cell: (c: Vehicle) => <StateBadge state={c.state} />,
		},
	];

	return (
		<>
			<Title title="Vehículos" />
			<div className="flex justify-end mb-5">
				<Link href="vehicle/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table columns={vehicleColumns} rows={vehicle} />
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
