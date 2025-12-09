import { me } from '@/actions/auth/me';
import { getMyOrders } from '@/actions/orders/get-my-orders';
import { redirect } from 'next/navigation';
import { OrdersList } from './ui/OrdersList';

export default async function OrdersPage() {
	// Verificar que el usuario esté logueado
	const userResult = await me();
	if (!userResult.success) {
		redirect('/auth/login?redirect=/orders');
	}

	// Obtener las órdenes del usuario
	const ordersResult = await getMyOrders();
	const orders = ordersResult.success ? ordersResult.data : [];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">Mis Órdenes</h1>
			<OrdersList orders={orders || []} />
		</div>
	);
}
