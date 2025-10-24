import { Decimal } from '@prisma/client/runtime/library';

export const currencyFormat = (value: Decimal) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value.toNumber());
};
