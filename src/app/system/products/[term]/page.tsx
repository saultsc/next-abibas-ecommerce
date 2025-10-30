import { getProductByTerm, searchCategories, searchColors, searchSizes } from '@/actions';
import { Title } from '@/components';
import { Product, Response } from '@/interfaces';
import { ProductForm } from './ui/ProductForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function ProductPage({ params }: Props) {
	const { term } = await params;

	const title = term === 'new' ? 'Nuevo producto' : 'Editar producto';

	const productPromise =
		term === 'new' ? getProductByTerm(term) : Promise.resolve({} as Response<Product>);

	const [categories, colors, sizes, product] = await Promise.all([
		searchCategories(''),
		searchColors(''),
		searchSizes(''),
		productPromise,
	]);

	return (
		<>
			<Title title={title} backUrl="/system/products" />

			<ProductForm
				product={product.data ?? {}}
				categories={categories.data ?? []}
				colors={colors.data ?? []}
				sizes={sizes.data ?? []}
			/>
		</>
	);
}
