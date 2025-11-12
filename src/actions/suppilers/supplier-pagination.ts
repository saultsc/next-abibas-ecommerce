'use server';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedSuppliers = async (params: Params) => {
	const { page = 1, limit = 10, term } = params;
	const skip = (page - 1) * limit;
};
