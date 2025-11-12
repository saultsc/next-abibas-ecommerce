'use server';

import prisma from '@/lib/prisma';

import { PartiesWhereInput, Party, Response } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchParties = async (term: string): Promise<Response<Party[]>> => {
	const isNumeric = !isNaN(Number(term));

	const where: PartiesWhereInput = {
		...(term
			? isNumeric
				? { party_id: Number(term) }
				: { party_name: { contains: term } }
			: {}),
		state: 'A',
	};

	try {
		const parties = await prisma.parties.findMany({
			where,
		});

		return { success: true, data: parties, message: 'Parties found successfully', code: 200 };
	} catch (error) {
		return {
			success: false,
			message: 'Error searching parties',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
