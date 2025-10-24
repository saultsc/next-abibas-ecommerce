import { getProductByTerm } from '@/actions';
import { Title } from '@/components';
import { Product } from '@/interfaces';
import { ProductForm } from './ui/ProductForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function ProductPage({ params }: Props) {
	const { term } = await params;

	const [product, categories] = await Promise.all([getProductByTerm(term), []]);

	const title = term === 'new' ? 'Nuevo producto' : 'Editar producto';

	return (
		<>
			<Title title={title} backUrl="/system/products" />

			<ProductForm product={product ?? ({} as Product)} />
		</>
	);
}
