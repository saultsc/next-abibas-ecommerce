import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Middleware para proteger las rutas del sistema
 * Verifica que el usuario tenga una sesión válida, esté activo y sea administrador
 */
export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Verificar si la ruta es de sistema
	if (pathname.startsWith('/system')) {
		// Obtener el token de las cookies
		const token = request.cookies.get('token')?.value;

		// Si no hay token, redirigir al login
		if (!token) {
			const url = request.nextUrl.clone();
			url.pathname = '/auth/login';
			url.searchParams.set('redirect', pathname);
			return NextResponse.redirect(url);
		}

		try {
			// Verificar que el token sea válido usando jose (compatible con Edge Runtime)
			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			await jwtVerify(token, secret);

			// Verificar con la API que el usuario esté activo y tenga permisos
			const verifyUrl = new URL('/api/auth/verify', request.url);
			const verifyResponse = await fetch(verifyUrl.toString(), {
				method: 'GET',
				headers: {
					Cookie: `token=${token}`,
				},
			});

			if (!verifyResponse.ok) {
				const data = await verifyResponse.json().catch(() => ({}));
				const url = request.nextUrl.clone();

				// Si es un cliente (403), redirigir a la página de inicio sin eliminar token
				if (verifyResponse.status === 403) {
					url.pathname = '/';
					return NextResponse.redirect(url);
				}

				// Para otros errores (usuario no autorizado), eliminar token y redirigir a login
				url.pathname = '/auth/login';
				const response = NextResponse.redirect(url);
				response.cookies.delete('token');

				return response;
			}

			// Verificar el contenido de la respuesta
			const data = await verifyResponse.json();

			if (!data.success) {
				// Usuario inactivo o con problemas
				const url = request.nextUrl.clone();
				url.pathname = '/auth/login';
				url.searchParams.set('error', 'inactive');
				url.searchParams.set('message', data.message || 'Usuario inactivo');

				// Eliminar el token de las cookies
				const response = NextResponse.redirect(url);
				response.cookies.delete('token');

				return response;
			} // Usuario válido y con permisos, permitir acceso
			return NextResponse.next();
		} catch (error) {
			// Token inválido, redirigir al login
			console.error('Token verification failed:', error);
			const url = request.nextUrl.clone();
			url.pathname = '/auth/login';
			url.searchParams.set('redirect', pathname);
			return NextResponse.redirect(url);
		}
	}

	// Para otras rutas, permitir acceso
	return NextResponse.next();
}

// Configurar qué rutas serán procesadas por el middleware
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|imgs|products).*)',
	],
};
