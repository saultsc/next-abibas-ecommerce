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
import { Address, Country } from '@/interfaces';

import { searchAddresses } from '@/actions/address/address-search';
import { searchCities } from '@/actions/address/city-search';
import { searchCountries } from '@/actions/address/country-search';
import { createOrUpdateAddress } from '@/actions/address/create-update-address';
import { searchProvinces } from '@/actions/address/province-state-seatch';

interface Props {
	addresses: Address[];
	onAddressesChange: (addresses: Address[]) => void;
	countries?: Country[];
	personId?: number;
}

interface AddressFormData {
	country_id: number;
	province_id: number;
	city_id: number;
	address_line1: string;
	address_line2?: string;
	postal_code: string;
	is_primary: boolean;
	state: string;
}

type ModalMode = 'create' | 'search';

export const AddAddressForm = ({
	addresses,
	onAddressesChange,
	countries = [],
	personId,
}: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<ModalMode>('create');
	const [editingId, setEditingId] = useState<number | null>(null);

	const [formData, setFormData] = useState<AddressFormData>({
		country_id: 0,
		province_id: 0,
		city_id: 0,
		address_line1: '',
		address_line2: '',
		postal_code: '',
		is_primary: false,
		state: 'A',
	});

	// Hook de búsqueda para direcciones existentes
	const {
		results: existingAddresses,
		handleSearch: handleAddressSearch,
		isLoading: isLoadingAddresses,
	} = useSearch({
		initialData: [],
		searchAction: searchAddresses,
		debounceMs: 500,
	});

	// Hook de búsqueda para países
	const {
		results: countryOptions,
		handleSearch: handleCountrySearch,
		isLoading: isLoadingCountries,
	} = useSearch({
		initialData: countries,
		searchAction: searchCountries,
		debounceMs: 500,
	});

	// Hook de búsqueda para provincias (filtradas por país)
	const {
		results: provinceOptions,
		handleSearch: handleProvinceSearchBase,
		isLoading: isLoadingProvinces,
		setResults: setProvinceOptions,
	} = useSearch({
		initialData: [],
		searchAction: (term: string) => searchProvinces(term, formData.country_id),
		debounceMs: 500,
	});

	// Hook de búsqueda para ciudades (filtradas por provincia)
	const {
		results: cityOptions,
		handleSearch: handleCitySearchBase,
		isLoading: isLoadingCities,
		setResults: setCityOptions,
	} = useSearch({
		initialData: [],
		searchAction: (term: string) => searchCities(term, formData.province_id),
		debounceMs: 500,
	});

	// Paginación eliminada - ahora usamos scroll

	// Wrapper para búsqueda de provincias que valida si hay país seleccionado
	const handleProvinceSearch = (term: string) => {
		if (!formData.country_id) {
			setProvinceOptions([]);
			return;
		}
		// Buscar provincias del país seleccionado
		searchProvinces(term, formData.country_id).then((response) => {
			if (response.success && response.data) {
				setProvinceOptions(response.data);
			}
		});
	};

	// Wrapper para búsqueda de ciudades que valida si hay provincia seleccionada
	const handleCitySearch = (term: string) => {
		if (!formData.province_id) {
			setCityOptions([]);
			return;
		}
		// Buscar ciudades de la provincia seleccionada
		searchCities(term, formData.province_id).then((response) => {
			if (response.success && response.data) {
				setCityOptions(response.data);
			}
		});
	};

	// Manejar cambio de país
	const handleCountryChange = (value: string | number | '') => {
		const countryId = value ? (value as number) : 0;
		setFormData({
			...formData,
			country_id: countryId,
			province_id: 0,
			city_id: 0,
		});
		// Limpiar opciones de provincia y ciudad
		setProvinceOptions([]);
		setCityOptions([]);
		// Si se seleccionó un país, cargar sus provincias
		if (countryId) {
			searchProvinces('', countryId).then((response) => {
				if (response.success && response.data) {
					setProvinceOptions(response.data);
				}
			});
		}
	};

	// Manejar cambio de provincia
	const handleProvinceChange = (value: string | number | '') => {
		const provinceId = value ? (value as number) : 0;
		setFormData({
			...formData,
			province_id: provinceId,
			city_id: 0,
		});
		// Limpiar opciones de ciudad
		setCityOptions([]);
		// Si se seleccionó una provincia, cargar sus ciudades
		if (provinceId) {
			searchCities('', provinceId).then((response) => {
				if (response.success && response.data) {
					setCityOptions(response.data);
				}
			});
		}
	};

	const handleAddAddress = () => {
		let updatedAddresses = addresses;
		if (formData.is_primary) {
			updatedAddresses = addresses.map((address) => ({
				...address,
				is_primary: false,
			}));
		}

		const selectedCity = cityOptions.find((c) => c.city_id === formData.city_id);

		const newAddress: Address = {
			address_id: Date.now(),
			...formData,
			cities: selectedCity,
			created_at: new Date(),
			updated_at: new Date(),
			person_id: 0, // Temporal, se asignará al guardar en BD
		};

		onAddressesChange([...updatedAddresses, newAddress]);
		setIsModalOpen(false);

		// Reset form
		setFormData({
			country_id: 0,
			province_id: 0,
			city_id: 0,
			address_line1: '',
			address_line2: '',
			postal_code: '',
			is_primary: false,
			state: 'A',
		});
		setProvinceOptions([]);
		setCityOptions([]);
	};

	const handleRemoveAddress = (address_id: number) => {
		onAddressesChange(addresses.filter((a) => a.address_id !== address_id));
		toast.success('Dirección eliminada correctamente');
	};

	const handleSetPrimary = (address_id: number) => {
		const updatedAddresses = addresses.map((address) => ({
			...address,
			is_primary: address.address_id === address_id,
		}));
		onAddressesChange(updatedAddresses);

		// TODO: Update primary address in the backend
		toast.success('Dirección principal actualizada');
	};

	const handleAddExistingAddress = (existingAddress: Address) => {
		// Verificar si la dirección ya está agregada
		if (addresses.some((a) => a.address_id === existingAddress.address_id)) {
			toast.error('Esta dirección ya está agregada');
			return;
		}

		let updatedAddresses = addresses;
		if (existingAddress.is_primary) {
			updatedAddresses = addresses.map((address) => ({
				...address,
				is_primary: false,
			}));
		}

		onAddressesChange([...updatedAddresses, existingAddress]);
		setIsModalOpen(false);
	};

	const handleEditAddress = (address: Address) => {
		setEditingId(address.address_id);
		setFormData({
			country_id: address.city_id ? address.cities?.provinces?.country_id || 0 : 0,
			province_id: address.city_id ? address.cities?.province_id || 0 : 0,
			city_id: address.city_id || 0,
			address_line1: address.address_line1,
			address_line2: address.address_line2 || '',
			postal_code: address.postal_code,
			is_primary: address.is_primary,
			state: address.state,
		});

		// Cargar provincias y ciudades si existen
		if (address.cities?.provinces?.country_id) {
			searchProvinces('', address.cities.provinces.country_id).then((response) => {
				if (response.success && response.data) {
					setProvinceOptions(response.data);
				}
			});
		}
		if (address.cities?.province_id) {
			searchCities('', address.cities.province_id).then((response) => {
				if (response.success && response.data) {
					setCityOptions(response.data);
				}
			});
		}

		setModalMode('create');
		setIsModalOpen(true);
	};

	const handleUpdateAddress = async () => {
		if (!editingId) return;

		let updatedAddresses = addresses.map((address) => {
			if (address.address_id === editingId) {
				const selectedCity = cityOptions.find((c) => c.city_id === formData.city_id);
				return {
					...address,
					...formData,
					cities: selectedCity,
					updated_at: new Date(),
				};
			}
			return address;
		});

		if (formData.is_primary) {
			updatedAddresses = updatedAddresses.map((address) => ({
				...address,
				is_primary: address.address_id === editingId,
			}));
		}

		onAddressesChange(updatedAddresses);
		setIsModalOpen(false);
		setEditingId(null);

		// Solo persistir si hay person_id (usuario ya existe)
		if (personId) {
			const formDataToSend = new FormData();
			formDataToSend.append('address_id', editingId.toString());
			formDataToSend.append('person_id', personId.toString());
			formDataToSend.append('city_id', formData.city_id.toString());
			formDataToSend.append('address_line1', formData.address_line1);
			if (formData.address_line2) {
				formDataToSend.append('address_line2', formData.address_line2);
			}
			formDataToSend.append('postal_code', formData.postal_code);
			formDataToSend.append('is_primary', formData.is_primary.toString());
			formDataToSend.append('state', formData.state);

			const { success, message } = await createOrUpdateAddress(formDataToSend);

			if (success) {
				toast.success(message || 'Dirección actualizada correctamente');
			} else {
				toast.error(message || 'Error al actualizar la dirección');
			}
		} else {
			toast.success('Dirección actualizada correctamente (se guardará al crear el usuario)');
		}

		// Reset form
		setFormData({
			country_id: 0,
			province_id: 0,
			city_id: 0,
			address_line1: '',
			address_line2: '',
			postal_code: '',
			is_primary: false,
			state: 'A',
		});
		setProvinceOptions([]);
		setCityOptions([]);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setModalMode('create');
		setEditingId(null);
		// Reset form cuando se cierra
		setFormData({
			country_id: 0,
			province_id: 0,
			city_id: 0,
			address_line1: '',
			address_line2: '',
			postal_code: '',
			is_primary: false,
			state: 'A',
		});
	};

	return (
		<div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-bold text-gray-800">Direcciones</h3>
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

			{/* Lista scrolleable de direcciones */}
			<div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
				{addresses.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p className="text-sm">No hay direcciones agregadas</p>
						<p className="text-xs mt-1">
							Haz clic en "Agregar" para añadir una dirección
						</p>
					</div>
				) : (
					addresses.map((address) => {
						const cityName = address.cities?.city_name || 'N/A';
						const provinceName = address.cities?.provinces?.province_name || 'N/A';
						const countryName =
							address.cities?.provinces?.countries?.country_name || 'N/A';

						return (
							<div
								key={address.address_id}
								className={`relative bg-linear-to-br from-white to-gray-50 border-2 rounded-lg p-3 shadow-sm hover:shadow-md transition-all ${
									address.is_primary
										? 'border-blue-400 bg-blue-50/30'
										: 'border-gray-200 hover:border-blue-300'
								}`}>
								<button
									type="button"
									onClick={() => handleRemoveAddress(address.address_id)}
									className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors cursor-pointer">
									<IoClose size={16} />
								</button>
								<div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pr-7">
									<div className="flex flex-col col-span-2">
										<span className="text-[10px] font-semibold text-gray-500 uppercase">
											Dirección
										</span>
										<span className="text-sm font-medium text-gray-800">
											{address.address_line1}
										</span>
										{address.address_line2 && (
											<span className="text-xs text-gray-600">
												{address.address_line2}
											</span>
										)}
									</div>
									<div className="flex flex-col">
										<span className="text-[10px] font-semibold text-gray-500 uppercase">
											País
										</span>
										<span className="text-sm font-medium text-gray-800">
											{countryName}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-[10px] font-semibold text-gray-500 uppercase">
											Provincia
										</span>
										<span className="text-sm font-medium text-gray-800">
											{provinceName}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-[10px] font-semibold text-gray-500 uppercase">
											Ciudad
										</span>
										<span className="text-sm font-medium text-gray-800">
											{cityName}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-[10px] font-semibold text-gray-500 uppercase">
											Código Postal
										</span>
										<span className="text-sm font-medium text-gray-800">
											{address.postal_code}
										</span>
									</div>
								</div>
								{/* Botón para establecer como principal */}
								{!address.is_primary && (
									<div className="mt-2 pt-2 border-t border-gray-200 flex gap-2">
										<button
											type="button"
											onClick={() => handleEditAddress(address)}
											className="text-xs text-gray-600 hover:text-gray-700 font-medium hover:underline">
											Editar
										</button>
										<span className="text-gray-300">|</span>
										<button
											type="button"
											onClick={() => handleSetPrimary(address.address_id)}
											className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
											Establecer como principal
										</button>
									</div>
								)}{' '}
								{/* Indicador de dirección principal */}
								{address.is_primary && (
									<div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
										<span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
											★ Principal
										</span>
										<button
											type="button"
											onClick={() => handleEditAddress(address)}
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

			{/* Modal para agregar o buscar dirección */}
			<Dialog
				open={isModalOpen}
				onClose={handleCloseModal}
				maxWidth="lg"
				fullWidth
				PaperProps={{
					className: 'rounded-xl',
				}}>
				<DialogTitle className="flex items-center justify-between bg-linear-to-r from-blue-50 to-blue-100 border-b border-blue-200">
					<div>
						<h2 className="text-xl font-bold text-gray-800">
							{editingId
								? 'Editar Dirección'
								: modalMode === 'create'
								? 'Agregar Nueva Dirección'
								: 'Buscar Dirección Existente'}
						</h2>
						<p className="text-sm text-gray-600 mt-1">
							{editingId
								? 'Modifique la información de la dirección'
								: modalMode === 'create'
								? 'Complete la información de la dirección'
								: 'Busque y seleccione una dirección existente'}
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
								Crear Nueva
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

					{/* Modo: Crear nueva dirección */}
					{modalMode === 'create' && (
						<div className={`space-y-5 ${editingId ? 'mt-4' : ''}`}>
							{/* Ubicación - Primera fila */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* País */}
								<CustomSelect
									className="w-full"
									label="País"
									value={formData.country_id || ''}
									onChange={handleCountryChange}
									onSearch={handleCountrySearch}
									loading={isLoadingCountries}
									options={countryOptions.map((country) => ({
										value: country.country_id,
										label: `${country.country_name} (${country.country_code})`,
									}))}
									required
									clearable
								/>
								{/* Provincia */}
								<CustomSelect
									className="w-full"
									label="Provincia / Estado"
									value={formData.province_id || ''}
									onChange={handleProvinceChange}
									onSearch={handleProvinceSearch}
									loading={isLoadingProvinces}
									options={provinceOptions.map((province) => ({
										value: province.province_id,
										label: province.province_name,
									}))}
									required
									clearable
									disabled={!formData.country_id}
									helperText={
										!formData.country_id
											? 'Primero seleccione un país'
											: undefined
									}
								/>
							</div>

							{/* Ciudad y Código Postal - Segunda fila */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Ciudad */}
								<CustomSelect
									className="w-full"
									label="Ciudad"
									value={formData.city_id || ''}
									onChange={(value) =>
										setFormData({ ...formData, city_id: value as number })
									}
									onSearch={handleCitySearch}
									loading={isLoadingCities}
									options={cityOptions.map((city) => ({
										value: city.city_id,
										label: city.city_name,
									}))}
									required
									clearable
									disabled={!formData.province_id}
									helperText={
										!formData.province_id
											? 'Primero seleccione una provincia'
											: undefined
									}
								/>
								{/* Código Postal */}
								<TextField
									label="Código Postal"
									variant="filled"
									fullWidth
									value={formData.postal_code}
									onChange={(e) => {
										const value = e.target.value.replace(/[^0-9A-Za-z-]/g, '');
										setFormData({ ...formData, postal_code: value });
									}}
									inputProps={{ maxLength: 20 }}
									helperText="Código postal de la dirección"
									required
								/>
							</div>

							{/* Dirección Línea 1 */}
							<TextField
								label="Dirección Línea 1"
								variant="filled"
								fullWidth
								multiline
								rows={2}
								value={formData.address_line1}
								onChange={(e) =>
									setFormData({ ...formData, address_line1: e.target.value })
								}
								inputProps={{ maxLength: 200 }}
								helperText="Calle, número, etc."
								required
							/>

							{/* Dirección Línea 2 */}
							<TextField
								label="Dirección Línea 2 (Opcional)"
								variant="filled"
								fullWidth
								multiline
								rows={2}
								value={formData.address_line2}
								onChange={(e) =>
									setFormData({ ...formData, address_line2: e.target.value })
								}
								inputProps={{ maxLength: 200 }}
								helperText="Apartamento, suite, etc."
							/>

							{/* Dirección Principal y Estado - Horizontal */}
							<div className="border-t border-gray-200 pt-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Dirección Principal */}
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
										<div className="flex-1">
											<p className="font-medium text-gray-700">
												Dirección Principal
											</p>
											<p className="text-sm text-gray-500 mt-1">
												{formData.is_primary
													? 'Esta será la dirección principal'
													: 'No será la dirección principal'}
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
													input: { 'aria-label': 'Dirección principal' },
												}}
											/>
										</div>
									</div>

									{/* Estado */}
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
										<div className="flex-1">
											<p className="font-medium text-gray-700">
												Estado de la dirección
											</p>
											<p className="text-sm text-gray-500 mt-1">
												{formData.state === 'A'
													? 'La dirección estará activa'
													: 'La dirección estará desactivada'}
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
													input: {
														'aria-label': 'Estado de la dirección',
													},
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Botones */}
							<div className="flex gap-3 pt-2 border-t border-gray-200">
								<button
									type="button"
									onClick={editingId ? handleUpdateAddress : handleAddAddress}
									disabled={
										!formData.city_id ||
										!formData.address_line1 ||
										!formData.postal_code
									}
									className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
									{editingId ? 'Actualizar' : 'Agregar'}
								</button>
								<button
									type="button"
									onClick={handleCloseModal}
									className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
									Cancelar
								</button>
							</div>
						</div>
					)}

					{/* Modo: Buscar dirección existente */}
					{modalMode === 'search' && (
						<div className="space-y-4">
							{/* Buscador */}
							<TextField
								label="Buscar dirección"
								variant="filled"
								fullWidth
								onChange={(e) => handleAddressSearch(e.target.value)}
								placeholder="Busque por calle, ciudad, provincia o país..."
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
								{isLoadingAddresses && (
									<div className="text-center py-8 text-gray-500">
										<p className="text-sm">Buscando direcciones...</p>
									</div>
								)}

								{!isLoadingAddresses && existingAddresses.length === 0 && (
									<div className="text-center py-8 text-gray-500">
										<p className="text-sm">No se encontraron direcciones</p>
										<p className="text-xs mt-1">
											Intente con otros términos de búsqueda
										</p>
									</div>
								)}

								{!isLoadingAddresses &&
									existingAddresses.map((address) => {
										const cityName = address.cities?.city_name || 'N/A';
										const provinceName =
											address.cities?.provinces?.province_name || 'N/A';
										const countryName =
											address.cities?.provinces?.countries?.country_name ||
											'N/A';
										const isAlreadyAdded = addresses.some(
											(a) => a.address_id === address.address_id
										);

										return (
											<div
												key={address.address_id}
												className={`relative bg-linear-to-br from-white to-gray-50 border-2 rounded-lg p-3 shadow-sm transition-all ${
													isAlreadyAdded
														? 'border-gray-300 opacity-50'
														: 'border-gray-200 hover:border-blue-300 hover:shadow-md'
												}`}>
												<div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
													<div className="flex flex-col col-span-2">
														<span className="text-[10px] font-semibold text-gray-500 uppercase">
															Dirección
														</span>
														<span className="text-sm font-medium text-gray-800">
															{address.address_line1}
														</span>
														{address.address_line2 && (
															<span className="text-xs text-gray-600">
																{address.address_line2}
															</span>
														)}
													</div>
													<div className="flex flex-col">
														<span className="text-[10px] font-semibold text-gray-500 uppercase">
															País
														</span>
														<span className="text-sm font-medium text-gray-800">
															{countryName}
														</span>
													</div>
													<div className="flex flex-col">
														<span className="text-[10px] font-semibold text-gray-500 uppercase">
															Provincia
														</span>
														<span className="text-sm font-medium text-gray-800">
															{provinceName}
														</span>
													</div>
													<div className="flex flex-col">
														<span className="text-[10px] font-semibold text-gray-500 uppercase">
															Ciudad
														</span>
														<span className="text-sm font-medium text-gray-800">
															{cityName}
														</span>
													</div>
													<div className="flex flex-col">
														<span className="text-[10px] font-semibold text-gray-500 uppercase">
															Código Postal
														</span>
														<span className="text-sm font-medium text-gray-800">
															{address.postal_code}
														</span>
													</div>
												</div>

												{/* Botón para agregar */}
												<div className="mt-2 pt-2 border-t border-gray-200">
													{isAlreadyAdded ? (
														<span className="text-xs text-gray-500 italic">
															Ya agregada
														</span>
													) : (
														<button
															type="button"
															onClick={() =>
																handleAddExistingAddress(address)
															}
															className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
															+ Agregar esta dirección
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
