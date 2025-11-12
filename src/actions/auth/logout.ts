'use server';

import { cookies } from 'next/headers';

import { Response } from '@/interfaces';

/**
 * Cierra la sesión del usuario eliminando el token de las cookies
 */
export const logout = async (): Promise<Response<null>> => {
	try {
		const cookieStore = await cookies();

		cookieStore.delete('token');

		return {
			success: true,
			data: null,
			message: 'Sesión cerrada exitosamente',
			code: 200,
		};
	} catch (error) {
		console.error('Error en logout:', error);

		return {
			success: false,
			message: 'Error al cerrar sesión',
			code: 500,
		};
	}
};
