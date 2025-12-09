'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useUiStore } from '@/store';
import { AiFillCar } from 'react-icons/ai';
import { BiCategory as Category } from 'react-icons/bi';
import { CiShoppingBasket } from 'react-icons/ci';
import { FaOilCan, FaTruck, FaUser, FaUsers } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { IoIosColorFilter } from 'react-icons/io';
import {
	IoChevronBackOutline,
	IoChevronForwardOutline,
	IoCubeOutline,
	IoShirtOutline,
	IoTicketOutline,
} from 'react-icons/io5';
import { MdCategory, MdDashboard, MdOutlineFormatSize, MdOutlineToggleOn } from 'react-icons/md';

interface MenuItem {
	href: string;
	icon: React.ElementType;
	label: string;
}

interface MenuGroup {
	id: string;
	label: string;
	icon: React.ElementType;
	items: MenuItem[];
}

const groupedMenus: MenuGroup[] = [
	{
		id: 'productos',
		label: 'Productos',
		icon: FiPackage,
		items: [
			{ href: '/system/products', icon: IoShirtOutline, label: 'Gestión' },
			{ href: '/system/categories', icon: Category, label: 'Categorías' },
			{ href: '/system/sizes', icon: MdOutlineFormatSize, label: 'Tallas' },
			{ href: '/system/colors', icon: IoIosColorFilter, label: 'Colores' },
		],
	},
	{
		id: 'vehiculos',
		label: 'Vehículos',
		icon: AiFillCar,
		items: [
			{ href: '/system/vehicles', icon: FaTruck, label: 'Gestión' },
			{ href: '/system/vehicle-types', icon: MdCategory, label: 'Tipos' },
			{ href: '/system/vehicle-status', icon: MdOutlineToggleOn, label: 'Estados' },
			{ href: '/system/maintenance', icon: FaOilCan, label: 'Mantenimientos' },
		],
	},
];

const otherMenus: MenuItem[] = [
	{ href: '/system/customers', icon: FaUser, label: 'Clientes' },
	{ href: '/system/users', icon: FaUsers, label: 'Usuarios' },
	{ href: '/system/orders', icon: IoTicketOutline, label: 'Órdenes' },
	{ href: '/system/shipments', icon: IoCubeOutline, label: 'Envíos' },
	{ href: '/system/suppliers', icon: FaTruck, label: 'Proveedores' },
];

export const AdminSidebar = () => {
	const isCollapsed = useUiStore((state) => state.isAdminSidebarCollapsed);
	const toggleSidebar = useUiStore((state) => state.toggleAdminSidebar);
	const pathname = usePathname();
	const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
		productos: true,
		vehiculos: false,
	});

	const toggleGroup = (id: string) => {
		setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<aside
			className={clsx(
				'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 z-30 border-r border-gray-200',
				{
					'w-64': !isCollapsed,
					'w-20': isCollapsed,
				}
			)}>
			{/* Toggle Button */}
			<button
				onClick={() => toggleSidebar()}
				className="absolute -right-3 top-6 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition-colors shadow-md z-10">
				{isCollapsed ? (
					<IoChevronForwardOutline size={16} />
				) : (
					<IoChevronBackOutline size={16} />
				)}
			</button>{' '}
			{/* Navigation */}
			<nav className="p-4 space-y-2 overflow-y-auto h-full">
				{/* Link to Shop */}
				<Link
					href="/"
					className={clsx(
						'flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-blue-50 group'
					)}>
					<CiShoppingBasket
						size={24}
						className="shrink-0 text-gray-600 group-hover:text-blue-600"
					/>
					<span
						className={clsx(
							'text-sm font-medium text-gray-700 group-hover:text-blue-600 whitespace-nowrap overflow-hidden transition-all duration-300',
							isCollapsed
								? 'opacity-0 -translate-x-1 max-w-0'
								: 'opacity-100 translate-x-0 max-w-40'
						)}>
						Ver Tienda
					</span>
				</Link>

				{/* Separator */}
				<div className="h-px bg-gray-200 my-4" />

				{/* Dashboard (single) */}
				<Link
					href={'/system/dashboard'}
					className={clsx('flex items-center gap-3 p-3 rounded-lg transition-all group', {
						'bg-blue-100 text-blue-700': pathname === '/system/dashboard',
						'hover:bg-gray-100 text-gray-700': pathname !== '/system/dashboard',
					})}>
					<MdDashboard
						size={22}
						className={clsx('shrink-0', {
							'text-blue-600': pathname === '/system/dashboard',
							'text-gray-600 group-hover:text-gray-900':
								pathname !== '/system/dashboard',
						})}
					/>
					<span
						className={clsx(
							'text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300',
							isCollapsed
								? 'opacity-0 -translate-x-1 max-w-0'
								: 'opacity-100 translate-x-0 max-w-40'
						)}>
						Dashboard
					</span>
				</Link>

				{/* Grouped sections */}
				{groupedMenus.map((group) => {
					const GroupIcon = group.icon;
					const anyChildActive = group.items.some(
						(it) => pathname === it.href || pathname.startsWith(`${it.href}/`)
					);
					return (
						<div key={group.id}>
							<button
								type="button"
								onClick={() => {
									// @ts-ignore toggleGroup will be defined below in component
									toggleGroup(group.id);
								}}
								className={clsx(
									'w-full flex items-center gap-3 p-3 rounded-lg transition-all group',
									{
										'bg-blue-100 text-blue-700': anyChildActive,
										'hover:bg-gray-100 text-gray-700': !anyChildActive,
									}
								)}>
								<GroupIcon
									size={22}
									className={clsx('shrink-0', {
										'text-blue-600': anyChildActive,
										'text-gray-600 group-hover:text-gray-900': !anyChildActive,
									})}
								/>
								<span
									className={clsx(
										'text-left text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300',
										{
											'flex-1 opacity-100 translate-x-0 max-w-40':
												!isCollapsed,
											'opacity-0 -translate-x-1 max-w-0': isCollapsed,
										}
									)}>
									{group.label}
								</span>
								{!isCollapsed && (
									<span
										className={clsx('transition-transform', {
											'rotate-90': openGroups?.[group.id],
										})}>
										<IoChevronForwardOutline size={16} />
									</span>
								)}
							</button>

							{!isCollapsed && openGroups?.[group.id] && (
								<div className="ml-2">
									{group.items.map((item) => {
										const Icon = item.icon;
										const isActive =
											pathname === item.href ||
											pathname.startsWith(`${item.href}/`);
										return (
											<Link
												key={item.href}
												href={item.href}
												className={clsx(
													'flex items-center gap-3 p-2 rounded-lg transition-all group',
													{
														'bg-blue-100 text-blue-700': isActive,
														'hover:bg-gray-100 text-gray-700':
															!isActive,
													}
												)}>
												<Icon
													size={18}
													className={clsx('shrink-0', {
														'text-blue-600': isActive,
														'text-gray-600 group-hover:text-gray-900':
															!isActive,
													})}
												/>
												<span
													className={clsx('text-sm', {
														'text-blue-700': isActive,
														'text-gray-700 group-hover:text-gray-900':
															!isActive,
													})}>
													{item.label}
												</span>
											</Link>
										);
									})}
								</div>
							)}
						</div>
					);
				})}

				{/* Separator */}
				<div className="h-px bg-gray-200 my-4" />

				{/* Other single items */}
				{otherMenus.map((item) => {
					const Icon = item.icon as React.ElementType;
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={clsx(
								'flex items-center gap-3 p-3 rounded-lg transition-all group',
								{
									'bg-blue-100 text-blue-700': isActive,
									'hover:bg-gray-100 text-gray-700': !isActive,
								}
							)}>
							<Icon
								size={22}
								className={clsx('shrink-0', {
									'text-blue-600': isActive,
									'text-gray-600 group-hover:text-gray-900': !isActive,
								})}
							/>
							<span
								className={clsx(
									'text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300',
									{
										'text-blue-700': isActive,
										'text-gray-700 group-hover:text-gray-900': !isActive,
									},
									isCollapsed
										? 'opacity-0 -translate-x-1 max-w-0'
										: 'opacity-100 translate-x-0 max-w-40'
								)}>
								{item.label}
							</span>
						</Link>
					);
				})}
			</nav>
			{/* Tooltip for collapsed state */}
			{isCollapsed && (
				<style jsx global>{`
					.group:hover::after {
						content: attr(data-tooltip);
						position: absolute;
						left: 100%;
						top: 50%;
						transform: translateY(-50%);
						margin-left: 0.5rem;
						padding: 0.5rem 0.75rem;
						background-color: #1f2937;
						color: white;
						border-radius: 0.375rem;
						font-size: 0.875rem;
						white-space: nowrap;
						z-index: 50;
						opacity: 0;
						pointer-events: none;
						transition: opacity 0.2s;
					}
					.group:hover::after {
						opacity: 1;
					}
				`}</style>
			)}
		</aside>
	);
};
