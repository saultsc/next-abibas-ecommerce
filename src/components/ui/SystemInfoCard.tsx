'use client';

import { dateFormat } from '@/utils';
import React from 'react';
import { IoCalendarOutline, IoInformationCircleOutline, IoKeyOutline } from 'react-icons/io5';

interface Props {
	idLabel?: string;
	idValue?: string | number | null;
	createdAt?: string | Date | null;
	updatedAt?: string | Date | null;
	locale?: string;
	className?: string;
}

export const SystemInfoCard: React.FC<Props> = ({
	idLabel = 'ID:',
	idValue,
	createdAt,
	updatedAt,
	locale = 'es-ES',
	className = '',
}) => {
	return (
		<div className={`w-full mb-6 p-4 bg-gray-50 rounded border border-gray-300 ${className}`}>
			<p className="mb-3 font-semibold text-gray-700 flex items-center gap-2">
				<IoInformationCircleOutline className="text-xl text-gray-600" />
				Información del Sistema
			</p>

			<div className="space-y-3 text-sm">
				<div className="flex items-center justify-between">
					<span className="text-gray-600 font-medium flex items-center gap-2">
						<IoKeyOutline className="text-base" />
						{idLabel}
					</span>
					<span className="text-gray-900 font-semibold">{idValue}</span>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-gray-600 font-medium flex items-center gap-2">
						<IoCalendarOutline className="text-base" />
						Creada:
					</span>
					<span className="text-gray-900">{dateFormat(createdAt!)}</span>
				</div>

				{updatedAt && (
					<div className="flex items-center justify-between">
						<span className="text-gray-600 font-medium flex items-center gap-2">
							<IoCalendarOutline className="text-base" />
							Actualizada:
						</span>
						<span className="text-gray-900">{dateFormat(updatedAt)}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default SystemInfoCard;
