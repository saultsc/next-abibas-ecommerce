export const revalidate = 0;

import { getPaginatedVehicleStatuses } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { VehicleStatus } from '@/interfaces';
import Link from 'next/link';
import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function VehicleStatusPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: vehicleStatuses = [], totalPages = 0 } = await getPaginatedVehicleStatuses({
		page,
	});

	const vehicleStatusColumns: Column<VehicleStatus>[] = [
		{
			header: 'Nombre Estado',
			cell: (c: VehicleStatus) => (
				<Link
					href={`vehicle-status/${c.vehicle_status_id}`}
					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
					{c.status_name}
				</Link>
			),
		},
		{
			header: 'Estado',
			cell: (c: VehicleStatus) => <StateBadge state={c.state} />,
		},
	];

	return (
		<>
			<Title title="Tipos de Estados de Vehículos" />
			<div className="flex justify-end mb-5">
				<Link href="vehicle-status/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table columns={vehicleStatusColumns} rows={vehicleStatuses} />
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
