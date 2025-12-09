export const revalidate = 0;

import { getPaginatedSuppliers } from '@/actions';
import { Column, Pagination, StateBadge, Table, Title } from '@/components';
import { Supplier } from '@/interfaces';

import Link from 'next/link';
import { IoAddCircleOutline } from 'react-icons/io5';

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function SuppliersPage({ searchParams }: Props) {
	const resolved = await searchParams;

	const page = resolved?.page ? parseInt(resolved.page) : 1;

	const { data: suppliers = [], totalPages = 0 } = await getPaginatedSuppliers({
		page,
		limit: 10,
	});

	const supplierColumns: Column<Supplier>[] = [
		{
			header: 'Empresa',
			cell: (s: Supplier) => (
				<span className="font-medium">
					{s.company_name ||
						(s.persons ? `${s.persons.first_name} ${s.persons.last_name}` : null)}
				</span>
			),
		},
		{
			header: 'Tipo de Documento',
			cell: (s: Supplier) =>
				s.persons?.document_types?.type_name ? (
					<span>{s.persons.document_types.type_name}</span>
				) : null,
		},
		{
			header: 'Documento',
			cell: (s: Supplier) =>
				s.persons?.document_number ? <span>{s.persons.document_number}</span> : null,
		},
		{
			header: 'Contacto',
			cell: (s: Supplier) =>
				s.persons ? <span>{`${s.persons.first_name} ${s.persons.last_name}`}</span> : null,
		},
		{
			header: 'Teléfono',
			cell: (s: Supplier) =>
				s.persons?.phones?.[0]?.phone_number ? (
					<span>{s.persons.phones[0].phone_number}</span>
				) : null,
		},
		{
			header: 'Estado',
			cell: (s: Supplier) => <StateBadge state={s.state} />,
		},
	];

	return (
		<>
			<Title title="Suplidores" />

			<div className="flex justify-end mb-5">
				<Link href="suppliers/new" className="btn-primary flex items-center gap-2">
					<IoAddCircleOutline className="text-xl" />
					Nuevo
				</Link>
			</div>

			<div className="mb-10">
				<Table
					columns={supplierColumns}
					rows={suppliers}
					rowHrefs={suppliers.map(
						(supplier) => `/system/suppliers/${supplier.supplier_id}`
					)}
				/>
				{totalPages > 0 && <Pagination totalPages={totalPages} />}
			</div>
		</>
	);
}
