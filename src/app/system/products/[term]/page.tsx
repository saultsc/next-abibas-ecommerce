import { getProductByTerm, searchCategories, searchColors, searchSizes } from '@/actions';
import { Title } from '@/components';

import { ErrorCode } from '@/lib';
import { ProductForm } from './ui/ProductForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function ProductPage({ params }: Props) {
	const { term } = await params;

	const title = term === 'new' ? 'Nuevo producto' : 'Editar producto';

	const [categories, colors, sizes, product] = await Promise.all([
		searchCategories(''),
		searchColors(''),
		searchSizes(''),
		getProductByTerm(term),
	]);

	// TODO: Mejorar not found page y reutilizarla

	const { success, code, ...rest } = product;

	if (term !== 'new' && code === ErrorCode.PRODUCT_NOT_FOUND) {
		return (
			<>
				<Title title="Producto no encontrado" backUrl="/system/products" />
			</>
		);
	}

	return (
		<>
			<Title title={title} backUrl="/system/products" />

			<ProductForm
				product={rest.data ?? {}}
				categories={categories.data ?? []}
				colors={colors.data ?? []}
				sizes={sizes.data ?? []}
			/>
		</>
	);
}
