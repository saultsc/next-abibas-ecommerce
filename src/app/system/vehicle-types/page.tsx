export const revalidate = 0;

import { getPaginatedVehicleTypes } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { VehicleType } from '@/interfaces';
import { dateFormat } from '@/utils/dateFormat';
import { Decimal } from '@prisma/client/runtime/client';
import Link from 'next/link';
import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline, IoTimeOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function VehicleTypesPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: vehicleTypes = [], totalPages = 0 } = await getPaginatedVehicleTypes({
		page,
	});

	const vehicleTypeColumns: Column<VehicleType>[] = [
		{
			header: 'Nombre',
			cell: (c: VehicleType) => (
				<Link
					href={`vehicle-types/${c.vehicle_type_id}`}
					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
					{c.type_name}
				</Link>
			),
		},
		{
			header: 'Capacidad',
			cell: (c: VehicleType) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{Decimal(c.load_capacity_kg).toNumber()} kg
				</span>
			),
		},
		{
			header: 'Creado',
			cell: (c: VehicleType) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(c.created_at)}
				</span>
			),
		},
		{
			header: 'Actualizado',
			cell: (c: VehicleType) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(c.updated_at)}
				</span>
			),
		},
		{
			header: 'Estado',
			cell: (c: VehicleType) => <StateBadge state={c.state} />,
		},
	];

	return (
		<>
			<Title title="Tipos de Vehículos" />
			<div className="flex justify-end mb-5">
				<Link href="vehicle-types/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table columns={vehicleTypeColumns} rows={vehicleTypes} />
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
