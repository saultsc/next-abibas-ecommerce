import { ErrorCode } from '@/lib/errors';

export interface Response<T = unknown> {
	success: boolean;
	message?: string;
	currPage?: number;
	totalPages?: number;
	code?: number | ErrorCode;
	data?: T;
}
