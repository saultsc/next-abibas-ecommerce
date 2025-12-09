'use server';

import { prisma } from '@/lib';

import { Country, CountryWhereInput, Response } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchCountries = async (
	term: string,
	take: number = 30
): Promise<Response<Country[]>> => {
	const where: CountryWhereInput = {
		...(term
			? !isNaN(Number(term))
				? { country_id: Number(term) }
				: {
						OR: [
							{ country_name: { contains: term } },
							{ country_code: { contains: term } },
						],
				  }
			: {}),
		...{ state: 'A' },
	};

	try {
		const countries = await prisma.countries.findMany({
			where,
			take,
		});

		return { success: true, data: countries, message: 'Países encontrados' };
	} catch (error) {
		return {
			success: false,
			message: 'Error searching countries',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
