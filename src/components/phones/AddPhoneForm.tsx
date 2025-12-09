'use client';

import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	Switch,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import { IoAdd, IoClose, IoSearch } from 'react-icons/io5';
import { toast } from 'sonner';

import { CustomSelect } from '@/components';
import { useSearch } from '@/hooks';
import { Phone, PhoneType } from '@/interfaces';

import { createOrUpdatePhone } from '@/actions/users/create-update-phone';
import { searchPhones } from '@/actions/users/phone-search';
import { searchPhoneTypes } from '@/actions/users/phone-type-search';

interface Props {
	phones: Phone[];
	onPhonesChange: (phones: Phone[]) => void;
	phoneTypes?: PhoneType[];
	personId?: number;
}

interface PhoneFormData {
	phone_type_id: number;
	phone_number: string;
	is_primary: boolean;
	state: string;
}

type ModalMode = 'create' | 'search';

export const AddPhoneForm = ({ phones, onPhonesChange, phoneTypes = [], personId }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<ModalMode>('create');
	const [editingId, setEditingId] = useState<number | null>(null);

	const [formData, setFormData] = useState<PhoneFormData>({
		phone_type_id: 0,
		phone_number: '',
		is_primary: false,
		state: 'A',
	});

	const {
		results: existingPhones,
		handleSearch: handlePhoneSearch,
		isLoading: isLoadingPhones,
	} = useSearch({
		initialData: [],
		searchAction: searchPhones,
		debounceMs: 500,
	});

	const {
		results: phoneTypeOptions,
		handleSearch: handlePhoneTypeSearch,
		isLoading: isLoadingPhoneTypes,
	} = useSearch({
		initialData: phoneTypes,
		searchAction: searchPhoneTypes,
		debounceMs: 500,
	});

	const handleAddPhone = () => {
		let updatedPhones = phones;
		if (formData.is_primary) {
			updatedPhones = phones.map((phone) => ({
				...phone,
				is_primary: false,
			}));
		}

		const newPhone: Phone = {
			phone_id: Date.now(),
			...formData,
			created_at: new Date(),
			updated_at: new Date(),
		};

		onPhonesChange([...updatedPhones, newPhone]);
		setIsModalOpen(false);

		// Reset form
		setFormData({
			phone_type_id: 0,
			phone_number: '',
			is_primary: false,
			state: 'A',
		});
	};

	const handleRemovePhone = (phone_id: number) => {
		onPhonesChange(phones.filter((p) => p.phone_id !== phone_id));
		toast.success('Teléfono eliminado correctamente');
	};

	const handleSetPrimary = (phone_id: number) => {
		const updatedPhones = phones.map((phone) => ({
			...phone,
			is_primary: phone.phone_id === phone_id,
		}));
		onPhonesChange(updatedPhones);
		toast.success('Teléfono principal actualizado');

		// Todo: Persistir cambio en el backend
	};

	const handleAddExistingPhone = (existingPhone: Phone) => {
		// Verificar si el teléfono ya está agregado
		if (phones.some((p) => p.phone_id === existingPhone.phone_id)) {
			toast.error('Este teléfono ya está agregado');
			return;
		}

		let updatedPhones = phones;
		if (existingPhone.is_primary) {
			updatedPhones = phones.map((phone) => ({
				...phone,
				is_primary: false,
			}));
		}

		onPhonesChange([...updatedPhones, existingPhone]);
		setIsModalOpen(false);
	};

	const handleEditPhone = (phone: Phone) => {
		setEditingId(phone.phone_id);
		setFormData({
			phone_type_id: phone.phone_type_id,
			phone_number: phone.phone_number,
			is_primary: phone.is_primary,
			state: phone.state,
		});
		setModalMode('create');
		setIsModalOpen(true);
	};

	const handleUpdatePhone = async () => {
		if (!editingId) return;

		let updatedPhones = phones.map((phone) => {
			if (phone.phone_id === editingId) {
				return {
					...phone,
					...formData,
					updated_at: new Date(),
				};
			}
			return phone;
		});

		if (formData.is_primary) {
			updatedPhones = updatedPhones.map((phone) => ({
				...phone,
				is_primary: phone.phone_id === editingId,
			}));
		}

		onPhonesChange(updatedPhones);
		setIsModalOpen(false);
		setEditingId(null);

		// Solo persistir si hay person_id (usuario ya existe)
		if (personId) {
			const formDataToSend = new FormData();
			formDataToSend.append('phone_id', editingId.toString());
			formDataToSend.append('person_id', personId.toString());
			formDataToSend.append('phone_number', formData.phone_number);
			formDataToSend.append('phone_type_id', formData.phone_type_id.toString());
			formDataToSend.append('is_primary', formData.is_primary.toString());
			formDataToSend.append('state', formData.state);

			const { success, message } = await createOrUpdatePhone(formDataToSend);

			if (success) {
				toast.success(message || 'Teléfono actualizado correctamente');
			} else {
				toast.error(message || 'Error al actualizar el teléfono');
			}
		} else {
			toast.success('Teléfono actualizado correctamente (se guardará al crear el usuario)');
		}

		// Reset form
		setFormData({
			phone_type_id: 0,
			phone_number: '',
			is_primary: false,
			state: 'A',
		});
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setModalMode('create');
		setEditingId(null);
		// Reset form
		setFormData({
			phone_type_id: 0,
			phone_number: '',
			is_primary: false,
			state: 'A',
		});
	};

	return (
		<div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-bold text-gray-800">Teléfonos</h3>
				<button
					type="button"
					onClick={() => {
						setModalMode('create');
						setIsModalOpen(true);
					}}
					className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
					<IoAdd size={18} />
					Agregar
				</button>
			</div>

			{/* Lista scrolleable de teléfonos */}
			<div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
				{phones.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p className="text-sm">No hay teléfonos agregados</p>
						<p className="text-xs mt-1">
							Haz clic en "Agregar" para añadir un teléfono
						</p>
					</div>
				) : (
					phones.map((phone) => {
						const phoneTypeName =
							phone.phone_types?.type_name ||
							phoneTypeOptions.find((pt) => pt.phone_type_id === phone.phone_type_id)
								?.type_name ||
							'N/A';

						return (
							<div
								key={phone.phone_id}
								className={`relative bg-linear-to-br from-white to-gray-50 border-2 rounded-lg p-3 shadow-sm hover:shadow-md transition-all ${
									phone.is_primary
										? 'border-blue-400 bg-blue-50/30'
										: 'border-gray-200 hover:border-blue-300'
								}`}>
								<button
									type="button"
									onClick={() => handleRemovePhone(phone.phone_id)}
									className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors cursor-pointer">
									<IoClose size={16} />
								</button>
								<div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pr-7">
									<div className="flex flex-col">
										<span className="text-[10px] font-semibold text-gray-500 uppercase">
											Tipo
										</span>
										<span className="text-sm font-medium text-gray-800">
											{phoneTypeName}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-[10px] font-semibold text-gray-500 uppercase">
											Número
										</span>
										<span className="text-sm font-medium text-gray-800">
											{phone.phone_number}
										</span>
									</div>
								</div>
								{/* Botón para establecer como principal */}
								{!phone.is_primary && (
									<div className="mt-2 pt-2 border-t border-gray-200 flex gap-2">
										<button
											type="button"
											onClick={() => handleEditPhone(phone)}
											className="text-xs text-gray-600 hover:text-gray-700 font-medium hover:underline">
											Editar
										</button>
										<span className="text-gray-300">|</span>
										<button
											type="button"
											onClick={() => handleSetPrimary(phone.phone_id)}
											className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
											Establecer como principal
										</button>
									</div>
								)}{' '}
								{/* Indicador de teléfono principal */}
								{phone.is_primary && (
									<div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
										<span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
											★ Principal
										</span>
										<button
											type="button"
											onClick={() => handleEditPhone(phone)}
											className="text-xs text-gray-600 hover:text-gray-700 font-medium hover:underline">
											Editar
										</button>
									</div>
								)}
							</div>
						);
					})
				)}
			</div>

			{/* Modal para agregar o buscar teléfono */}
			<Dialog
				open={isModalOpen}
				onClose={handleCloseModal}
				maxWidth="md"
				fullWidth
				PaperProps={{
					className: 'rounded-xl',
				}}>
				<DialogTitle className="flex items-center justify-between bg-linear-to-r from-blue-50 to-blue-100 border-b border-blue-200">
					<div>
						<h2 className="text-xl font-bold text-gray-800">
							{editingId
								? 'Editar Teléfono'
								: modalMode === 'create'
								? 'Agregar Nuevo Teléfono'
								: 'Buscar Teléfono Existente'}
						</h2>
						<p className="text-sm text-gray-600 mt-1">
							{editingId
								? 'Modifique la información del teléfono'
								: modalMode === 'create'
								? 'Complete la información del número de teléfono'
								: 'Busque y seleccione un teléfono existente'}
						</p>
					</div>
					<IconButton
						onClick={handleCloseModal}
						className="hover:bg-blue-200 transition-colors">
						<IoClose size={24} />
					</IconButton>
				</DialogTitle>
				<DialogContent className="pt-4 pb-4">
					{/* Toggle entre crear y buscar - ocultar cuando se está editando */}
					{!editingId && (
						<div className="flex gap-2 mb-6 mt-4 p-1 bg-gray-100 rounded-lg">
							<button
								type="button"
								onClick={() => setModalMode('create')}
								className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
									modalMode === 'create'
										? 'bg-white text-blue-600 shadow-sm'
										: 'text-gray-600 hover:text-gray-800'
								}`}>
								<IoAdd className="inline mr-2" />
								Crear Nuevo
							</button>
							<button
								type="button"
								onClick={() => setModalMode('search')}
								className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
									modalMode === 'search'
										? 'bg-white text-blue-600 shadow-sm'
										: 'text-gray-600 hover:text-gray-800'
								}`}>
								<IoSearch className="inline mr-2" />
								Buscar Existente
							</button>
						</div>
					)}

					{/* Modo: Crear nuevo teléfono */}
					{modalMode === 'create' && (
						<div className={`space-y-5 ${editingId ? 'mt-4' : ''}`}>
							{/* Tipo de Teléfono */}
							<CustomSelect
								className="w-full"
								label="Tipo de Teléfono"
								value={formData.phone_type_id || ''}
								onChange={(value) =>
									setFormData({ ...formData, phone_type_id: value as number })
								}
								onSearch={handlePhoneTypeSearch}
								loading={isLoadingPhoneTypes}
								options={phoneTypeOptions.map((phoneType) => ({
									value: phoneType.phone_type_id,
									label: phoneType.type_name,
								}))}
								required
								clearable
							/>

							{/* Número de Teléfono */}
							<TextField
								label="Número de Teléfono"
								variant="filled"
								fullWidth
								value={formData.phone_number}
								onChange={(e) => {
									const value = e.target.value.replace(/[^0-9]/g, '');
									setFormData({ ...formData, phone_number: value });
								}}
								inputProps={{ maxLength: 15 }}
								helperText="Solo números, mínimo 10 dígitos"
								required
							/>

							{/* Teléfono Principal */}
							<div className="border-t border-gray-200 pt-4">
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
									<div className="flex-1">
										<p className="font-medium text-gray-700">
											Teléfono Principal
										</p>
										<p className="text-sm text-gray-500 mt-1">
											{formData.is_primary
												? 'Este será el número de contacto principal'
												: 'No será el número de contacto principal'}
										</p>
									</div>
									<div className="flex items-center gap-3">
										<span
											className={`text-sm font-medium ${
												formData.is_primary
													? 'text-blue-600'
													: 'text-gray-400'
											}`}>
											{formData.is_primary ? 'Sí' : 'No'}
										</span>
										<Switch
											checked={formData.is_primary}
											onChange={(e) => {
												setFormData({
													...formData,
													is_primary: e.target.checked,
												});
											}}
											slotProps={{
												input: { 'aria-label': 'Teléfono principal' },
											}}
										/>
									</div>
								</div>
							</div>

							{/* Estado */}
							<div className="border-t border-gray-200 pt-4">
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
									<div className="flex-1">
										<p className="font-medium text-gray-700">
											Estado del teléfono
										</p>
										<p className="text-sm text-gray-500 mt-1">
											{formData.state === 'A'
												? 'El teléfono estará activo'
												: 'El teléfono estará desactivado'}
										</p>
									</div>
									<div className="flex items-center gap-3">
										<span
											className={`text-sm font-medium ${
												formData.state === 'A'
													? 'text-green-600'
													: 'text-gray-400'
											}`}>
											{formData.state === 'A' ? 'Activo' : 'Inactivo'}
										</span>
										<Switch
											checked={formData.state === 'A'}
											onChange={(e) => {
												setFormData({
													...formData,
													state: e.target.checked ? 'A' : 'I',
												});
											}}
											slotProps={{
												input: { 'aria-label': 'Estado del teléfono' },
											}}
										/>
									</div>
								</div>
							</div>

							{/* Botones */}
							<div className="flex gap-3 pt-2 border-t border-gray-200">
								<button
									type="button"
									onClick={editingId ? handleUpdatePhone : handleAddPhone}
									disabled={
										!formData.phone_type_id || formData.phone_number.length < 10
									}
									className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
									{editingId ? 'Actualizar' : 'Agregar'}
								</button>
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
									Cancelar
								</button>
							</div>
						</div>
					)}

					{/* Modo: Buscar teléfono existente */}
					{modalMode === 'search' && (
						<div className="space-y-4">
							{/* Buscador */}
							<TextField
								label="Buscar teléfono"
								variant="filled"
								fullWidth
								onChange={(e) => handlePhoneSearch(e.target.value)}
								placeholder="Busque por número o tipo de teléfono..."
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<IoSearch className="text-gray-400" size={20} />
										</InputAdornment>
									),
								}}
							/>{' '}
							{/* Lista de resultados scrolleable */}
							<div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
								{isLoadingPhones && (
									<div className="text-center py-8 text-gray-500">
										<p className="text-sm">Buscando teléfonos...</p>
									</div>
								)}

								{!isLoadingPhones && existingPhones.length === 0 && (
									<div className="text-center py-8 text-gray-500">
										<p className="text-sm">No se encontraron teléfonos</p>
										<p className="text-xs mt-1">
											Intente con otros términos de búsqueda
										</p>
									</div>
								)}

								{!isLoadingPhones &&
									existingPhones.map((phone) => {
										const phoneTypeName =
											phone.phone_types?.type_name ||
											phoneTypeOptions.find(
												(pt) => pt.phone_type_id === phone.phone_type_id
											)?.type_name ||
											'N/A';
										const isAlreadyAdded = phones.some(
											(p) => p.phone_id === phone.phone_id
										);

										return (
											<div
												key={phone.phone_id}
												className={`relative bg-linear-to-br from-white to-gray-50 border-2 rounded-lg p-3 shadow-sm transition-all ${
													isAlreadyAdded
														? 'border-gray-300 opacity-50'
														: 'border-gray-200 hover:border-blue-300 hover:shadow-md'
												}`}>
												<div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
													<div className="flex flex-col">
														<span className="text-[10px] font-semibold text-gray-500 uppercase">
															Tipo
														</span>
														<span className="text-sm font-medium text-gray-800">
															{phoneTypeName}
														</span>
													</div>
													<div className="flex flex-col">
														<span className="text-[10px] font-semibold text-gray-500 uppercase">
															Número
														</span>
														<span className="text-sm font-medium text-gray-800">
															{phone.phone_number}
														</span>
													</div>
												</div>

												{/* Botón para agregar */}
												<div className="mt-2 pt-2 border-t border-gray-200">
													{isAlreadyAdded ? (
														<span className="text-xs text-gray-500 italic">
															Ya agregado
														</span>
													) : (
														<button
															type="button"
															onClick={() =>
																handleAddExistingPhone(phone)
															}
															className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
															+ Agregar este teléfono
														</button>
													)}
												</div>
											</div>
										);
									})}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};
