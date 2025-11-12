export const revalidate = 0;

import { getPaginatedColors } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { Color } from '@/interfaces';
import { dateFormat } from '@/utils/dateFormat';
import Link from 'next/link';
import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline, IoTimeOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function ColorsPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const {
		data: colors,
		totalPages = 0,
		success,
		message,
	} = await getPaginatedColors({
		page,
	});

	if (!success) {
		console.log(message);
	}

	const colorColumns: Column<Color>[] = [
		{
			header: 'Color',
			cell: (c: Color) => (
				<Link
					href={`colors/${c.color_id}`}
					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
					{c.color_name}
				</Link>
			),
		},
		{
			header: 'Código HEX',
			cell: (c: Color) =>
				c.hex_code ? (
					<span className="flex items-center gap-2">
						<span
							className="w-5 h-5 rounded-full border border-gray-300"
							style={{ backgroundColor: c.hex_code }}
						/>
						{c.hex_code}
					</span>
				) : null,
		},
		{
			header: 'Creado',
			cell: (c: Color) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(c.created_at)}
				</span>
			),
		},
		{
			header: 'Actualizado',
			cell: (c: Color) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(c.updated_at)}
				</span>
			),
		},
		{
			header: 'Estado',
			cell: (c: Color) => <StateBadge state={c.state} />,
		},
	];

	return (
		<>
			<Title title="Colores" />
			<div className="flex justify-end mb-5">
				<Link href="colors/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table
					columns={colorColumns}
					rows={colors ?? []}
					rowHrefs={colors?.map((color) => `/system/colors/${color.color_id}`)}
				/>
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
