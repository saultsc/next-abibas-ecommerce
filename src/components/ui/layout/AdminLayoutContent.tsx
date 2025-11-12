'use client';

import { useUiStore } from '@/store';
import clsx from 'clsx';

interface Props {
	children: React.ReactNode;
}

export const AdminLayoutContent = ({ children }: Props) => {
	const isCollapsed = useUiStore((state) => state.isAdminSidebarCollapsed);

	return (
		<>
			<div
				className={clsx('transition-all duration-300 pt-16 px-6 py-8', {
					'ml-64': !isCollapsed,
					'ml-20': isCollapsed,
				})}>
				{children}
			</div>
		</>
	);
};
