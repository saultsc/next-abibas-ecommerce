/**
 * Códigos de error personalizados para la aplicación
 */
export enum ErrorCode {
	// Errores generales
	INTERNAL_ERROR = 'INTERNAL_ERROR',
	VALIDATION_ERROR = 'VALIDATION_ERROR',

	// Errores de productos
	PRODUCT_ALREADY_EXISTS = 'PRODUCT_ALREADY_EXISTS',
	PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
	PRODUCT_UPLOAD_IMAGES_FAILED = 'PRODUCT_UPLOAD_IMAGES_FAILED',
	PRODUCT_HAS_VARIANTS = 'PRODUCT_HAS_VARIANTS',

	// Errores de categorías
	CATEGORY_ALREADY_EXISTS = 'CATEGORY_ALREADY_EXISTS',
	CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
	CATEGORY_HAS_PRODUCTS = 'CATEGORY_HAS_PRODUCTS',

	// Errores de colores
	COLOR_ALREADY_EXISTS = 'COLOR_ALREADY_EXISTS',
	COLOR_NOT_FOUND = 'COLOR_NOT_FOUND',
	COLOR_HAS_VARIANTS = 'COLOR_HAS_VARIANTS',

	// Errores de tallas
	SIZE_ALREADY_EXISTS = 'SIZE_ALREADY_EXISTS',
	SIZE_NOT_FOUND = 'SIZE_NOT_FOUND',
	SIZE_HAS_VARIANTS = 'SIZE_HAS_VARIANTS',

	// Errores de variantes
	VARIANT_NOT_FOUND = 'VARIANT_NOT_FOUND',
	VARIANT_HAS_ORDERS = 'VARIANT_HAS_ORDERS',
	VARIANT_HAS_MOVEMENTS = 'VARIANT_HAS_MOVEMENTS',

	// Errores de autenticación
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',

	// Errores de imágenes de productos
	PRODUCT_IMAGE_NOT_FOUND = 'PRODUCT_IMAGE_NOT_FOUND',
}

/**
 * Mensajes de error por defecto para cada código
 */
export const ErrorMessages: Record<ErrorCode, string> = {
	[ErrorCode.INTERNAL_ERROR]: 'Error interno del servidor',
	[ErrorCode.VALIDATION_ERROR]: 'Los datos proporcionados son inválidos',

	[ErrorCode.PRODUCT_ALREADY_EXISTS]: 'Ya existe un producto con ese nombre',
	[ErrorCode.PRODUCT_NOT_FOUND]: 'Producto no encontrado',
	[ErrorCode.PRODUCT_UPLOAD_IMAGES_FAILED]: 'Error al subir las imágenes del producto',
	[ErrorCode.PRODUCT_HAS_VARIANTS]:
		'No se puede eliminar el producto porque tiene variantes asociadas',

	[ErrorCode.CATEGORY_ALREADY_EXISTS]: 'Ya existe una categoría con ese nombre',
	[ErrorCode.CATEGORY_NOT_FOUND]: 'Categoría no encontrada',
	[ErrorCode.CATEGORY_HAS_PRODUCTS]:
		'No se puede eliminar la categoría porque tiene productos asociados',

	[ErrorCode.COLOR_ALREADY_EXISTS]: 'Ya existe un color con ese nombre',
	[ErrorCode.COLOR_NOT_FOUND]: 'Color no encontrado',
	[ErrorCode.COLOR_HAS_VARIANTS]:
		'No se puede eliminar el color porque está asociado a variantes',

	[ErrorCode.SIZE_ALREADY_EXISTS]: 'Ya existe una talla con ese código',
	[ErrorCode.SIZE_NOT_FOUND]: 'Talla no encontrada',
	[ErrorCode.SIZE_HAS_VARIANTS]: 'No se puede eliminar la talla porque está asociada a variantes',

	[ErrorCode.VARIANT_NOT_FOUND]: 'Variante no encontrada',
	[ErrorCode.VARIANT_HAS_ORDERS]:
		'No se puede eliminar la variante porque está asociada a órdenes',
	[ErrorCode.VARIANT_HAS_MOVEMENTS]:
		'No se puede eliminar la variante porque está asociada a movimientos de inventario',

	[ErrorCode.PRODUCT_IMAGE_NOT_FOUND]: 'Imagen del producto no encontrada',

	[ErrorCode.UNAUTHORIZED]: 'No autorizado',
	[ErrorCode.FORBIDDEN]: 'Acceso prohibido',
};

/**
 * Clase de error personalizada con código de error
 */
export class AppError extends Error {
	public readonly code: ErrorCode;
	public readonly statusCode: number;

	constructor(code: ErrorCode, message?: string, statusCode: number = 400) {
		super(message || ErrorMessages[code]);
		this.name = 'AppError';
		this.code = code;
		this.statusCode = statusCode;

		// Mantener el stack trace correcto
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}
	}

	/**
	 * Verifica si un error es una instancia de AppError
	 */
	static isAppError(error: unknown): error is AppError {
		return error instanceof AppError;
	}

	/**
	 * Crea un error de validación
	 */
	static validation(message?: string): AppError {
		return new AppError(ErrorCode.VALIDATION_ERROR, message);
	}

	/**
	 * Crea un error de no encontrado
	 */
	static notFound(code: ErrorCode, message?: string): AppError {
		return new AppError(code, message, 404);
	}

	/**
	 * Crea un error interno del servidor
	 */
	static internal(message?: string): AppError {
		return new AppError(ErrorCode.INTERNAL_ERROR, message, 500);
	}
}
