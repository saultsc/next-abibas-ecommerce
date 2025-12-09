import { me } from '@/actions/auth/me';
import { ShopSidebar } from './ShopSidebar';

/**
 * Wrapper del servidor para ShopSidebar que obtiene el usuario actual
 */
export const ShopSidebarWrapper = async () => {
	const result = await me();
	const user = result.success ? result.data : null;

	return <ShopSidebar user={user} />;
};
