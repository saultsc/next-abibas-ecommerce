import { getColorByTerm } from '@/actions';
import { Title } from '@/components';
import { Color } from '@/interfaces';
import { ColorForm } from './ui/ColorForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function CategoryByTermPage({ params }: Props) {
	const { term } = await params;

	const { data: color } = await getColorByTerm(term);

	const title = term === 'new' ? 'Nuevo color' : 'Editar color';

	return (
		<>
			<Title title={title} backUrl="/system/colors" />

			<ColorForm color={color ?? ({} as Color)} />
		</>
	);
}
