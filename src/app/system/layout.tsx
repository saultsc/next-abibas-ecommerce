import { Sidebar, TopMenu } from '@/components';
import { comicSans } from '@/config/fonts';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className={`min-h-screen ${comicSans.className} antialiased`}>
			<TopMenu />
			<Sidebar />

			<div className="px-0 sm:px-10">{children}</div>
		</main>
	);
}
