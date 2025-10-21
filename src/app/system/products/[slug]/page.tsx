import { Title } from '@/components';
import { ProductForm } from './ui/ProductForm';

interface Props {
	params: Promise<{
		slug: string;
	}>;
}

//

export default async function ProductPage({ params }: Props) {
	const { slug } = await params;

	const [product, categories] = await Promise.all([{} as any, [] as any]);

	const title = slug === 'new' ? 'Nuevo producto' : 'Editar producto';

	return (
		<>
			<Title title={title} backUrl="/system/products" />

			<ProductForm product={product ?? {}} categories={categories} />
		</>
	);
}
