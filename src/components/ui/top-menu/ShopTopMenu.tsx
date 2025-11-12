'use client';

import Link from 'next/link';

import { titleFonts } from '@/config/fonts';
import { useUiStore } from '@/store';
import { isAdminRoute } from '@/utils';
import { usePathname } from 'next/navigation';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';

export const ShopTopMenu = () => {
	const pathname = usePathname();

	const openMenu = useUiStore((store) => store.openSideMenu);

	return (
		<nav className="flex px-5 justify-between items-center w-full">
			{/* Logo */}
			<div>
				<Link href={isAdminRoute(pathname) ? '/system/dashboard' : '/'}>
					<span className={`${titleFonts.className} antialiased font-bold`}>Abibas</span>
					<span> | Tienda virtual</span>
				</Link>
			</div>

			{/* Center Menu */}
			{!isAdminRoute(pathname) && (
				<div className={`font-semibold`}>
					<Link
						className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
						href={'/category/men'}>
						Hombres
					</Link>
					<Link
						className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
						href={'/category/women'}>
						Mujeres
					</Link>
					<Link
						className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
						href={'/category/kid'}>
						Niños
					</Link>
				</div>
			)}

			{/* Search, Cart, Menu */}
			<div className="flex items-center">
				{!isAdminRoute(pathname) && (
					<>
						<Link className="mx-2" href={'/search'}>
							<IoSearchOutline className="size-5" />
						</Link>

						<Link className="mx-2" href={'/cart'}>
							<div className="relative">
								<span className="absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white ">
									3
								</span>
								<IoCartOutline className="size-5" />
							</div>
						</Link>
					</>
				)}

				<button
					className="m-2 rounded-md transition-all hover:bg-gray-100"
					onClick={() => openMenu()}>
					Menu
				</button>
			</div>
		</nav>
	);
};
