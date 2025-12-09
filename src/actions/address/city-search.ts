'use server';

import { prisma } from '@/lib';

import { City, CityWhereInput, Response } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchCities = async (
	term: string,
	provinceId?: number,
	take: number = 30
): Promise<Response<City[]>> => {
	const where: CityWhereInput = {
		...(term
			? !isNaN(Number(term))
				? { city_id: Number(term) }
				: { city_name: { contains: term } }
			: {}),
		...(provinceId ? { province_id: provinceId } : {}),
		...{ state: 'A' },
	};

	try {
		const cities = await prisma.cities.findMany({
			where,
			take,
			include: {
				provinces: {
					include: {
						countries: true,
					},
				},
			},
		});

		return { success: true, data: cities, message: 'Ciudades encontradas' };
	} catch (error) {
		return {
			success: false,
			message: 'Error searching cities',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
