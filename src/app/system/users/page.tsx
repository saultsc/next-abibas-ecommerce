export const revalidate = 0;

import { getPaginatedUsers } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { User } from '@/interfaces';
import { dateFormat } from '@/utils';

import Link from 'next/link';
import { IoAddCircleOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}
export default async function EmployeesPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: users = [], totalPages = 0 } = await getPaginatedUsers({ page, limit: 10 });

	const userColumns: Column<User>[] = [
		{
			header: 'Usuario',
			cell: (p: User) => (
				<Link href={`/system/users/${p.user_id}`} className="hover:underline">
					{p.username}
				</Link>
			),
		},
		{
			header: 'Nombre',
			cell: (p: User) =>
				p.roles ? <span>{`${p.persons?.first_name} ${p.persons?.last_name}`}</span> : null,
		},
		{
			header: 'Departamento',
			cell: (p: User) =>
				p.employees?.departments ? (
					<span>{p.employees?.departments?.department_name}</span>
				) : null,
		},
		{
			header: 'Rol',
			cell: (p: User) => (p.roles ? <span>{p.roles.role_name}</span> : null),
		},
		{
			header: 'Correo',
			cell: (p: User) => (p.persons?.email ? <span>{p.persons.email}</span> : null),
		},
		{
			header: 'Fecha de contratación',
			cell: (p: User) =>
				p.employees?.hire_date ? (
					<span className="flex items-center gap-2 text-gray-600 text-sm">
						{dateFormat(p.employees.hire_date)}
					</span>
				) : null,
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
			<Title title="Usuarios" />

			<div className="flex justify-end mb-5">
				<Link href="users/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table
					columns={userColumns}
					rows={users}
					rowHrefs={users.map((user) => `/system/users/${user.user_id}`)}
				/>
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
