export const revalidate = 0;

import { getPaginatedSizes } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { Size } from '@/interfaces';
import { dateFormat } from '@/utils/dateFormat';
import Link from 'next/link';
import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline, IoTimeOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function SizesPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: sizes = [], totalPages = 0 } = await getPaginatedSizes({
		page,
	});

	const sizeColumns: Column<Size>[] = [
		{
			header: 'Nombre',
			cell: (z: Size) => (
				<Link
					href={`sizes/${z.size_code}`}
					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
					{z.size_code}
				</Link>
			),
		},
		{
			header: 'Creado',
			cell: (z: Size) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(z.created_at)}
				</span>
			),
		},
		{
			header: 'Actualizado',
			cell: (z: Size) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(z.updated_at)}
				</span>
			),
		},
		{
			header: 'Estado',
			cell: (z: Size) => <StateBadge state={z.state} />,
		},
	];

	return (
		<>
			<Title title="Tallas" />
			<div className="flex justify-end mb-5">
				<Link href="sizes/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nueva
				</Link>
			</div>

			<div className="mb-10">
				<Table
					columns={sizeColumns}
					rows={sizes}
					rowHrefs={sizes.map((size) => `/system/sizes/${size.size_code}`)}
				/>
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
