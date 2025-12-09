'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toast } from 'sonner';

import { StateSwitch, SystemInfoCard } from '@/components';
import { Party, PhoneType, User } from '@/interfaces';
import { dateFormat, dateOnlyFormat } from '@/utils';

interface Props {
	user: User;
	parties: Party[];
	phoneTypes: PhoneType[];
}

export const CustomerForm = (props: Props) => {
	const { user, parties, phoneTypes } = props;

	const router = useRouter();

	const [state, setState] = useState(user.state ?? 'A');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formData = new FormData();

		if (user.user_id) {
			formData.append('user_id', String(user.user_id));
		}

		formData.append('state', state);

		// TODO: Implementar createOrUpdateCustomer
		const { success, message } = { success: true, message: 'Por implementar' };
		// const { success, message } = await createOrUpdateCustomer(formData);

		if (!success) {
			toast.error(message);
			return;
		}

		toast.success(message);

		router.replace(`/system/customers`);
	};

	const handleDelete = async () => {
		const { success, message } = {} as { success: boolean; message?: string };

		if (!success) {
			toast.error(message || 'No se pudo eliminar el cliente');
			return;
		}

		toast.success(message || 'Cliente eliminado exitosamente');
		router.replace('/system/customers');
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-6 mb-6 pb-6">
			{/* Columna Izquierda - Información del Usuario */}
			<div className="w-[70%] flex flex-col gap-6">
				{/* Header con información del cliente */}
				{user.username && (
					<div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 shadow-sm">
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
										<span className="text-white font-bold text-xl">
											{user.persons?.first_name?.[0]?.toUpperCase() || '?'}
										</span>
									</div>
									<div>
										<h3 className="text-xl font-bold text-gray-800">
											@{user.username}
										</h3>
										<p className="text-sm text-gray-600">Cliente del sistema</p>
									</div>
								</div>
								{user.last_login && (
									<div className="ml-15 text-xs text-gray-500">
										<span className="font-medium">Último acceso:</span>{' '}
										{dateFormat(user.last_login)}
									</div>
								)}
							</div>
							<div className="flex items-center">
								<StateSwitch
									state={state}
									onStateChange={(newState) => setState(newState)}
									gender="el"
									entityName="cliente"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Sección: Información del Cliente */}
				<div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
					<div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800">
							Información del Cliente
						</h3>
					</div>

					<div className="p-6 space-y-6">
						{/* Nombre Completo */}
						<div className="grid grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-600 mb-1">
									Nombres
								</label>
								<p className="text-base font-semibold text-gray-900">
									{user.persons?.first_name || 'N/A'}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-600 mb-1">
									Apellidos
								</label>
								<p className="text-base font-semibold text-gray-900">
									{user.persons?.last_name || 'N/A'}
								</p>
							</div>
						</div>

						{/* Fecha de Nacimiento y Email */}
						<div className="grid grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-600 mb-1">
									Fecha de Nacimiento
								</label>
								<p className="text-base text-gray-900">
									{user.persons?.date_of_birth
										? dateOnlyFormat(user.persons.date_of_birth)
										: 'N/A'}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-600 mb-1">
									Email
								</label>
								<p className="text-base text-gray-900">
									{user.persons?.email || 'N/A'}
								</p>
							</div>
						</div>

						{/* Total Gastado */}
						<div className="bg-green-50 border border-green-200 rounded-lg p-4">
							<label className="block text-sm font-medium text-green-700 mb-1">
								Total Gastado
							</label>
							<p className="text-2xl font-bold text-green-600">
								$
								{user.customers?.total_spent
									? Number(user.customers.total_spent).toFixed(2)
									: '0.00'}
							</p>
						</div>
					</div>
				</div>

				{/* Información del Sistema */}
				{user.user_id && (
					<SystemInfoCard
						idValue={user.user_id}
						createdAt={user.created_at}
						updatedAt={user.updated_at}
					/>
				)}

				{/* Botones */}
				<div className="flex gap-4">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
						Guardar
					</button>
				</div>
			</div>

			{/* Columna Derecha - Teléfonos y Direcciones */}
			<div className="w-[30%] flex flex-col gap-6 self-start">
				{/* Direcciones */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">Direcciones</h3>
					<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[200px] max-h-[300px] overflow-y-auto">
						{/* Aquí irá el componente de manejo de direcciones */}
						<p className="text-gray-500 text-sm">
							Componente de direcciones pendiente...
						</p>
					</div>
				</div>

				{/* Teléfonos de Contacto */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Teléfonos de Contacto
					</h3>
					<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[200px] max-h-[300px] overflow-y-auto">
						{/* Aquí irá el componente de manejo de teléfonos */}
						<p className="text-gray-500 text-sm">
							Componente de teléfonos pendiente...
						</p>
					</div>
				</div>
			</div>
		</form>
	);
};
