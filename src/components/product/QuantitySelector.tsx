'use client';

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props {
	quantity: number;
	onQuantityChanged?: (quantity: number) => void;
	maxQuantity?: number;
}

export const QuantitySelector = ({ quantity, onQuantityChanged, maxQuantity }: Props) => {
	const onQuantityChange = (value: number) => {
		const newQuantity = quantity + value;

		if (newQuantity < 1) return;
		if (maxQuantity && newQuantity > maxQuantity) return;

		onQuantityChanged?.(newQuantity);
	};

	return (
		<div className="flex items-center gap-3">
			<button
				onClick={() => onQuantityChange(-1)}
				disabled={quantity <= 1}
				className="disabled:opacity-30">
				<IoRemoveCircleOutline size={30} />
			</button>
			<span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded py-2 font-semibold">
				{quantity}
			</span>
			<button
				onClick={() => onQuantityChange(+1)}
				disabled={maxQuantity ? quantity >= maxQuantity : false}
				className="disabled:opacity-30">
				<IoAddCircleOutline size={30} />
			</button>
		</div>
	);
};
