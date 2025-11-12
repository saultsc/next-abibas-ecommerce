export const revalidate = 0;

import { getPaginatedCategories } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { Category } from '@/interfaces';
import { dateFormat } from '@/utils/dateFormat';
import Link from 'next/link';
import { IoAddCircleOutline, IoEyeOffOutline, IoEyeOutline, IoTimeOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: categories = [], totalPages = 0 } = await getPaginatedCategories({
		page,
	});

	const categoryColumns: Column<Category>[] = [
		{
			header: 'Nombre',
			cell: (c: Category) => (
				<Link
					href={`categories/${c.category_id}`}
					className="group hover:underline flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold">
					<IoEyeOffOutline className="text-lg group-hover:hidden transition-all" />
					<IoEyeOutline className="text-lg hidden group-hover:block transition-all" />
					{c.category_name}
				</Link>
			),
		},
		{
			header: 'Creado',
			cell: (c: Category) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(c.created_at)}
				</span>
			),
		},
		{
			header: 'Actualizado',
			cell: (c: Category) => (
				<span className="flex items-center gap-2 text-gray-600 text-sm">
					<IoTimeOutline className="text-base" />
					{dateFormat(c.updated_at)}
				</span>
			),
		},
		{
			header: 'Estado',
			cell: (c: Category) => <StateBadge state={c.state} />,
		},
	];

	return (
		<>
			<Title title="Categorías" />

			<div className="flex justify-end mb-5">
				<Link href="categories/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nueva
				</Link>
			</div>

			<div className="mb-10">
				<Table
					columns={categoryColumns}
					rows={categories}
					rowHrefs={categories.map(
						(category) => `/system/categories/${category.category_id}`
					)}
				/>
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
