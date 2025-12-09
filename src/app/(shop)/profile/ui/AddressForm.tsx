'use client';

import { CustomSelect } from '@/components';
import { useSearch } from '@/hooks';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { searchCities } from '@/actions/address/city-search';
import { searchCountries } from '@/actions/address/country-search';
import { createOrUpdateAddress } from '@/actions/address/create-update-address';
import { searchProvinces } from '@/actions/address/province-state-seatch';

interface AddressFormProps {
	personId: number;
	address?: any;
	onSuccess: () => void;
	onCancel: () => void;
}

export const AddressForm = ({ personId, address, onSuccess, onCancel }: AddressFormProps) => {
	const [formData, setFormData] = useState({
		address_line1: address?.address_line1 || '',
		address_line2: address?.address_line2 || '',
		postal_code: address?.postal_code || '',
		country_id: address?.cities?.provinces?.countries?.country_id || 0,
		province_id: address?.cities?.provinces?.province_id || 0,
		city_id: address?.city_id || 0,
		is_primary: address?.is_primary || false,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	// Hook de búsqueda para países
	const {
		results: countryOptions,
		handleSearch: handleCountrySearch,
		isLoading: isLoadingCountries,
		setResults: setCountryOptions,
	} = useSearch({
		initialData: [],
		searchAction: searchCountries,
		debounceMs: 500,
	});

	// Hook de búsqueda para provincias
	const {
		results: provinceOptions,
		handleSearch: handleProvinceSearch,
		isLoading: isLoadingProvinces,
		setResults: setProvinceOptions,
	} = useSearch({
		initialData: [],
		searchAction: (term: string) => searchProvinces(term, formData.country_id),
		debounceMs: 500,
	});

	// Hook de búsqueda para ciudades
	const {
		results: cityOptions,
		handleSearch: handleCitySearch,
		isLoading: isLoadingCities,
		setResults: setCityOptions,
	} = useSearch({
		initialData: [],
		searchAction: (term: string) => searchCities(term, formData.province_id),
		debounceMs: 500,
	});

	// Transformar los resultados a SelectOption[]
	const countrySelectOptions = countryOptions.map((country: any) => ({
		value: country.country_id,
		label: country.country_name,
	}));

	const provinceSelectOptions = provinceOptions.map((province: any) => ({
		value: province.province_id,
		label: province.province_name,
	}));

	const citySelectOptions = cityOptions.map((city: any) => ({
		value: city.city_id,
		label: city.city_name,
	}));

	// Cargar datos iniciales cuando se monta el componente
	useEffect(() => {
		// Si estamos editando, agregar las opciones actuales primero
		if (address) {
			// Agregar país actual
			if (address.cities?.provinces?.countries) {
				setCountryOptions([address.cities.provinces.countries]);
			}

			// Agregar provincia actual
			if (address.cities?.provinces) {
				setProvinceOptions([address.cities.provinces]);
			}

			// Agregar ciudad actual
			if (address.cities) {
				setCityOptions([address.cities]);
			}
		}

		// Luego cargar todos los países disponibles
		searchCountries('').then((response) => {
			if (response.success && response.data) {
				setCountryOptions(response.data);
			}
		});

		if (address) {
			// Cargar provincias del país
			if (address.cities?.provinces?.countries?.country_id) {
				searchProvinces('', address.cities.provinces.countries.country_id).then(
					(response) => {
						if (response.success && response.data) {
							setProvinceOptions(response.data);
						}
					}
				);
			}

			// Cargar ciudades de la provincia
			if (address.cities?.provinces?.province_id) {
				searchCities('', address.cities.provinces.province_id).then((response) => {
					if (response.success && response.data) {
						setCityOptions(response.data);
					}
				});
			}
		}
	}, [address]);

	const handleCountryChange = (value: string | number | '') => {
		const countryId = value ? Number(value) : 0;
		setFormData({
			...formData,
			country_id: countryId,
			province_id: 0,
			city_id: 0,
		});
		setProvinceOptions([]);
		setCityOptions([]);
		// Cargar provincias del país seleccionado
		if (countryId) {
			searchProvinces('', countryId).then((response) => {
				if (response.success && response.data) {
					setProvinceOptions(response.data);
				}
			});
		}
	};

	const handleProvinceChange = (value: string | number | '') => {
		const provinceId = value ? Number(value) : 0;
		setFormData({
			...formData,
			province_id: provinceId,
			city_id: 0,
		});
		setCityOptions([]);
		// Cargar ciudades de la provincia seleccionada
		if (provinceId) {
			searchCities('', provinceId).then((response) => {
				if (response.success && response.data) {
					setCityOptions(response.data);
				}
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.address_line1 || !formData.city_id) {
			toast.error('Por favor completa todos los campos requeridos');
			return;
		}

		setIsSubmitting(true);

		try {
			// Crear FormData con los campos necesarios
			const formDataToSend = new FormData();

			// Solo enviar address_id si estamos editando
			if (address?.address_id) {
				formDataToSend.append('address_id', address.address_id.toString());
			}

			// Campos requeridos
			formDataToSend.append('person_id', personId.toString());
			formDataToSend.append('city_id', formData.city_id.toString());
			formDataToSend.append('address_line1', formData.address_line1);
			formDataToSend.append('postal_code', formData.postal_code);
			formDataToSend.append('is_primary', formData.is_primary.toString());
			formDataToSend.append('state', 'A');

			// Campo opcional
			if (formData.address_line2) {
				formDataToSend.append('address_line2', formData.address_line2);
			}

			const result = await createOrUpdateAddress(formDataToSend);

			if (result.success) {
				toast.success(
					address
						? 'Dirección actualizada exitosamente'
						: 'Dirección agregada exitosamente'
				);
				onSuccess();
			} else {
				toast.error(result.message || 'Error al guardar la dirección');
			}
		} catch (error) {
			toast.error('Error al guardar la dirección');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<div className="space-y-2">
					<CustomSelect
						label="País"
						value={formData.country_id}
						onChange={handleCountryChange}
						onSearch={handleCountrySearch}
						options={countrySelectOptions}
						loading={isLoadingCountries}
						required
					/>
				</div>

				<div className="space-y-2">
					<CustomSelect
						label="Estado/Provincia"
						value={formData.province_id}
						onChange={handleProvinceChange}
						onSearch={handleProvinceSearch}
						options={provinceSelectOptions}
						loading={isLoadingProvinces}
						disabled={!formData.country_id}
						required
					/>
				</div>

				<div className="space-y-2">
					<CustomSelect
						label="Ciudad"
						value={formData.city_id}
						onChange={(value) =>
							setFormData({ ...formData, city_id: value ? Number(value) : 0 })
						}
						onSearch={handleCitySearch}
						options={citySelectOptions}
						loading={isLoadingCities}
						disabled={!formData.province_id}
						required
					/>
				</div>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">
					Código Postal <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					value={formData.postal_code}
					onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
					className="w-full h-[56px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					placeholder="Ej: 12345"
					required
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">
					Dirección Línea 1 <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					value={formData.address_line1}
					onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
					className="w-full h-[56px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					placeholder="Calle, número, colonia..."
					required
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">
					Dirección Línea 2 <span className="text-gray-400 text-xs">(Opcional)</span>
				</label>
				<input
					type="text"
					value={formData.address_line2}
					onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
					className="w-full h-[56px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					placeholder="Departamento, piso, referencias..."
				/>
			</div>

			<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
				<input
					type="checkbox"
					id="is_primary"
					checked={formData.is_primary}
					onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
					className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
				/>
				<label
					htmlFor="is_primary"
					className="text-sm font-medium text-gray-700 cursor-pointer select-none">
					Establecer como dirección principal
				</label>
			</div>

			<div className="flex gap-3 pt-2">
				<button
					type="submit"
					disabled={isSubmitting}
					className="flex-1 h-12 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md">
					{isSubmitting ? (
						<span className="flex items-center justify-center gap-2">
							<svg
								className="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Guardando...
						</span>
					) : address ? (
						'Actualizar Dirección'
					) : (
						'Agregar Dirección'
					)}
				</button>
				<button
					type="button"
					onClick={onCancel}
					disabled={isSubmitting}
					className="flex-1 h-12 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
					Cancelar
				</button>
			</div>
		</form>
	);
};
