'use client';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { IoAddOutline, IoRemoveOutline, IoTrashOutline } from 'react-icons/io5';

export const CartContent = () => {
	const cart = useCartStore((state) => state.cart);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const removeFromCart = useCartStore((state) => state.removeFromCart);
	const getSubtotal = useCartStore((state) => state.getSubtotal);
	const getTax = useCartStore((state) => state.getTax);
	const getTotal = useCartStore((state) => state.getTotal);

	if (cart.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
				<p className="text-gray-600 mb-8">¡Agrega productos para comenzar a comprar!</p>
				<Link
					href="/"
					className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
					Ir a la tienda
				</Link>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* Lista de productos */}
			<div className="lg:col-span-2 space-y-4">
				{cart.map((item) => (
					<div
						key={item.variantId}
						className="bg-white rounded-lg shadow-md p-4 flex gap-4">
						{/* Imagen */}
						<div className="relative w-24 h-24 shrink-0">
							<Image
								src={item.imageUrl || '/imgs/placeholder.jpg'}
								alt={item.productName}
								fill
								className="object-cover rounded-md"
							/>
						</div>

						{/* Información del producto */}
						<div className="flex-1">
							<h3 className="font-semibold text-lg">{item.productName}</h3>
							<p className="text-sm text-gray-600">
								Talla: {item.sizeName} | Color: {item.colorName}
							</p>
							<p className="text-sm text-gray-500">SKU: {item.variantSku}</p>
							<p className="font-bold text-blue-600 mt-2">
								{currencyFormat(item.price)}
							</p>
						</div>

						{/* Controles de cantidad */}
						<div className="flex flex-col items-end justify-between">
							<button
								onClick={() => removeFromCart(item.variantId)}
								className="text-red-500 hover:text-red-700 transition-colors">
								<IoTrashOutline size={24} />
							</button>

							<div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
								<button
									onClick={() =>
										updateQuantity(item.variantId, item.quantity - 1)
									}
									disabled={item.quantity <= 1}
									className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed">
									<IoRemoveOutline size={20} />
								</button>
								<span className="w-8 text-center font-semibold">
									{item.quantity}
								</span>
								<button
									onClick={() =>
										updateQuantity(item.variantId, item.quantity + 1)
									}
									disabled={item.quantity >= item.stock}
									className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed">
									<IoAddOutline size={20} />
								</button>
							</div>

							<p className="font-bold text-lg">
								{currencyFormat(item.price * item.quantity)}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Resumen del pedido */}
			<div className="lg:col-span-1">
				<div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
					<h2 className="text-2xl font-bold mb-6">Resumen del pedido</h2>

					<div className="space-y-3 mb-6">
						<div className="flex justify-between text-gray-700">
							<span>Subtotal:</span>
							<span>{currencyFormat(getSubtotal())}</span>
						</div>
						<div className="flex justify-between text-gray-700">
							<span>Impuestos (15%):</span>
							<span>{currencyFormat(getTax())}</span>
						</div>
						<div className="border-t pt-3 flex justify-between text-xl font-bold">
							<span>Total:</span>
							<span className="text-blue-600">{currencyFormat(getTotal())}</span>
						</div>
					</div>

					<Link
						href="/checkout"
						className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
						Proceder al checkout
					</Link>

					<Link
						href="/"
						className="block w-full text-center mt-3 text-blue-600 hover:text-blue-700 font-medium">
						Continuar comprando
					</Link>
				</div>
			</div>
		</div>
	);
};
