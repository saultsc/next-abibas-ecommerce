import { me } from '@/actions/auth/me';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para verificar la autenticación del usuario
 * Usa la función me() que ya valida:
 * - Token válido
 * - Usuario existe
 * - Usuario activo (state === 'A')
 * - Usuario NO sea cliente (solo para acceso a /system)
 */
export async function GET(request: NextRequest) {
	const result = await me();

	// Si el me retorna error, devolver el error tal cual
	if (!result.success) {
		return NextResponse.json(
			{ success: false, message: result.message },
			{ status: (result.code as number) || 401 }
		);
	}

	// Verificar que el usuario NO sea cliente
	const user = result.data;
	if (
		user?.roles?.role_name.toLowerCase() === 'cliente' ||
		user?.roles?.role_name.toLowerCase() === 'customer'
	) {
		return NextResponse.json(
			{ success: false, message: 'Los clientes no tienen acceso al sistema' },
			{ status: 403 }
		);
	}

	// Si todo está bien, retornar éxito
	return NextResponse.json({
		success: true,
		data: result.data,
		message: 'Usuario verificado exitosamente',
	});
}
