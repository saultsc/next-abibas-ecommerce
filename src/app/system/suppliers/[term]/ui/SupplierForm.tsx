'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
	AddAddressForm,
	CustomSelect,
	DeleteButton,
	StateSwitch,
	SystemInfoCard,
} from '@/components';
import { useSearch } from '@/hooks';
import { Address, Country, DocumentType, Party, Phone, PhoneType, Supplier } from '@/interfaces';
import { validateDateOfBirth } from '@/utils';

import { searchDocumentTypes } from '@/actions/document-types/document-type-search';
import { createOrUpdateSupplier } from '@/actions/suppilers/create-update-supplier';

interface Props {
	supplier: Supplier;
	documentTypes: DocumentType[];
	parties: Party[];
	phoneTypes: PhoneType[];
	countries?: Country[];
}

interface FormInputs {
	company_name?: string;
	first_name: string;
	last_name: string;
	date_of_birth?: Date | null;
	document_type_id: number;
	document_number: string;
	email?: string;
	state: string;

	phones?: Phone[];
	addresses?: Address[];
}

export const SupplierForm = (props: Props) => {
	const { supplier, documentTypes, parties, phoneTypes, countries = [] } = props;

	const router = useRouter();

	const isEditMode = !!supplier.supplier_id;

	const [addresses, setAddresses] = useState<Address[]>(supplier.persons?.addresses || []);

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			...supplier,
			company_name: supplier.company_name || '',
			first_name: supplier.persons?.first_name || '',
			last_name: supplier.persons?.last_name || '',
			state: supplier.state ?? 'A',
			email: supplier.persons?.email ?? '',
			date_of_birth: supplier.persons?.date_of_birth ?? null,
			document_type_id: supplier.persons?.document_type_id ?? ('' as any),
			document_number: supplier.persons?.document_number ?? '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { phones, ...supplierToSave } = data;

		if (supplier.supplier_id) {
			formData.append('supplier_id', String(supplier.supplier_id));
		}

		if (supplier.person_id) {
			formData.append('person_id', supplier.person_id.toString());
		}

		if (supplierToSave.company_name) {
			formData.append('company_name', supplierToSave.company_name);
		}

		formData.append('first_name', supplierToSave.first_name);
		formData.append('last_name', supplierToSave.last_name);

		if (supplierToSave.date_of_birth) {
			formData.append('date_of_birth', supplierToSave.date_of_birth.toISOString());
		}

		formData.append('document_type_id', supplierToSave.document_type_id.toString());
		formData.append('document_number', supplierToSave.document_number);

		if (supplierToSave.email) {
			formData.append('email', supplierToSave.email);
		}

		formData.append('state', data.state);

		if (phones && phones.length > 0) {
			formData.append('phones', JSON.stringify(phones));
		}

		const { success, message } = await createOrUpdateSupplier(formData);

		if (!success) {
			toast.error(message);
			return;
		}

		toast.success(message);

		router.replace(`/system/suppliers`);
	};

	const handleDelete = async () => {
		const { success, message } = {} as { success: boolean; message?: string };

		if (!success) {
			toast.error(message || 'No se pudo eliminar el suplidor');
			return;
		}

		toast.success(message || 'Suplidor eliminado exitosamente');
		router.replace('/system/suppliers');
	};

	const {
		results: documentTypeOptions,
		handleSearch: handleDocumentTypeSearch,
		isLoading: isLoadingDocumentTypes,
	} = useSearch<DocumentType>({
		initialData: documentTypes,
		searchAction: searchDocumentTypes,
		debounceMs: 500,
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 mb-6 pb-6">
			{/* Columna Izquierda - Información del Suplidor */}
			<div className="w-[70%] flex flex-col gap-6">
				{/* Sección: Información del Contacto */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Información del Contacto
					</h3>
					<div className="flex flex-col gap-4">
						{/* Nombres y Apellidos */}
						<div className="flex gap-4">
							<TextField
								label="Nombres *"
								variant="filled"
								className="w-full"
								error={!!errors.first_name}
								helperText={errors.first_name?.message}
								{...register('first_name', {
									required: 'Este campo es requerido',
								})}
							/>

							<TextField
								label="Apellidos *"
								variant="filled"
								className="w-full"
								error={!!errors.last_name}
								helperText={errors.last_name?.message}
								{...register('last_name', {
									required: 'Este campo es requerido',
								})}
							/>
						</div>

						{/* Tipo de documento y Número de documento */}
						<div className="flex gap-4">
							<CustomSelect
								className="w-full"
								id="document-type-select"
								label="Tipo de documento"
								value={watch('document_type_id') || ''}
								{...register('document_type_id', {
									required: 'Este campo es requerido',
								})}
								onChange={(value) => {
									setValue(
										'document_type_id',
										value ? Number(value) : ('' as any),
										{
											shouldValidate: true,
										}
									);
								}}
								onSearch={handleDocumentTypeSearch}
								options={documentTypeOptions.map((dt) => ({
									value: dt.document_type_id,
									label: dt.type_name,
								}))}
								error={!!errors.document_type_id}
								helperText={errors.document_type_id?.message}
								clearable
								required
								loading={isLoadingDocumentTypes}
							/>

							<TextField
								label="Número de documento *"
								variant="filled"
								className="w-full"
								disabled={!watch('document_type_id')}
								error={
									!watch('document_type_id') ? false : !!errors.document_number
								}
								helperText={
									!watch('document_type_id')
										? 'Primero selecciona un tipo de documento'
										: errors.document_number?.message
								}
								{...register('document_number', {
									required: 'Este campo es requerido',
								})}
							/>
						</div>

						{/* Email y Fecha de nacimiento */}
						<div className="flex gap-4">
							<TextField
								label="Email"
								variant="filled"
								className="w-full"
								error={!!errors.email}
								helperText={errors.email?.message}
								{...register('email')}
							/>

							<DatePicker
								label="Fecha de nacimiento"
								value={
									watch('date_of_birth') ? dayjs(watch('date_of_birth')) : null
								}
								format="DD/MM/YYYY"
								slotProps={{
									textField: {
										variant: 'filled',
										error: !!errors.date_of_birth,
										helperText: errors.date_of_birth?.message,
										fullWidth: true,
									},
									field: { clearable: true },
								}}
								{...register('date_of_birth', {
									validate: (value) =>
										value ? validateDateOfBirth(value) : true,
								})}
								onChange={(date) =>
									setValue('date_of_birth', date ? dayjs(date).toDate() : null, {
										shouldValidate: true,
									})
								}
							/>
						</div>
					</div>
				</div>

				{/* Sección: Información de la Empresa */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Información de la Empresa (Opcional)
					</h3>
					<div className="flex flex-col gap-4">
						{/* Nombre de la Empresa */}
						<TextField
							label="Nombre de la Empresa / Razón Social"
							variant="filled"
							className="w-full"
							placeholder="Dejar vacío si es persona natural"
							error={!!errors.company_name}
							helperText={
								errors.company_name?.message || 'Opcional: solo para empresas'
							}
							{...register('company_name')}
						/>

						<StateSwitch
							state={watch('state')}
							onStateChange={(newState) => setValue('state', newState)}
							gender="el"
							entityName="suplidor"
						/>
					</div>
				</div>

				{/* Información del Sistema */}
				{supplier.company_name && (
					<SystemInfoCard
						idValue={supplier.supplier_id}
						createdAt={supplier.created_at}
						updatedAt={supplier.updated_at}
					/>
				)}

				{/* Botones */}
				<div className="flex gap-4">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
						Guardar
					</button>

					{supplier.company_name && (
						<DeleteButton onDelete={handleDelete} itemName={supplier.company_name} />
					)}
				</div>
			</div>

			{/* Columna Derecha - Teléfonos y Direcciones */}
			<div className="w-[30%] flex flex-col gap-6 sticky top-4 self-start">
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

				{/* Direcciones */}
				<div className="w-full">
					<AddAddressForm
						addresses={addresses}
						onAddressesChange={setAddresses}
						countries={countries}
					/>
				</div>
			</div>
		</form>
	);
};
