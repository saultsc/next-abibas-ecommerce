import { ProductGrid, Title } from '@/components';
import { initialData } from '@/seed/seed';

const products = initialData.products;

export default function HomePage() {
	return (
		<>
			<Title title="Catalogo" subTitle="Todos los productos" clssName="mb-2" />

			<ProductGrid products={products} />
		</>
	);
}
