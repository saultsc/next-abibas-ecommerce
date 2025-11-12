/**
 * Genera el filtro de registros eliminados para queries de Prisma
 * @param includeDeleted - Si es true, trae todos los registros (incluyendo eliminados).
 *                         Si es false o undefined, solo trae los NO eliminados (is_delete = false)
 * @returns Objeto con el filtro { is_delete: false } o vacío si se incluyen todos
 */
export const getDeletedFilter = (includeDeleted?: boolean) => {
	return includeDeleted === true ? {} : { is_delete: false };
};

/**
 * Genera el filtro de registros activos para queries de Prisma
 * @param onlyActive - Si es true, solo trae registros activos. Si es false, trae todos
 * @returns Objeto con el filtro o vacío si se incluyen todos
 */
export const getActiveFilter = (onlyActive: boolean = true) => {
	return onlyActive ? { is_active: true } : {};
};
