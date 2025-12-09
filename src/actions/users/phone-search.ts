'use server';

import { Phone } from '@/interfaces';
import { prisma } from '@/lib';

export const searchPhones = async (
	term: string,
	take: number = 30
): Promise<{ success: boolean; data?: Phone[]; message?: string }> => {
	try {
		const phones = await prisma.phones.findMany({
			where: {
				OR: [
					{ phone_number: { contains: term } },
					{ phone_types: { type_name: { contains: term } } },
				],
				state: 'A',
			},
			include: {
				phone_types: true,
				persons: {
					select: {
						first_name: true,
						last_name: true,
					},
				},
			},
			orderBy: {
				phone_number: 'asc',
			},
			take,
		});

		return {
			success: true,
			data: phones as Phone[],
		};
	} catch (error) {
		console.error('Error buscando teléfonos:', error);
		return {
			success: false,
			message: 'Error al buscar teléfonos',
		};
	}
};
