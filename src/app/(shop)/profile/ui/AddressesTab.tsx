'use client';

import { useState } from 'react';
import {
	IoAddOutline,
	IoCheckmarkCircle,
	IoCreateOutline,
	IoLocationOutline,
	IoTrashOutline,
} from 'react-icons/io5';
import { toast } from 'sonner';
import { AddressForm } from './AddressForm';

interface AddressesTabProps {
	initialAddresses: any[];
	personId: number;
}

export const AddressesTab = ({ initialAddresses, personId }: AddressesTabProps) => {
	const [addresses, setAddresses] = useState(initialAddresses);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingAddress, setEditingAddress] = useState<any>(null);

	const handleAddressAdded = () => {
		setShowAddForm(false);
		setEditingAddress(null);
		// Recargar la página para actualizar las direcciones
		window.location.reload();
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Mis Direcciones</h2>
				<button
					onClick={() => {
						setShowAddForm(!showAddForm);
						setEditingAddress(null);
					}}
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
					<IoAddOutline size={20} />
					{showAddForm ? 'Cancelar' : 'Agregar Dirección'}
				</button>
			</div>

			{(showAddForm || editingAddress) && (
				<div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
					<h3 className="text-lg font-semibold mb-4">
						{editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
					</h3>
					<AddressForm
						personId={personId}
						address={editingAddress}
						onSuccess={handleAddressAdded}
						onCancel={() => {
							setShowAddForm(false);
							setEditingAddress(null);
						}}
					/>
				</div>
			)}

			{!showAddForm && !editingAddress && (
				<>
					{addresses.length === 0 ? (
						<div className="text-center py-12">
							<IoLocationOutline size={64} className="mx-auto text-gray-400 mb-4" />
							<p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
							<button
								onClick={() => setShowAddForm(true)}
								className="text-blue-600 hover:text-blue-700 font-medium">
								Agregar tu primera dirección
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{addresses.map((address: any) => (
								<div
									key={address.address_id}
									className={`p-4 border-2 rounded-lg ${
										address.is_primary
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 bg-white'
									}`}>
									{address.is_primary && (
										<div className="flex items-center gap-2 text-blue-600 mb-2">
											<IoCheckmarkCircle size={20} />
											<span className="text-sm font-semibold">
												Dirección Principal
											</span>
										</div>
									)}

									<p className="font-semibold">{address.address_line1}</p>
									{address.address_line2 && (
										<p className="text-sm text-gray-600">
											{address.address_line2}
										</p>
									)}
									<p className="text-sm text-gray-600">
										{address.cities?.city_name}
										{address.cities?.province_states && (
											<>
												,{' '}
												{address.cities.province_states.province_state_name}
											</>
										)}
									</p>
									<p className="text-sm text-gray-600">
										CP: {address.postal_code}
									</p>

									<div className="mt-3 flex gap-2">
										<button
											onClick={() => {
												setEditingAddress(address);
												setShowAddForm(false);
											}}
											className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">
											<IoCreateOutline size={16} />
											Editar
										</button>
										<button
											onClick={() => {
												toast.info('Funcionalidad próximamente');
											}}
											className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer">
											<IoTrashOutline size={16} />
											Eliminar
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};
