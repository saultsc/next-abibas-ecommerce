import { getCustomerByTerm, searchParties, searchPhoneTypes } from '@/actions';

import { Title } from '@/components';

import { User } from '@/interfaces';
import { CustomerForm } from './ui/CustomerForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function CategoryByTermPage({ params }: Props) {
	const { term } = await params;

	const [customer, parties, phoneTypes] = await Promise.all([
		getCustomerByTerm(term),
		searchParties(''),
		searchPhoneTypes(''),
	]);

	const title = term === 'new' ? 'Nuevo usuario' : 'Editar usuario';

	return (
		<>
			<Title title={title} backUrl="/system/customers" />

			<CustomerForm
				user={customer.data ?? ({} as User)}
				parties={parties.data ?? []}
				phoneTypes={phoneTypes.data ?? []}
			/>
		</>
	);
}
