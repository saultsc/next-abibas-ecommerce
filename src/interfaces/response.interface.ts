import { ErrorCode } from '@/lib';

export interface Response<T> {
	success: boolean;
	message?: string;
	currPage?: number;
	totalPages?: number;
	data?: T;
	code?: number | ErrorCode;
}
