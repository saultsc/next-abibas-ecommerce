'use client';

import { currencyFormat, dateFormat } from '@/utils';
import Link from 'next/link';

interface OrdersListProps {
	orders: any[];
}

export const OrdersList = ({ orders }: OrdersListProps) => {
	if (orders.length === 0) {
		return (
			<div className="text-center py-20 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes órdenes todavía</h2>
				<p className="text-gray-600 mb-8">¡Comienza a explorar nuestros productos!</p>
				<Link
					href="/"
					className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
					Ir a la tienda
				</Link>
			</div>
		);
	}

	const getStatusColor = (statusName: string) => {
		const status = statusName.toLowerCase();
		if (status.includes('pendiente') || status.includes('pending')) {
			return 'bg-yellow-100 text-yellow-800';
		}
		if (status.includes('proceso') || status.includes('processing')) {
			return 'bg-blue-100 text-blue-800';
		}
		if (status.includes('enviado') || status.includes('shipped')) {
			return 'bg-purple-100 text-purple-800';
		}
		if (status.includes('entregado') || status.includes('delivered')) {
			return 'bg-green-100 text-green-800';
		}
		if (status.includes('cancelado') || status.includes('cancelled')) {
			return 'bg-red-100 text-red-800';
		}
		return 'bg-gray-100 text-gray-800';
	};

	return (
		<div className="space-y-4">
			{orders.map((order) => (
				<Link
					key={order.order_id}
					href={`/orders/${order.order_id}`}
					className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						{/* Información de la orden */}
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h3 className="font-bold text-lg">#{order.order_number}</h3>
								<span
									className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
										order.order_statuses?.status_name || ''
									)}`}>
									{order.order_statuses?.status_name || 'Desconocido'}
								</span>
							</div>
							<p className="text-sm text-gray-600">
								Fecha: {dateFormat(order.created_at)}
							</p>
							<p className="text-sm text-gray-600">
								{order.order_items?.length || 0} producto(s)
							</p>
						</div>

						{/* Monto total */}
						<div className="text-right">
							<p className="text-sm text-gray-600 mb-1">Total</p>
							<p className="text-2xl font-bold text-blue-600">
								{currencyFormat(Number(order.total_amount))}
							</p>
						</div>
					</div>

					{/* Dirección de envío (preview) */}
					{order.addresses && (
						<div className="mt-4 pt-4 border-t text-sm text-gray-600">
							<p className="font-semibold">Dirección de envío:</p>
							<p>
								{order.addresses.address_line1}, {order.addresses.cities?.city_name}
							</p>
						</div>
					)}
				</Link>
			))}
		</div>
	);
};
