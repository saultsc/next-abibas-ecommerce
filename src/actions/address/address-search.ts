'use server';

import { Response } from '@/interfaces';
import { prisma } from '@/lib';

export const searchAddresses = async (
	term: string,
	take: number = 30
): Promise<Response<any[]>> => {
	try {
		const addresses = await prisma.addresses.findMany({
			where: {
				OR: [
					{ address_line1: { contains: term } },
					{ address_line2: { contains: term } },
					{ postal_code: { contains: term } },
					{ cities: { city_name: { contains: term } } },
					{ cities: { provinces: { province_name: { contains: term } } } },
					{
						cities: {
							provinces: { countries: { country_name: { contains: term } } },
						},
					},
				],
				state: 'A',
			},
			include: {
				cities: {
					include: {
						provinces: {
							include: {
								countries: true,
							},
						},
					},
				},
				persons: {
					select: {
						first_name: true,
						last_name: true,
					},
				},
			},
			orderBy: {
				address_line1: 'asc',
			},
			take,
		});

		return {
			success: true,
			data: addresses,
		};
	} catch (error) {
		console.error('Error buscando direcciones:', error);
		return {
			success: false,
			message: 'Error al buscar direcciones',
		};
	}
};
