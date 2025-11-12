'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { IoClose, IoWarningOutline } from 'react-icons/io5';

interface DeleteButtonProps {
	onDelete?: () => void | Promise<void>;
	itemName?: string;
	itemTitle?: string;
	buttonText?: string;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	disabled?: boolean;
	variant?: 'danger' | 'outlined';
}

export const DeleteButton = ({
	onDelete,
	itemName = 'este elemento',
	itemTitle,
	buttonText = 'Eliminar',
	title = 'Confirmar eliminación',
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	disabled = false,
	variant = 'danger',
}: DeleteButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => {
		if (!isLoading) {
			setIsOpen(false);
		}
	};

	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			await onDelete?.();
			setIsOpen(false);
		} catch (error) {
			console.error('Error al eliminar:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const defaultMessage = `¿Estás seguro de que deseas eliminar ${itemName}? Esta acción no se puede deshacer.`;

	return (
		<>
			<button
				type="button"
				onClick={handleOpen}
				disabled={disabled}
				className={clsx(
					'px-4 py-2 rounded font-medium transition-all duration-200 cursor-pointer',
					variant === 'danger' &&
						'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg active:scale-95',
					variant === 'outlined' &&
						'border-2 border-red-600 text-red-600 hover:bg-red-50 active:scale-95',
					disabled && 'opacity-50 cursor-not-allowed hover:shadow-none'
				)}>
				{buttonText}
			</button>

			{/* Modal Overlay */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={handleClose}
					/>

					{/* Modal */}
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
						{/* Header */}
						<div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 relative">
							<button
								onClick={handleClose}
								disabled={isLoading}
								className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors cursor-pointer">
								<IoClose className="w-5 h-5" />
							</button>
							<div className="flex items-center gap-4">
								<div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
									<IoWarningOutline className="w-6 h-6 text-white" />
								</div>
								<h2 className="text-xl font-bold text-white">{title}</h2>
							</div>
						</div>

						{/* Content */}
						<div className="px-8 py-10">
							{itemTitle && (
								<div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-xs text-gray-500 mb-1">Producto:</p>
									<p className="text-sm font-semibold text-gray-800">
										{itemTitle}
									</p>
								</div>
							)}
							<p className="text-gray-600 text-sm leading-relaxed">
								{message || defaultMessage}
							</p>
						</div>

						{/* Actions */}
						<div className="px-8 pb-4 pt-4 flex gap-6 items-center justify-end">
							<button
								onClick={handleClose}
								disabled={isLoading}
								className="text-gray-600 text-sm font-medium hover:text-gray-800 underline-offset-4 hover:underline transition-all disabled:opacity-50 cursor-pointer">
								{cancelText}
							</button>
							<button
								onClick={handleConfirm}
								disabled={isLoading}
								className={clsx(
									'px-5 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer'
								)}>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Eliminando...
									</>
								) : (
									confirmText
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
