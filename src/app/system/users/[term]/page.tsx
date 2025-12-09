import {
	getUserByTerm,
	searchDepartments,
	searchDocumentTypes,
	searchParties,
	searchPhoneTypes,
	searchRoles,
} from '@/actions';
import { searchCountries } from '@/actions/address/country-search';
import { Title } from '@/components';
import { User } from '@/interfaces';
import { UserForm } from './ui/UserForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function CategoryByTermPage({ params }: Props) {
	const { term } = await params;

	const [user, documentTypes, roles, parties, phoneTypes, departments, countries] =
		await Promise.all([
			getUserByTerm(term),
			searchDocumentTypes(''),
			searchRoles(''),
			searchParties(''),
			searchPhoneTypes(''),
			searchDepartments(''),
			searchCountries(''),
		]);

	const title = term === 'new' ? 'Nuevo usuario' : 'Editar usuario';

	return (
		<>
			<Title title={title} backUrl="/system/users" />

			<UserForm
				user={user.data || ({} as User)}
				documentTypes={documentTypes.data || []}
				roles={roles.data || []}
				parties={parties.data || []}
				phoneTypes={phoneTypes.data || []}
				departments={departments.data || []}
				countries={countries.data || []}
			/>
		</>
	);
}
