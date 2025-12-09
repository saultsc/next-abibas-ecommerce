import { CartContent } from './ui/CartContent';

export default function CartPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>
			<CartContent />
		</div>
	);
}
