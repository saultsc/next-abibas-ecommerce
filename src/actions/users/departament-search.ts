'use server';

import { prisma } from '@/lib';

import { DepartmentWhereInput } from '@/interfaces';
import { ErrorCode } from '@/lib';

export const searchDepartments = async (term: string) => {
	const isNumeric = !isNaN(Number(term));

	const where: DepartmentWhereInput = {
		...(term
			? isNumeric
				? { department_id: Number(term) }
				: { department_name: { contains: term } }
			: {}),
		state: 'A',
	};

	try {
		const departments = await prisma.departments.findMany({
			where,
		});

		return {
			success: true,
			data: departments,
			message: 'Departments found successfully',
			code: 200,
		};
	} catch (error) {
		return {
			success: false,
			message: 'Error searching departments',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
