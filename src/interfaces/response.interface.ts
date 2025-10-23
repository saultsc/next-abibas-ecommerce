export interface Response<T> {
	success: boolean;
	message?: string;
	currPage?: number;
	totalPages?: number;
	data?: T;
}
