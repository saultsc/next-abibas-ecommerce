'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BiCategory as Category } from 'react-icons/bi';
import {
	IoCloseOutline,
	IoLogInOutline,
	IoLogOutOutline,
	IoPeopleOutline,
	IoPersonOutline,
	IoSearchOutline,
	IoShirtOutline,
	IoTicketOutline,
} from 'react-icons/io5';

import { User } from '@/interfaces';
import { useUiStore } from '@/store';
import { isAdminRoute } from '@/utils';
import { CiShoppingBasket } from 'react-icons/ci';
import { IoIosColorFilter } from 'react-icons/io';
import { MdOutlineFormatSize } from 'react-icons/md';

interface MenuItem {
	href: string;
	icon: React.ElementType;
	label: string;
}

interface Props {
	user: User | null;
}

const adminMenuItems: MenuItem[] = [
	{ href: '/system/products', icon: IoShirtOutline, label: 'Productos' },
	{ href: '/system/orders', icon: IoTicketOutline, label: 'Ordenes' },
	{ href: '/system/users', icon: IoPeopleOutline, label: 'Usuarios' },
	{ href: '/system/categories', icon: Category, label: 'Categorias' },
	{ href: '/system/sizes', icon: MdOutlineFormatSize, label: 'Tallas' },
	{ href: '/system/colors', icon: IoIosColorFilter, label: 'Colores' },
];

const userMenuItems: MenuItem[] = [
	{ href: '/profile', icon: IoPersonOutline, label: 'Perfil' },
	{ href: '/orders', icon: IoTicketOutline, label: 'Ordenes' },
	{ href: '/auth/login', icon: IoLogInOutline, label: 'Ingresar' },
	{ href: '/', icon: IoLogOutOutline, label: 'Salir' },
];

export const ShopSidebar = ({ user }: Props) => {
	const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen);
	const closeMenu = useUiStore((state) => state.closeSideMenu);

	const pathname = usePathname();

	// Verificar si el usuario NO es cliente ni customer (puede acceder a administrador)
	const roleName = user?.roles?.role_name?.toLowerCase();
	const canAccessAdmin = user && roleName && roleName !== 'cliente' && roleName !== 'customer';

	// Filtrar los items del menú de usuario según si hay sesión o no
	const filteredUserMenuItems = userMenuItems.filter((item) => {
		// Si hay usuario logueado, NO mostrar "Ingresar"
		if (user && item.label === 'Ingresar') return false;
		// Si NO hay usuario logueado, NO mostrar "Salir"
		if (!user && item.label === 'Salir') return false;
		return true;
	});

	return (
		<div>
			{/* Background */}
			{isSideMenuOpen && (
				<div className="fixed top-0 w-screen h-screen z-10 bg-black opacity-30" />
			)}

			{/* Blur */}
			{isSideMenuOpen && (
				<div
					onClick={() => closeMenu()}
					className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
				/>
			)}

			{/* Sidemenu */}
			<nav
				className={clsx(
					'fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
					{
						'translate-x-full': !isSideMenuOpen,
					}
				)}>
				<IoCloseOutline
					size={50}
					className="absolute top-5 right-5 cursor-pointer"
					onClick={() => closeMenu()}
				/>

				{/* Input */}
				<div className="relative mt-14">
					<IoSearchOutline size={20} className="absolute top-2 left-2" />
					<input
						type="text"
						placeholder="Buscar"
						className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
					/>
				</div>

				{/* User Menu */}
				{isAdminRoute(pathname) ? (
					<Link
						href="/"
						onClick={() => closeMenu()}
						className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
						<CiShoppingBasket size={25} />
						<span className="ml-3 text-xl">Catalogo</span>
					</Link>
				) : (
					filteredUserMenuItems.map((item) => {
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => closeMenu()}
								className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
								<Icon size={25} />
								<span className="ml-3 text-xl">{item.label}</span>
							</Link>
						);
					})
				)}

				{/* Admin Menu */}
				{isAdminRoute(pathname)
					? adminMenuItems.map((item) => {
							{
								/* Line Separator */
							}
							<div className="w-full h-px bg-gray-200 my-10" />;

							const Icon = item.icon;
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => closeMenu()}
									className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
									<Icon size={25} />
									<span className="ml-3 text-xl">{item.label}</span>
								</Link>
							);
					  })
					: canAccessAdmin && (
							<Link
								href="/system/dashboard"
								onClick={() => closeMenu()}
								className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
								<IoPeopleOutline size={25} />
								<span className="ml-3 text-xl">Administrador</span>
							</Link>
					  )}
			</nav>
		</div>
	);
};
