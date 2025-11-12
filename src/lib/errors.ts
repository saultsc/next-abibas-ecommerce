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
	INVALID_TOKEN = 'INVALID_TOKEN',
	USER_INACTIVE = 'USER_INACTIVE',

	// Errores de imágenes de productos
	PRODUCT_IMAGE_NOT_FOUND = 'PRODUCT_IMAGE_NOT_FOUND',

	// Errores de tipos de vehículos
	VEHICLE_TYPE_NOT_FOUND = 'VEHICLE_TYPE_NOT_FOUND',
	VEHICLE_TYPE_ALREADY_EXISTS = 'VEHICLE_TYPE_ALREADY_EXISTS',

	// Errores de estados de vehículos
	STATUS_VEHICLE_ALREADY_EXISTS = 'STATUS_VEHICLE_ALREADY_EXISTS',
	STATUS_VEHICLE_NOT_FOUND = 'STATUS_VEHICLE_NOT_FOUND',

	// Errores de tipo de documentos de vehículos
	VEHICLE_DOCUMENT_TYPE_ALREADY_EXISTS = 'VEHICLE_DOCUMENT_TYPE_ALREADY_EXISTS',
	VEHICLE_DOCUMENT_TYPE_NOT_FOUND = 'VEHICLE_DOCUMENT_TYPE_NOT_FOUND',
	VEHICLE_DOCUMENT_TYPE_HAS_DOCUMENTS = 'VEHICLE_DOCUMENT_TYPE_HAS_DOCUMENTS',

	// Errores de usuarios
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
	USER_INVALID_CREDENTIALS = 'USER_INVALID_CREDENTIALS',
	USER_CREATION_FAILED = 'USER_CREATION_FAILED',
	DOCUMENT_ALREADY_EXISTS = 'DOCUMENT_ALREADY_EXISTS',
	EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',

	// Errores de clientes
	CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
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
	[ErrorCode.INVALID_TOKEN]: 'Token inválido o expirado',
	[ErrorCode.USER_INACTIVE]: 'El usuario está inactivo',

	[ErrorCode.VEHICLE_TYPE_NOT_FOUND]: 'Tipo de vehículo no encontrado',
	[ErrorCode.VEHICLE_TYPE_ALREADY_EXISTS]: 'Ya existe un tipo de vehículo con ese nombre',

	[ErrorCode.STATUS_VEHICLE_ALREADY_EXISTS]: 'Ya existe un estado de vehículo con ese nombre',
	[ErrorCode.STATUS_VEHICLE_NOT_FOUND]: 'Estado de vehículo no encontrado',

	[ErrorCode.VEHICLE_DOCUMENT_TYPE_ALREADY_EXISTS]:
		'Ya existe un tipo de documento de vehículo con ese nombre',
	[ErrorCode.VEHICLE_DOCUMENT_TYPE_NOT_FOUND]: 'Tipo de documento de vehículo no encontrado',
	[ErrorCode.VEHICLE_DOCUMENT_TYPE_HAS_DOCUMENTS]:
		'No se puede eliminar el tipo de documento de vehículo porque está asociado a documentos',

	[ErrorCode.USER_NOT_FOUND]: 'Usuario no encontrado',
	[ErrorCode.USER_ALREADY_EXISTS]: 'Ya existe un usuario con ese nombre de usuario',
	[ErrorCode.USER_INVALID_CREDENTIALS]: 'Credenciales de usuario inválidas',
	[ErrorCode.USER_CREATION_FAILED]: 'Error al crear el usuario',
	[ErrorCode.DOCUMENT_ALREADY_EXISTS]: 'El número de documento ya está en uso',
	[ErrorCode.EMAIL_ALREADY_EXISTS]: 'El correo electrónico ya está en uso',
	[ErrorCode.CUSTOMER_NOT_FOUND]: 'Cliente no encontrado',
};

/**
 * Clase de error personalizada con código de error
 */
export class CustomError extends Error {
	public readonly code: ErrorCode;
	public readonly statusCode: number;

	constructor(code: ErrorCode, message?: string, statusCode: number = 400) {
		super(message || ErrorMessages[code]);
		this.name = 'CustomError';
		this.code = code;
		this.statusCode = statusCode;

		// Mantener el stack trace correcto
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CustomError);
		}
	}

	/**
	 * Verifica si un error es una instancia de CustomError
	 */
	static isCustomError(error: unknown): error is CustomError {
		return error instanceof CustomError;
	}

	/**
	 * Crea un error de validación
	 */
	static validation(message?: string): CustomError {
		return new CustomError(ErrorCode.VALIDATION_ERROR, message);
	}

	/**
	 * Crea un error de no encontrado
	 */
	static notFound(code: ErrorCode, message?: string): CustomError {
		return new CustomError(code, message, 404);
	}

	static badRequest(code: ErrorCode, message?: string): CustomError {
		return new CustomError(code, message, 400);
	}

	/**
	 * Crea un error de no autorizado (401)
	 */
	static unauthorized(code: ErrorCode, message?: string): CustomError {
		return new CustomError(code, message, 401);
	}

	/**
	 * Crea un error de prohibido (403)
	 */
	static forbidden(code: ErrorCode, message?: string): CustomError {
		return new CustomError(code, message, 403);
	}

	/**
	 * Crea un error interno del servidor
	 */
	static internal(message?: string): CustomError {
		return new CustomError(ErrorCode.INTERNAL_ERROR, message, 500);
	}
}
