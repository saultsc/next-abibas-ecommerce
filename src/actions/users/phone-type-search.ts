'use server';

import { prisma } from '@/lib';

import { PhoneType, PhoneTypesWhereInput, Response } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchPhoneTypes = async (term: string): Promise<Response<PhoneType[]>> => {
	const where: PhoneTypesWhereInput = {
		...{ phone_type_name: { contains: term } },
		...{ state: 'A' },
	};
	try {
		const phoneTypes = await prisma.phone_types.findMany({
			where,
		});

		return { success: true, data: phoneTypes, message: 'Phone types found successfully' };
	} catch (error) {
		return {
			success: false,
			message: 'Error searching phone types',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
