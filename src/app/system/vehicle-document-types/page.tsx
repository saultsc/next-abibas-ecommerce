export const revalidate = 0;

import { getPaginatedVehicleDocumentTypes } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { VehicleDocumentType } from '@/interfaces';
import Link from 'next/link';
import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function VehicleTypesPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: vehicleDocumentType = [], totalPages = 0 } =
		await getPaginatedVehicleDocumentTypes({
			page,
		});

	const vehicleDocumentTypeColumns: Column<VehicleDocumentType>[] = [
		{
			header: 'Tipo de Documento',
			cell: (c: VehicleDocumentType) => (
				<Link
					href={`vehicle-document-types/${c.document_type_id}`}
					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
					{c.type_name}
				</Link>
			),
		},
		{
			header: 'Estado',
			cell: (c: VehicleDocumentType) => <StateBadge state={c.state} />,
		},
	];

	return (
		<>
			<Title title="Tipos de Documentos de Vehiculos" />
			<div className="flex justify-end mb-5">
				<Link
					href="vehicle-document-types/new"
					className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table columns={vehicleDocumentTypeColumns} rows={vehicleDocumentType} />
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
