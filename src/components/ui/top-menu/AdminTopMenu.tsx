'use client';

import { titleFonts } from '@/config/fonts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	IoChevronForwardOutline,
	IoNotificationsOutline,
	IoPersonCircleOutline,
} from 'react-icons/io5';

export const AdminTopMenu = () => {
	const pathname = usePathname();

	// Generar breadcrumbs desde la ruta
	const generateBreadcrumbs = () => {
		// Filtrar la ruta "system" o "sistema" antes de procesar
		const paths = pathname
			.split('/')
			.filter((path) => path && path !== 'system' && path !== 'sistema');
		const breadcrumbs = [];

		// Mapeo de rutas a nombres amigables
		const routeNames: Record<string, string> = {
			dashboard: 'Dashboard',
			products: 'Productos',
			categories: 'Categorías',
			sizes: 'Tallas',
			colors: 'Colores',
			orders: 'Órdenes',
			customers: 'Clientes',
			suppliers: 'Proveedores',
			vehicle: 'Vehículos',
			'vehicle-status': 'Estados del Vehículo',
			'vehicle-types': 'Tipos de Vehículos',
			users: 'Usuarios',
			employees: 'Empleados',
			roles: 'Roles',
			new: 'Nuevo',
			edit: 'Editar',
		};

		let currentPath = '';
		const originalPaths = pathname.split('/').filter(Boolean);
		let pathIndex = 0;

		for (let i = 0; i < paths.length; i++) {
			while (pathIndex < originalPaths.length && originalPaths[pathIndex] !== paths[i]) {
				currentPath += `/${originalPaths[pathIndex]}`;
				pathIndex++;
			}
			currentPath += `/${paths[i]}`;
			pathIndex++;

			const name = routeNames[paths[i]] || paths[i];
			breadcrumbs.push({ name, path: currentPath });
		}

		return breadcrumbs;
	};

	const breadcrumbs = generateBreadcrumbs();

	return (
		<header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 shadow-sm">
			<div className="h-full flex items-center justify-between px-6">
				{/* Left Section - Logo & Breadcrumbs */}
				<div className="flex items-center gap-6">
					{/* Logo */}
					<Link href="/system/dashboard" className="flex items-center gap-2">
						<span
							className={`${titleFonts.className} text-2xl font-bold text-blue-600`}>
							Abibas
						</span>
						<span className="text-xs text-gray-500 font-semibold uppercase">Admin</span>
					</Link>

					{/* Breadcrumbs */}
					<nav className="hidden md:flex items-center gap-2 text-sm">
						{breadcrumbs.map((crumb, index) => (
							<div key={crumb.path} className="flex items-center gap-2">
								{index > 0 && (
									<IoChevronForwardOutline className="text-gray-400" size={14} />
								)}
								<Link
									href={crumb.path}
									className={`hover:text-blue-600 transition-colors ${
										index === breadcrumbs.length - 1
											? 'text-gray-900 font-semibold'
											: 'text-gray-500'
									}`}>
									{crumb.name}
								</Link>
							</div>
						))}
					</nav>
				</div>

				{/* Right Section - Search, Notifications, Profile */}
				<div className="flex items-center gap-4">
					{/* Search Bar */}

					{/* Notifications */}
					<button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<IoNotificationsOutline className="text-gray-600" size={22} />
						<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
					</button>

					{/* User Profile */}
					<div className="flex items-center gap-3 pl-3 border-l border-gray-200">
						<div className="hidden md:block text-right">
							<p className="text-sm font-semibold text-gray-900">Admin User</p>
							<p className="text-xs text-gray-500">Administrador</p>
						</div>
						<button className="hover:opacity-80 transition-opacity">
							<IoPersonCircleOutline className="text-gray-600" size={32} />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};
