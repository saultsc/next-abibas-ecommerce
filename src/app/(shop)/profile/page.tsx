import { getMyAddresses } from '@/actions/address/get-my-addresses';
import { me } from '@/actions/auth/me';
import { redirect } from 'next/navigation';
import { ProfileContent } from './ui/ProfileContent';

export default async function ProfilePage() {
	// Verificar que el usuario esté logueado
	const userResult = await me();
	if (!userResult.success) {
		redirect('/auth/login?redirect=/profile');
	}

	// Obtener las direcciones del usuario
	const addressesResult = await getMyAddresses();
	const addresses = addressesResult.success ? addressesResult.data : [];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>
			<ProfileContent user={userResult.data!} addresses={addresses || []} />
		</div>
	);
}
