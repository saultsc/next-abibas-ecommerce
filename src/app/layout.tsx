import { DaysAdapterLayout, Toaster } from '@/components';

import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
	title: {
		default: 'Abibas | Tienda virtual',
		template: 'Abibas | %s',
	},
	description: 'Tienda virtual de productos',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<DaysAdapterLayout>{children}</DaysAdapterLayout>
				<Toaster />
			</body>
		</html>
	);
}
