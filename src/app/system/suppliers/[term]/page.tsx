import { getSupplierByTerm, searchDocumentTypes, searchParties, searchPhoneTypes } from '@/actions';
import { Title } from '@/components';
import { Supplier } from '@/interfaces';

import { SupplierForm } from './ui/SupplierForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function SupplierByTermPage({ params }: Props) {
	const { term } = await params;

	const [supplier, documentTypes, parties, phoneTypes] = await Promise.all([
		getSupplierByTerm(term),
		searchDocumentTypes(''),
		searchParties(''),
		searchPhoneTypes(''),
	]);

	const title = term === 'new' ? 'Nuevo suplidor' : 'Editar suplidor';

	return (
		<>
			<Title title={title} backUrl="/system/suppliers" />

			<SupplierForm
				supplier={supplier.data || ({} as Supplier)}
				documentTypes={documentTypes.data || []}
				parties={parties.data || []}
				phoneTypes={phoneTypes.data || []}
			/>
		</>
	);
}
