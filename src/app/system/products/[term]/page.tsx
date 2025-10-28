import { getProductByTerm, searchCategories } from '@/actions';
import { Title } from '@/components';
import { ProductForm } from './ui/ProductForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function ProductPage({ params }: Props) {
	const { term } = await params;

	const [product, { data: categories }] = await Promise.all([
		getProductByTerm(term),
		searchCategories(''),
	]);

	const title = term === 'new' ? 'Nuevo producto' : 'Editar producto';

	return (
		<>
			<Title title={title} backUrl="/system/products" />

			<ProductForm product={product.data ?? {}} categories={categories ?? []} />
		</>
	);
}
