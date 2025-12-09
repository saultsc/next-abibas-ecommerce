'use client';

import { User } from '@/interfaces';
import { useState } from 'react';
import { IoLocationOutline, IoPersonOutline } from 'react-icons/io5';
import { AddressesTab } from './AddressesTab';

interface ProfileContentProps {
	user: User;
	addresses: any[];
}

export const ProfileContent = ({ user, addresses: initialAddresses }: ProfileContentProps) => {
	const [activeTab, setActiveTab] = useState<'info' | 'addresses'>('info');

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
			{/* Sidebar con tabs */}
			<div className="lg:col-span-1">
				<div className="bg-white rounded-lg shadow-md p-4 space-y-2">
					<button
						onClick={() => setActiveTab('info')}
						className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
							activeTab === 'info'
								? 'bg-blue-600 text-white'
								: 'hover:bg-gray-100 text-gray-700'
						}`}>
						<IoPersonOutline size={24} />
						<span className="font-medium">Información Personal</span>
					</button>
					<button
						onClick={() => setActiveTab('addresses')}
						className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
							activeTab === 'addresses'
								? 'bg-blue-600 text-white'
								: 'hover:bg-gray-100 text-gray-700'
						}`}>
						<IoLocationOutline size={24} />
						<span className="font-medium">Mis Direcciones</span>
					</button>
				</div>
			</div>

			{/* Contenido */}
			<div className="lg:col-span-3">
				{activeTab === 'info' && (
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-2xl font-bold mb-6">Información Personal</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Información Básica */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
									Datos Generales
								</h3>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Usuario
									</label>
									<p className="text-base font-medium">{user.username}</p>
								</div>

								{user.persons && (
									<>
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1">
												Nombre Completo
											</label>
											<p className="text-base font-medium">
												{user.persons.first_name} {user.persons.last_name}
											</p>
										</div>

										{user.persons.email && (
											<div>
												<label className="block text-sm font-medium text-gray-600 mb-1">
													Correo Electrónico
												</label>
												<p className="text-base font-medium">
													{user.persons.email}
												</p>
											</div>
										)}

										{user.persons.date_of_birth && (
											<div>
												<label className="block text-sm font-medium text-gray-600 mb-1">
													Fecha de Nacimiento
												</label>
												<p className="text-base font-medium">
													{new Date(
														user.persons.date_of_birth
													).toLocaleDateString('es-ES', {
														day: '2-digit',
														month: 'long',
														year: 'numeric',
													})}
												</p>
											</div>
										)}

										{user.persons.phones && user.persons.phones.length > 0 && (
											<div>
												<label className="block text-sm font-medium text-gray-600 mb-2">
													Teléfonos
												</label>
												<div className="space-y-2">
													{user.persons.phones.map((phone: any) => (
														<div
															key={phone.phone_id}
															className="flex items-center gap-2">
															<span className="text-base font-medium">
																{phone.phone_number}
															</span>
															<span className="text-xs text-gray-500">
																({phone.phone_types.type_name})
															</span>
															{phone.is_primary && (
																<span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
																	Principal
																</span>
															)}
														</div>
													))}
												</div>
											</div>
										)}
									</>
								)}

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Estado de la cuenta
									</label>
									<p>
										<span
											className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
												user.state === 'A'
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											}`}>
											{user.state === 'A' ? 'Activa' : 'Inactiva'}
										</span>
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Miembro desde
									</label>
									<p className="text-base font-medium">
										{new Date(user.created_at).toLocaleDateString('es-ES', {
											day: '2-digit',
											month: 'long',
											year: 'numeric',
										})}
									</p>
								</div>
							</div>

							{/* Información de Cliente */}
							{user.customers && (
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
										Estadísticas de Compras
									</h3>

									<div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
										<label className="block text-sm font-medium text-green-800 mb-1">
											Total Gastado
										</label>
										<p className="text-3xl font-bold text-green-900">
											$
											{parseFloat(
												user.customers.total_spent.toString()
											).toLocaleString('es-ES', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</p>
										<p className="text-xs text-green-700 mt-1">
											en todas tus compras
										</p>
									</div>

									<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
										<label className="block text-sm font-medium text-purple-800 mb-1">
											Cliente desde
										</label>
										<p className="text-lg font-bold text-purple-900">
											{new Date(user.customers.created_at).toLocaleDateString(
												'es-ES',
												{
													day: '2-digit',
													month: 'long',
													year: 'numeric',
												}
											)}
										</p>
										<p className="text-xs text-purple-700 mt-1">
											{Math.floor(
												(new Date().getTime() -
													new Date(user.customers.created_at).getTime()) /
													(1000 * 60 * 60 * 24)
											)}{' '}
											días con nosotros
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{activeTab === 'addresses' && (
					<AddressesTab initialAddresses={initialAddresses} personId={user.person_id} />
				)}
			</div>
		</div>
	);
};
