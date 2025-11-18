import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import Link from 'next/link';
import {
	IoAddCircleOutline,
	IoCalendarOutline,
	IoCarOutline,
	IoCubeOutline,
} from 'react-icons/io5';

export const revalidate = 0;

interface ShipmentRecord {
	shipment_id: number;
	shipment_number: string;
	vehicle: string;
	driver: string;
	status: string;
	orders_count: number;
	ship_date: Date;
	delivery_date: Date | null;
	state: string;
}

// Static data for shipments
const staticShipmentsData: ShipmentRecord[] = [
	{
		shipment_id: 1,
		shipment_number: 'SHP-2024-001',
		vehicle: 'Mercedes-Benz Sprinter - DEL-001',
		driver: 'Carlos Mendoza',
		status: 'En Ruta',
		orders_count: 5,
		ship_date: new Date('2024-01-15'),
		delivery_date: null,
		state: 'A',
	},
	{
		shipment_id: 2,
		shipment_number: 'SHP-2024-002',
		vehicle: 'Ford Transit - DEL-002',
		driver: 'Ana García',
		status: 'Entregado',
		orders_count: 8,
		ship_date: new Date('2024-01-14'),
		delivery_date: new Date('2024-01-14'),
		state: 'A',
	},
	{
		shipment_id: 3,
		shipment_number: 'SHP-2024-003',
		vehicle: 'Isuzu NPR - DEL-003',
		driver: 'Roberto Silva',
		status: 'Pendiente',
		orders_count: 3,
		ship_date: new Date('2024-01-16'),
		delivery_date: null,
		state: 'A',
	},
	{
		shipment_id: 4,
		shipment_number: 'SHP-2024-004',
		vehicle: 'RAM ProMaster - DEL-004',
		driver: 'María López',
		status: 'En Ruta',
		orders_count: 6,
		ship_date: new Date('2024-01-15'),
		delivery_date: null,
		state: 'A',
	},
	{
		shipment_id: 5,
		shipment_number: 'SHP-2024-005',
		vehicle: 'Chevrolet Express - DEL-005',
		driver: 'José Ramírez',
		status: 'Entregado',
		orders_count: 4,
		ship_date: new Date('2024-01-13'),
		delivery_date: new Date('2024-01-13'),
		state: 'A',
	},
	{
		shipment_id: 6,
		shipment_number: 'SHP-2024-006',
		vehicle: 'Nissan NV2500 - DEL-006',
		driver: 'Laura Martínez',
		status: 'Pendiente',
		orders_count: 7,
		ship_date: new Date('2024-01-17'),
		delivery_date: null,
		state: 'A',
	},
	{
		shipment_id: 7,
		shipment_number: 'SHP-2024-007',
		vehicle: 'Ford E-Transit - DEL-007',
		driver: 'Pedro González',
		status: 'En Ruta',
		orders_count: 5,
		ship_date: new Date('2024-01-15'),
		delivery_date: null,
		state: 'A',
	},
	{
		shipment_id: 8,
		shipment_number: 'SHP-2024-008',
		vehicle: 'Mercedes-Benz Sprinter - DEL-001',
		driver: 'Carlos Mendoza',
		status: 'Entregado',
		orders_count: 9,
		ship_date: new Date('2024-01-12'),
		delivery_date: new Date('2024-01-12'),
		state: 'A',
	},
	{
		shipment_id: 9,
		shipment_number: 'SHP-2024-009',
		vehicle: 'Ford Transit - DEL-002',
		driver: 'Ana García',
		status: 'Cancelado',
		orders_count: 2,
		ship_date: new Date('2024-01-14'),
		delivery_date: null,
		state: 'I',
	},
	{
		shipment_id: 10,
		shipment_number: 'SHP-2024-010',
		vehicle: 'Isuzu NPR - DEL-003',
		driver: 'Roberto Silva',
		status: 'Pendiente',
		orders_count: 4,
		ship_date: new Date('2024-01-18'),
		delivery_date: null,
		state: 'A',
	},
];

interface Props {
	searchParams: Promise<{
		page?: string;
	}>;
}

export default async function ShipmentsPage({ searchParams }: Props) {
	const resolved = await searchParams;
	const page = resolved?.page ? parseInt(resolved.page) : 1;

	// Simulando paginación con datos estáticos
	const limit = 10;
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedData = staticShipmentsData.slice(startIndex, endIndex);
	const totalPages = Math.ceil(staticShipmentsData.length / limit);

	const shipmentsColumns: Column<ShipmentRecord>[] = [
		{
			header: 'N° Envío',
			cell: (shipment: ShipmentRecord) => (
				<Link
					href={`/system/shipments/${shipment.shipment_number}`}
					className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
					{shipment.shipment_number}
				</Link>
			),
		},
		{
			header: 'Vehículo',
			cell: (shipment: ShipmentRecord) => (
				<span className="flex items-center gap-2 text-gray-800">
					<IoCarOutline className="text-lg flex-shrink-0" />
					<span className="truncate max-w-[200px]" title={shipment.vehicle}>
						{shipment.vehicle}
					</span>
				</span>
			),
		},
		{
			header: 'Conductor',
			cell: (shipment: ShipmentRecord) => (
				<span className="text-gray-700 text-sm font-medium">{shipment.driver}</span>
			),
		},
		{
			header: 'Estado',
			cell: (shipment: ShipmentRecord) => {
				const statusColors: Record<string, string> = {
					Pendiente: 'bg-yellow-100 text-yellow-800',
					'En Ruta': 'bg-blue-100 text-blue-800',
					Entregado: 'bg-green-100 text-green-800',
					Cancelado: 'bg-red-100 text-red-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							statusColors[shipment.status] || 'bg-gray-100 text-gray-800'
						}`}>
						{shipment.status}
					</span>
				);
			},
		},
		{
			header: 'Órdenes',
			cell: (shipment: ShipmentRecord) => (
				<span className="flex items-center gap-1 text-gray-700 font-semibold whitespace-nowrap">
					<IoCubeOutline className="text-base" />
					{shipment.orders_count}
				</span>
			),
		},
		{
			header: 'Fecha Envío',
			cell: (shipment: ShipmentRecord) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm whitespace-nowrap">
					<IoCalendarOutline className="text-base" />
					{shipment.ship_date.toLocaleDateString('es-ES')}
				</span>
			),
		},
		{
			header: 'Fecha Entrega',
			cell: (shipment: ShipmentRecord) => (
				<span className="text-gray-600 text-sm whitespace-nowrap">
					{shipment.delivery_date
						? shipment.delivery_date.toLocaleDateString('es-ES')
						: '-'}
				</span>
			),
		},
		{
			header: 'Estado',
			cell: (shipment: ShipmentRecord) => <StateBadge state={shipment.state} />,
		},
	];

	return (
		<div className="p-6">
			<Title title="Envíos" />

			<div className="flex justify-end mb-5">
				<Link href="shipments/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mt-6">
				<Table<ShipmentRecord> rows={paginatedData} columns={shipmentsColumns} />

				<Pagination totalPages={totalPages} />
			</div>
		</div>
	);
}
