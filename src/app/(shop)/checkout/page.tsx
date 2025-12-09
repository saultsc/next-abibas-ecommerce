import { getMyAddresses } from '@/actions/address/get-my-addresses';
import { me } from '@/actions/auth/me';
import { redirect } from 'next/navigation';
import { CheckoutContent } from './ui/CheckoutContent';

export default async function CheckoutPage() {
	// Verificar que el usuario esté logueado
	const userResult = await me();
	if (!userResult.success) {
		redirect('/auth/login?redirect=/checkout');
	}

	// Obtener las direcciones del usuario
	const addressesResult = await getMyAddresses();
	const addresses = addressesResult.success ? addressesResult.data : [];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">Checkout</h1>
			<CheckoutContent addresses={addresses || []} />
		</div>
	);
}
