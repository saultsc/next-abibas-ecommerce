import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { me } from '@/actions/auth/me';
import { RegisterForm } from './ui/RegisterForm';

export default async function NewAccountPage() {
	// Verificar si ya hay una sesión activa
	const result = await me();

	if (result.success && result.data) {
		const roleName = result.data.roles?.role_name?.toLowerCase();

		// Redirigir según el rol
		if (roleName === 'cliente' || roleName === 'customer') {
			redirect('/');
		} else {
			// Empleados, administradores y otros roles van al dashboard
			redirect('/system/dashboard');
		}
	}

	return (
		<>
			{/* Card */}
			<div className="bg-white rounded-2xl shadow-2xl p-8 mt-2">
				{/* Logo/Header */}
				<div className="text-center mb-8">
					<Link
						href="/"
						className="inline-block mb-4 hover:opacity-80 transition-opacity">
						<Image
							src="/favicon.ico"
							alt="Abibas Logo"
							width={64}
							height={64}
							className="w-16 h-16"
						/>
					</Link>
					<h1 className="text-4xl font-bold text-gray-800 mb-2">Crear Cuenta</h1>
					<p className="text-gray-600">Regístrate para comenzar</p>
				</div>

				{/* Form */}
				<RegisterForm />

				{/* Divider */}
				<div className="mt-8 relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
					</div>
				</div>

				{/* Login Link */}
				<div className="mt-6 text-center">
					<Link
						href="/auth/login"
						className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
						Iniciar sesión
					</Link>
				</div>
			</div>

			{/* Footer */}
			<div className="text-center mt-6">
				<p className="text-white text-sm">
					© {new Date().getFullYear()} Abibas. Todos los derechos reservados.
				</p>
			</div>
		</>
	);
}
