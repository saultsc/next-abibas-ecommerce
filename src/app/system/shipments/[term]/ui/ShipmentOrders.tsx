'use client';

import { Dialog, IconButton } from '@mui/material';
import { useState } from 'react';
import {
	IoAddCircle,
	IoCashOutline,
	IoCubeOutline,
	IoLocationOutline,
	IoPersonOutline,
	IoTrashOutline,
} from 'react-icons/io5';
import { toast } from 'sonner';

interface Order {
	order_id: number;
	order_number: string;
	customer_name: string;
	shipping_address: string;
	total_amount: number;
	order_status: string;
	estimated_delivery_date: Date;
	sequence: number;
}

interface ShipmentOrdersProps {
	shipmentId: number;
}

// Mock data para órdenes disponibles
const mockAvailableOrders = [
	{
		order_id: 1,
		order_number: 'ORD-2024-001',
		customer_name: 'Juan Pérez',
		shipping_address: 'Av. Principal 123, Ciudad',
		total_amount: 1250.5,
		order_status: 'Listo para envío',
		estimated_delivery_date: new Date('2024-01-16'),
	},
	{
		order_id: 2,
		order_number: 'ORD-2024-002',
		customer_name: 'María González',
		shipping_address: 'Calle Secundaria 456, Ciudad',
		total_amount: 890.0,
		order_status: 'Listo para envío',
		estimated_delivery_date: new Date('2024-01-16'),
	},
	{
		order_id: 3,
		order_number: 'ORD-2024-003',
		customer_name: 'Carlos Rodríguez',
		shipping_address: 'Av. Norte 789, Ciudad',
		total_amount: 2350.75,
		order_status: 'Listo para envío',
		estimated_delivery_date: new Date('2024-01-17'),
	},
	{
		order_id: 4,
		order_number: 'ORD-2024-004',
		customer_name: 'Ana Martínez',
		shipping_address: 'Calle Sur 321, Ciudad',
		total_amount: 450.25,
		order_status: 'Listo para envío',
		estimated_delivery_date: new Date('2024-01-17'),
	},
	{
		order_id: 5,
		order_number: 'ORD-2024-005',
		customer_name: 'Pedro López',
		shipping_address: 'Av. Este 654, Ciudad',
		total_amount: 1680.0,
		order_status: 'Listo para envío',
		estimated_delivery_date: new Date('2024-01-18'),
	},
];

export function ShipmentOrders({ shipmentId }: ShipmentOrdersProps) {
	// Mock data para órdenes del envío
	const [orders, setOrders] = useState<Order[]>([
		{
			order_id: 1,
			order_number: 'ORD-2024-001',
			customer_name: 'Juan Pérez',
			shipping_address: 'Av. Principal 123, Ciudad',
			total_amount: 1250.5,
			order_status: 'Listo para envío',
			estimated_delivery_date: new Date('2024-01-16'),
			sequence: 1,
		},
		{
			order_id: 2,
			order_number: 'ORD-2024-002',
			customer_name: 'María González',
			shipping_address: 'Calle Secundaria 456, Ciudad',
			total_amount: 890.0,
			order_status: 'Listo para envío',
			estimated_delivery_date: new Date('2024-01-16'),
			sequence: 2,
		},
		{
			order_id: 3,
			order_number: 'ORD-2024-003',
			customer_name: 'Carlos Rodríguez',
			shipping_address: 'Av. Norte 789, Ciudad',
			total_amount: 2350.75,
			order_status: 'Listo para envío',
			estimated_delivery_date: new Date('2024-01-17'),
			sequence: 3,
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<string>('');

	const handleAddOrder = () => {
		if (!selectedOrder) {
			toast.error('Por favor selecciona una orden');
			return;
		}

		const orderToAdd = mockAvailableOrders.find((o) => o.order_id.toString() === selectedOrder);

		if (!orderToAdd) {
			toast.error('Orden no encontrada');
			return;
		}

		// Verificar si la orden ya está agregada
		if (orders.some((o) => o.order_id === orderToAdd.order_id)) {
			toast.error('Esta orden ya está agregada al envío');
			return;
		}

		const newOrder: Order = {
			...orderToAdd,
			sequence: orders.length + 1,
		};

		setOrders([...orders, newOrder]);
		setSelectedOrder('');
		setIsModalOpen(false);
		toast.success('Orden agregada al envío');
	};

	const handleRemoveOrder = (orderId: number) => {
		setOrders(orders.filter((o) => o.order_id !== orderId));
		toast.success('Orden removida del envío');
	};

	const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);

	return (
		<>
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex justify-between items-center mb-4">
					<div>
						<h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
							<IoCubeOutline className="text-2xl text-blue-600" />
							Órdenes del Envío
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							{orders.length} {orders.length === 1 ? 'orden' : 'órdenes'} en este
							envío
						</p>
					</div>
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg">
						<IoAddCircle className="text-xl" />
						<span>Agregar Orden</span>
					</button>
				</div>

				{orders.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						<IoCubeOutline className="text-6xl mx-auto mb-3 text-gray-300" />
						<p className="text-lg font-medium">No hay órdenes en este envío</p>
						<p className="text-sm mt-1">Haz clic en "Agregar Orden" para comenzar</p>
					</div>
				) : (
					<>
						<div className="space-y-3">
							{orders.map((order, index) => (
								<div
									key={order.order_id}
									className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-gray-50">
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<div className="flex items-start gap-3">
												<div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
													{index + 1}
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<h3 className="font-semibold text-gray-800">
															{order.order_number}
														</h3>
														<span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
															{order.order_status}
														</span>
													</div>

													<div className="grid grid-cols-2 gap-3 text-sm">
														<div className="flex items-center gap-2 text-gray-600">
															<IoPersonOutline className="text-base flex-shrink-0" />
															<span
																className="truncate"
																title={order.customer_name}>
																{order.customer_name}
															</span>
														</div>
														<div className="flex items-center gap-2 text-gray-600">
															<IoCashOutline className="text-base flex-shrink-0" />
															<span className="font-semibold">
																${order.total_amount.toFixed(2)}
															</span>
														</div>
														<div className="col-span-2 flex items-start gap-2 text-gray-600">
															<IoLocationOutline className="text-base flex-shrink-0 mt-0.5" />
															<span
																className="truncate"
																title={order.shipping_address}>
																{order.shipping_address}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveOrder(order.order_id);
											}}
											className="ml-3 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
											title="Remover orden">
											<IoTrashOutline className="text-xl" />
										</button>
									</div>
								</div>
							))}
						</div>

						{/* Total */}
						<div className="mt-6 pt-4 border-t border-gray-300">
							<div className="flex justify-between items-center">
								<span className="text-lg font-semibold text-gray-700">
									Total del Envío:
								</span>
								<span className="text-2xl font-bold text-blue-600">
									${totalAmount.toFixed(2)}
								</span>
							</div>
						</div>
					</>
				)}
			</div>

			{/* Modal para agregar orden */}
			<Dialog
				open={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedOrder('');
				}}
				maxWidth="sm"
				fullWidth>
				<div className="p-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-xl font-semibold text-gray-800">
							Agregar Orden al Envío
						</h3>
						<IconButton
							onClick={() => {
								setIsModalOpen(false);
								setSelectedOrder('');
							}}
							size="small">
							✕
						</IconButton>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Selecciona una orden disponible
							</label>
							<select
								value={selectedOrder}
								onChange={(e) => setSelectedOrder(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">-- Selecciona una orden --</option>
								{mockAvailableOrders
									.filter(
										(o) => !orders.some((ord) => ord.order_id === o.order_id)
									)
									.map((order) => (
										<option key={order.order_id} value={order.order_id}>
											{order.order_number} - {order.customer_name} ($
											{order.total_amount.toFixed(2)})
										</option>
									))}
							</select>
						</div>

						{selectedOrder && (
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<h4 className="font-semibold text-gray-800 mb-2">
									Detalles de la Orden
								</h4>
								{(() => {
									const order = mockAvailableOrders.find(
										(o) => o.order_id.toString() === selectedOrder
									);
									return order ? (
										<div className="space-y-1 text-sm text-gray-700">
											<p>
												<span className="font-medium">Cliente:</span>{' '}
												{order.customer_name}
											</p>
											<p>
												<span className="font-medium">Dirección:</span>{' '}
												{order.shipping_address}
											</p>
											<p>
												<span className="font-medium">Total:</span> $
												{order.total_amount.toFixed(2)}
											</p>
											<p>
												<span className="font-medium">Estado:</span>{' '}
												{order.order_status}
											</p>
										</div>
									) : null;
								})()}
							</div>
						)}

						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={handleAddOrder}
								className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium">
								Agregar Orden
							</button>
							<button
								type="button"
								onClick={() => {
									setIsModalOpen(false);
									setSelectedOrder('');
								}}
								className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium">
								Cancelar
							</button>
						</div>
					</div>
				</div>
			</Dialog>
		</>
	);
}
