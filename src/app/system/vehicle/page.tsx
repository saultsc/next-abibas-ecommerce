export const revalidate = 0;

import { getPaginatedVehicles } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { VehicleWithRelations } from '@/interfaces';
import { dateFormat } from '@/utils/dateFormat';
import Link from 'next/link';
import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline, IoTimeOutline } from 'react-icons/io5';

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function VehiclePage({ searchParams }: Props) {
    const resolved = await searchParams;
    const page = resolved?.page ? parseInt(resolved.page) : 1;

    const { data: vehicle = [], totalPages = 0 } = await getPaginatedVehicles({
        page,
    });

    const vehicleColumns: Column<VehicleWithRelations>[] = [
        {
            header: 'Marca',
            cell: (c: VehicleWithRelations) => (
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
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.model}
                </span>
            ),
        },
        {
            header: 'Año',
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.year}
                </span>
            ),
        },
        {
            header: 'Placa',
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.license_plate}
                </span>
            ),
        },
        {
            header: 'Fecha de compra',
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.purchase_date ? dateFormat(c.purchase_date) : '-'}
                </span>
            ),
        },
        {
            header: 'Precio de compra',
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.purchase_price ? c.purchase_price.toString() : '-'}
                </span>
            ),
        },
        {
            header: 'Tipo de Vehículo',
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.vehicle_types?.type_name || '-'}
                </span>
            ),
        },
        {
            header: 'Estado del Vehículo',
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.vehicle_statuses?.status_name || '-'}
                </span>
            ),
        },
        {
            header: 'Suplidor',
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.suppliers?.company_name || '-'}
                </span>
            ),
        },
        {
            header: 'Kilometraje',
            cell: (c: VehicleWithRelations) => (
                <span className="text-gray-600 text-sm">
                    {c.current_mileage.toLocaleString()} km
                </span>
            ),
        },
        {
            header: 'Actualizado',
            cell: (c: VehicleWithRelations) => (
                <span className="flex items-center gap-2 text-gray-600 text-sm">
                    <IoTimeOutline className="text-base" />
                    {dateFormat(c.updated_at)}
                </span>
            ),
        },
        {
            header: 'Estado',
            cell: (c: VehicleWithRelations) => <StateBadge state={c.state} />,
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
                <Table columns={vehicleColumns} rows={vehicle as unknown as VehicleWithRelations[]} />
                {totalPages > 0 && <Pagination totalPages={totalPages} />}
            </div>
        </>
    );
}





// export const revalidate = 0;

// import {  } from '@/actions';
// import { Column, Pagination, StateBadge, Table, Title } from '@/components';
// import { Vehicle} from '@/interfaces';
// import { dateFormat } from '@/utils/dateFormat';
// import Link from 'next/link';
// import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline, IoTimeOutline } from 'react-icons/io5';

// interface Props {
// 	searchParams: Promise<{ page?: string }>;
// }

// export default async function VehiclePage({ searchParams }: Props) {
// 	const resolved = await searchParams;

// 	const page = resolved?.page ? parseInt(resolved.page) : 1;


//         const { data:   vehicle = [], totalPages = 0 } = await getPaginatedVehicles({
//             page,
//         });

// 	const vehicleColumns: Column<Vehicle>[] = [
// 		{
// 			header: 'Marca',
// 			cell: (c: Vehicle) => (
// 				<Link
// 					href={`vehicle-document-types/${c.vehicle_id}`}   
// 					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
// 					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
// 					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
// 					{c.make}
// 				</Link>
// 			),
// 		},
// 		{
// 			header: 'Modelo',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.model}
// 				</span>
// 			),
// 		},
// 		{
// 			header: 'Año',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.year}
// 				</span>
// 			),
// 		},
//         {
// 			header: 'Placa',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.license_plate}
// 				</span>
// 			),
// 		},
//          {
// 			header: 'VIN',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.vin}
// 				</span>
// 			),
// 		},
//         {
// 			header: 'Numero de Motor',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.engine_number}
// 				</span>
// 			),
// 		},
//         {
// 			header: 'Color',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.color}
// 				</span>
// 			),
// 		},
//         {
// 			header: 'Kilometraje actual',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.current_mileage}
// 				</span>
// 			),
// 		},
// 		{
// 			header: 'Capacidad de carga',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.load_capacity_kg !== undefined ? String(c.load_capacity_kg) : '-'}
// 				</span>
// 			),
// 		},
//         {
// 			header: 'Estado del Vehículo',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.vehicle_status_id}
// 				</span>
// 			),
// 		},
//         {
// 			header: 'Suplidor',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{c.supplier_id}
// 				</span>
// 			),
// 		},
//         {
// 			header: 'Creado',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{dateFormat(c.created_at)}
// 				</span>
// 			),
// 		},
//         {
// 			header: 'Actualizado',
// 			cell: (c: Vehicle) => (
// 				<span className="flex items-center gap-2 text-gray-600 text-sm">
// 					<IoTimeOutline className="text-base" />
// 					{dateFormat(c.updated_at)}
// 				</span>
// 			),
// 		},

// 		{
// 			header: 'Estado',
// 			cell: (c: Vehicle) => <StateBadge state={c.state} />,
// 		},
// 	];

// 	return (
// 		<>
// 			<Title title="Tipos de Documentos de Vehiculos" />
// 			<div className="flex justify-end mb-5">
// 				<Link href="vehicle-document-types/new" className="btn-primary flex items-center gap-2">
// 					<IoAddCircleOutline className="text-xl" />
// 					Nuevo
// 				</Link>
// 			</div>

// 			<div className="mb-10">
// 				<Table columns={vehicleColumns} rows={vehicle} />
// 				{totalPages > 0 && <Pagination totalPages={totalPages} />}
// 			</div>
// 		</>
// 	);
// }
