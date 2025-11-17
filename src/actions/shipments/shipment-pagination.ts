import { Response, Shipment, ShipmentInclude, ShipmentWhereInput } from '@/interfaces';
import prisma from '@/lib/prisma';

interface Params {
	page?: number;
	limit?: number;
	term?: string;
}

export const getPaginatedShipments = async (params: Params): Promise<Response<Shipment[]>> => {
	const { page = 1, limit = 10, term } = params;
	const skip = (page - 1) * limit;

	const isNumeric = !isNaN(Number(term));

	const where: ShipmentWhereInput = {
		...(term
			? isNumeric
				? { shipment_id: Number(term) }
				: { shipment_number: { contains: term } }
			: {}),
	};

	const include: ShipmentInclude = {
		shipment_orders: {
			include: {
				orders: true,
			},
		},
		deliveries: true,
	};

	const [shipments, total] = await Promise.all([
		prisma.shipments.findMany({
			skip,
			take: limit,
			include,
			where,
		}),
		prisma.shipments.count({ where }),
	]);

	const totalPages = Math.ceil(total / limit);

	return {
		data: shipments,
		currPage: page,
		code: 200,
		success: true,
		totalPages,
	};
};
