export const revalidate = 0;

import { getPaginatedSizes } from '@/actions';
import { Column, Pagination, Table, Title } from '@/components';
import { Size } from '@/interfaces';
import { dateFormat } from '@/utils/dateFormat';
import Link from 'next/link';
import {
	IoAddCircleOutline,
	IoCheckmarkCircle,
	IoCloseCircle,
	IoEyeOffOutline,
	IoEyeOutline,
	IoTimeOutline,
} from 'react-icons/io5';

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
			cell: (c: Size) => (
				<Link
					href={`sizes/${c.size_code}`}
					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
					{c.size_code}
				</Link>
			),
		},
		{
			header: 'Creado',
			cell: (c: Size) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(c.created_at)}
				</span>
			),
		},
		{
			header: 'Actualizado',
			cell: (c: Size) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(c.updated_at)}
				</span>
			),
		},
		{
			header: 'Estado',
			cell: (c: Size) => (
				<span
					className={`flex items-center gap-2 font-medium ${
						c.is_active ? 'text-green-600' : 'text-gray-400'
					}`}>
					{c.is_active ? (
						<>
							<IoCheckmarkCircle className="text-xl" />
							Activo
						</>
					) : (
						<>
							<IoCloseCircle className="text-xl" />
							Inactivo
						</>
					)}
				</span>
			),
		},
	];

	return (
		<>
			<Title title="Categorías" />

			<div className="flex justify-end mb-5">
				<Link href="categories/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nueva Categoría
				</Link>
			</div>

			<div className="mb-10">
				<Table columns={sizeColumns} rows={sizes} />
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
