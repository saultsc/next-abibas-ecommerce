import { SeedProduct } from '@/seed/seed';
import { ProductGridItem } from './ProductGridItem';

interface Props {
	products: SeedProduct[];
}

export const ProductGrid = ({ products }: Props) => {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
			{products.map((p) => (
				<ProductGridItem key={p.slug} product={p} />
			))}
		</div>
	);
};
