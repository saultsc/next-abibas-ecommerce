export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="min-h-screen bg-gradient-to-br from-white via-gray-400 to-gray-900">
			<div className="flex items-center justify-center min-h-screen px-4">
				<div className="w-full max-w-2xl">{children}</div>
			</div>
		</main>
	);
}
