'use server';

import { AppError, ErrorCode } from '@/lib';
import prisma from '@/lib/prisma';

export const deleteProductVariant = async (variant_id: number) => {
	try {
		const existingVariant = await prisma.product_variants.findUnique({
			where: { variant_id },
		});

		if (!existingVariant) {
			throw AppError.notFound(ErrorCode.VARIANT_NOT_FOUND);
		}

		const existingReferences = await prisma.product_variants.findFirst({
			where: { variant_id },
			select: { order_items: true, inventory_movements: true },
		});

		const hasOrders = existingReferences?.order_items.length;
		const hasMovements = existingReferences?.inventory_movements.length;

		if (hasOrders && hasMovements) {
			throw new AppError(
				ErrorCode.VARIANT_HAS_ORDERS,
				'No se puede eliminar la variante porque está asociada a items de órdenes y movimientos de inventario'
			);
		}

		if (hasOrders) {
			throw new AppError(ErrorCode.VARIANT_HAS_ORDERS);
		}

		if (hasMovements) {
			throw new AppError(ErrorCode.VARIANT_HAS_MOVEMENTS);
		}

		const deletedVariant = await prisma.product_variants.delete({
			where: { variant_id },
		});

		return {
			success: true,
			message: 'Variante eliminada exitosamente',
			data: deletedVariant,
		};
	} catch (error) {
		console.error('Error al eliminar la variante:', error);

		if (AppError.isAppError(error)) {
			return {
				success: false,
				message: error.message,
				code: error.code,
			};
		}

		// Error desconocido
		return {
			success: false,
			message: 'Error inesperado al eliminar la variante',
			code: ErrorCode.INTERNAL_ERROR,
		};
	}
};
