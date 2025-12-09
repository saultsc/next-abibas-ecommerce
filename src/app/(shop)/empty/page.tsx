import Link from 'next/link';

export default function EmptyPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh]">
			<div className="text-center max-w-md">
				<div className="mb-6">
					<svg
						className="mx-auto h-24 w-24 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
						/>
					</svg>
				</div>
				<h1 className="text-4xl font-bold text-gray-800 mb-4">Página vacía</h1>
				<p className="text-lg text-gray-600 mb-8">
					No hay contenido disponible en este momento
				</p>
				<Link
					href="/"
					className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
					Volver al inicio
				</Link>
			</div>
		</div>
	);
}
