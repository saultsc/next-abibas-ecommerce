import clsx from 'clsx';

import { Size } from '@/interfaces';

interface Props {
	selectedSize: Size;
	availableSize: Size[];
}

export const SizeSelector = ({ availableSize, selectedSize }: Props) => {
	return (
		<div className="my-5">
			<h3 className="font-bold mb-4">Tallas Disponibles</h3>

			<div className="flex">
				{availableSize.map((size) => (
					<button
						key={size.size_code}
						className={clsx('mx-2 hover:underline text-lg', {
							underline: size === selectedSize,
						})}>
						{size.size_code}
					</button>
				))}
			</div>
		</div>
	);
};
