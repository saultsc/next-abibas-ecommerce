'use client';

import { createOrder } from '@/actions/orders/create-order';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CheckoutContentProps {
	addresses: any[];
}

export const CheckoutContent = ({ addresses }: CheckoutContentProps) => {
	const router = useRouter();
	const cart = useCartStore((state) => state.cart);
	const clearCart = useCartStore((state) => state.clearCart);
	const getSubtotal = useCartStore((state) => state.getSubtotal);
	const getTax = useCartStore((state) => state.getTax);
	const getTotal = useCartStore((state) => state.getTotal);

	const [selectedAddress, setSelectedAddress] = useState<number | null>(
		addresses.find((a) => a.is_primary)?.address_id || addresses[0]?.address_id || null
	);
	const [isProcessing, setIsProcessing] = useState(false);
	const [notes, setNotes] = useState('');

	const handleCheckout = async () => {
		if (!selectedAddress) {
			toast.error('Por favor selecciona una dirección de envío');
			return;
		}

		if (cart.length === 0) {
			toast.error('El carrito está vacío');
			return;
		}

		setIsProcessing(true);

		try {
			const result = await createOrder({
				shippingAddressId: selectedAddress,
				items: cart.map((item) => ({
					variantId: item.variantId,
					quantity: item.quantity,
					unitPrice: item.price,
				})),
				subtotal: getSubtotal(),
				taxAmount: getTax(),
				shippingCost: 0,
				discountAmount: 0,
				totalAmount: getTotal(),
				notes: notes || undefined,
			});

			if (!result.success) {
				toast.error(result.message || 'Error al crear la orden');
				return;
			}

			// Limpiar el carrito
			clearCart();
			toast.success('¡Orden creada exitosamente!');

			// Redirigir a la página de órdenes
			router.push(`/orders/${result.data!.order_id}`);
		} catch (error) {
			console.error('Error en checkout:', error);
			toast.error('Error al procesar la orden');
		} finally {
			setIsProcessing(false);
		}
	};

	if (cart.length === 0) {
		return (
			<div className="text-center py-20">
				<h2 className="text-2xl font-bold mb-4">El carrito está vacío</h2>
				<button
					onClick={() => router.push('/')}
					className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
					Ir a la tienda
				</button>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* Dirección de envío */}
			<div className="lg:col-span-2 space-y-6">
				{/* Productos */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-2xl font-bold mb-4">Productos</h2>
					<div className="space-y-4">
						{cart.map((item) => (
							<div
								key={item.variantId}
								className="flex gap-4 border-b pb-4 last:border-b-0">
								<div className="relative w-20 h-20 shrink-0">
									<Image
										src={item.imageUrl || '/imgs/placeholder.jpg'}
										alt={item.productName}
										fill
										className="object-cover rounded"
									/>
								</div>
								<div className="flex-1">
									<h3 className="font-semibold">{item.productName}</h3>
									<p className="text-sm text-gray-600">
										{item.sizeName} | {item.colorName}
									</p>
									<p className="text-sm">Cantidad: {item.quantity}</p>
								</div>
								<div className="text-right">
									<p className="font-bold">
										{currencyFormat(item.price * item.quantity)}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Dirección de envío */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-2xl font-bold mb-4">Dirección de Envío</h2>

					{addresses.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
							<button
								onClick={() => router.push('/profile/addresses')}
								className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
								Agregar dirección
							</button>
						</div>
					) : (
						<div className="space-y-3">
							{addresses.map((address) => (
								<div
									key={address.address_id}
									onClick={() => setSelectedAddress(address.address_id)}
									className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
										selectedAddress === address.address_id
											? 'border-blue-600 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'
									}`}>
									<div className="flex items-start justify-between">
										<div>
											<p className="font-semibold">{address.address_line1}</p>
											{address.address_line2 && (
												<p className="text-gray-600">
													{address.address_line2}
												</p>
											)}
											<p className="text-gray-600">
												{address.cities?.city_name},{' '}
												{
													address.cities?.province_states
														?.province_state_name
												}
											</p>
											<p className="text-gray-600">{address.postal_code}</p>
										</div>
										{address.is_primary && (
											<span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
												Principal
											</span>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Notas */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-bold mb-4">Notas del pedido (opcional)</h2>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Agrega cualquier instrucción especial para tu pedido"
						className="w-full border rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-600"
						maxLength={500}
					/>
					<p className="text-sm text-gray-500 mt-2">{notes.length}/500 caracteres</p>
				</div>
			</div>

			{/* Resumen */}
			<div className="lg:col-span-1">
				<div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
					<h2 className="text-2xl font-bold mb-6">Resumen</h2>

					<div className="space-y-3 mb-6">
						<div className="flex justify-between text-gray-700">
							<span>Subtotal:</span>
							<span>{currencyFormat(getSubtotal())}</span>
						</div>
						<div className="flex justify-between text-gray-700">
							<span>Impuestos (15%):</span>
							<span>{currencyFormat(getTax())}</span>
						</div>
						<div className="flex justify-between text-gray-700">
							<span>Envío:</span>
							<span className="text-green-600">GRATIS</span>
						</div>
						<div className="border-t pt-3 flex justify-between text-xl font-bold">
							<span>Total:</span>
							<span className="text-blue-600">{currencyFormat(getTotal())}</span>
						</div>
					</div>

					<button
						onClick={handleCheckout}
						disabled={isProcessing || !selectedAddress}
						className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
						{isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
					</button>

					<button
						onClick={() => router.push('/cart')}
						className="w-full mt-3 text-blue-600 hover:text-blue-700 font-medium">
						Volver al carrito
					</button>
				</div>
			</div>
		</div>
	);
};
