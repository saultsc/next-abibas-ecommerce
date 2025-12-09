export const revalidate = 0;

import { getPaginatedCustomers } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { User } from '@/interfaces';

import Link from 'next/link';

interface Props {
	searchParams: Promise<{ page?: string }>;
}
export default async function CustomersPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: users = [], totalPages = 0 } = await getPaginatedCustomers({ page, limit: 10 });

	const userColumns: Column<User>[] = [
		{
			header: 'Usuario',
			cell: (p: User) => (
				<Link href={`/system/customers/${p.user_id}`} className="hover:underline">
					{p.username}
				</Link>
			),
		},
		{
			header: 'Nombre',
			cell: (p: User) =>
				p.persons && p.persons.first_name && p.persons.last_name ? (
					<span>{`${p.persons.first_name} ${p.persons.last_name}`}</span>
				) : null,
		},
		{
			header: 'Total gastado',
			cell: (p: User) =>
				p.customers ? <span>${p.customers.total_spent.toFixed(2)}</span> : null,
		},
		{
			header: 'Correo',
			cell: (p: User) => (p.persons?.email ? <span>{p.persons.email}</span> : null),
		},
		{
			header: 'Estado',
			cell: (p: User) => (
				<>
					<StateBadge state={p.state} />
				</>
			),
		},
	];

	return (
		<>
			<Title title="Clientes" />

			<div className="my-10">
				<Table
					columns={userColumns}
					rows={users}
					rowHrefs={users.map((user) => `/system/customers/${user.user_id}`)}
				/>
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
