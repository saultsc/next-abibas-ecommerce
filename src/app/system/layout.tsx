import { AdminLayoutContent, AdminSidebar, AdminTopMenu } from '@/components';

export default async function SystemLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="min-h-screen bg-gray-50">
			<AdminTopMenu />
			<AdminSidebar />

			{/* Content area with padding for sidebar */}
			<AdminLayoutContent>{children}</AdminLayoutContent>
		</main>
	);
}
