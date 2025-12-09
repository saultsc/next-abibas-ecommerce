'use server';

import { prisma } from '@/lib';

import { Province, ProvinceWhereInput, Response } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchProvinces = async (
	term: string,
	countryId?: number,
	take: number = 30
): Promise<Response<Province[]>> => {
	const where: ProvinceWhereInput = {
		...(term
			? !isNaN(Number(term))
				? { province_id: Number(term) }
				: {
						OR: [
							{ province_name: { contains: term } },
							{ province_code: { contains: term } },
						],
				  }
			: {}),
		...(countryId ? { country_id: countryId } : {}),
		...{ state: 'A' },
	};

	try {
		const provinces = await prisma.provinces.findMany({
			where,
			take,
			include: {
				countries: true,
			},
		});

		return { success: true, data: provinces, message: 'Provincias encontradas' };
	} catch (error) {
		return {
			success: false,
			message: 'Error searching provinces',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
