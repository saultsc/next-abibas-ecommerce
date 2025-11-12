'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
	children: React.ReactNode;
	isClickable?: boolean;
	href?: string;
	onRowClick?: () => void;
}

export const TableClickableWrapper = ({ children, isClickable, href, onRowClick }: Props) => {
	const router = useRouter();

	const handleRowClick = (event: React.MouseEvent) => {
		if (!isClickable) {
			return;
		}

		const target = event.target as HTMLElement;
		if (target.closest('a') || target.closest('button')) {
			return;
		}

		if (href) {
			router.push(href);
		} else if (onRowClick) {
			onRowClick();
		}
	};

	return (
		<tr
			onClick={(e) => {
				if (isClickable) {
					handleRowClick(e);
				}
			}}
			className={`bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 ${
				isClickable ? 'cursor-pointer hover:bg-blue-50 active:bg-blue-100' : ''
			}`}>
			{children}
		</tr>
	);
};
