import { getCategoryByTerm } from '@/actions';
import { Title } from '@/components';
import { Category } from '@/interfaces';
import { CategoryForm } from './ui/CategoryForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function CategoryByTermPage({ params }: Props) {
	const { term } = await params;

	const { data: category } = await getCategoryByTerm(term);

	const title = term === 'new' ? 'Nueva categoria' : 'Editar categoria';

	return (
		<>
			<Title title={title} backUrl="/system/categories" />

			<CategoryForm category={category ?? ({} as Category)} />
		</>
	);
}
