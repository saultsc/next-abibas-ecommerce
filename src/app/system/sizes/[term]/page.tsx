import { getSizeByTerm } from '@/actions';
import { Title } from '@/components';
import { Size } from '@/interfaces';
import { SizeForm } from './ui/SizeForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function CategoryByTermPage({ params }: Props) {
	const { term } = await params;

	const { data: size } = await getSizeByTerm(term);

	const title = term === 'new' ? 'Nuevo tamaño' : 'Editar tamaño';

	return (
		<>
			<Title title={title} backUrl="/system/sizes" />

			<SizeForm size={size ?? ({} as Size)} />
		</>
	);
}
