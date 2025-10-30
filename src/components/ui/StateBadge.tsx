import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

interface StateBadgeProps {
	state: string;
	activeLabel?: string;
	inactiveLabel?: string;
	showIcon?: boolean;
	iconSize?: string;
}

export const StateBadge = ({
	state,
	activeLabel = 'Activo',
	inactiveLabel = 'Inactivo',
	showIcon = true,
	iconSize = 'text-xl',
}: StateBadgeProps) => {
	const isActive = state === 'A';

	return (
		<span
			className={`flex items-center gap-2 font-medium ${
				isActive ? 'text-green-600' : 'text-gray-400'
			}`}>
			{isActive ? (
				<>
					{showIcon && <IoCheckmarkCircle className={iconSize} />}
					{activeLabel}
				</>
			) : (
				<>
					{showIcon && <IoCloseCircle className={iconSize} />}
					{inactiveLabel}
				</>
			)}
		</span>
	);
};
