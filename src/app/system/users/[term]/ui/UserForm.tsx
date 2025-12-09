'use client';

import { useRouter } from 'next/navigation';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CustomSelect, DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { useSearch } from '@/hooks';
import { Department, DocumentType, Party, Phone, PhoneType, Role, User } from '@/interfaces';
import { validateDateOfBirth } from '@/utils';

import { searchDocumentTypes } from '@/actions/document-types/document-type-search';
import { searchRoles } from '@/actions/roles/role-search';
import { createOrUpdateUser } from '@/actions/users/create-update-user';
import { searchDepartments } from '@/actions/users/departament-search';

interface Props {
	user: User;
	roles: Role[];
	documentTypes: DocumentType[];
	parties: Party[];
	phoneTypes: PhoneType[];
	departments: Department[];
}

interface FormInputs {
	first_name: string;
	last_name: string;
	date_of_birth: Date;
	document_type_id: number;
	document_number: string;
	email: string;
	hire_date: Date;
	department_id: number;

	username: string;
	password: string;
	confirm_password: string;
	state: string;

	role_id: number;

	phones?: Phone[];
}

export const UserForm = (props: Props) => {
	const { user, documentTypes, departments, roles, parties, phoneTypes } = props;

	const router = useRouter();

	const FAKE_PASSWORD = '••••••••';
	const isEditMode = !!user.user_id;

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormInputs>({
		defaultValues: {
			...user,
			first_name: user.persons?.first_name || '',
			last_name: user.persons?.last_name || '',
			username: user.username || '',
			state: user.state ?? 'A',
			hire_date: user.employees?.hire_date ?? dayjs().toDate(),
			department_id: user.employees?.department_id ?? ('' as any),
			email: user.persons?.email ?? '',
			date_of_birth: user.persons?.date_of_birth ?? (null as any),
			document_type_id: user.persons?.document_type_id ?? ('' as any),
			document_number: user.persons?.document_number ?? '',
			role_id: user.role_id ?? ('' as any),

			password: isEditMode ? FAKE_PASSWORD : '',
			confirm_password: isEditMode ? FAKE_PASSWORD : '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (data: FormInputs) => {
		const formData = new FormData();

		const { phones, confirm_password, ...userToSave } = data;

		if (user.user_id) {
			formData.append('user_id', String(user.user_id));
		}

		formData.append('person_id', user.person_id?.toString());
		formData.append('first_name', userToSave.first_name);
		formData.append('last_name', userToSave.last_name);
		formData.append('date_of_birth', userToSave.date_of_birth.toISOString());
		formData.append('document_type_id', userToSave.document_type_id.toString());
		formData.append('document_number', userToSave.document_number);
		formData.append('email', userToSave.email);
		formData.append('hire_date', userToSave.hire_date.toISOString());
		formData.append('department_id', userToSave.department_id.toString());
		formData.append('username', userToSave.username);

		if (data.password !== FAKE_PASSWORD) {
			formData.append('password', data.password);
		}

		formData.append('state', data.state);
		formData.append('role_id', data.role_id.toString());

		if (phones && phones.length > 0) {
			formData.append('phones', JSON.stringify(phones));
		}

		const { success, message } = await createOrUpdateUser(formData);

		if (!success) {
			toast.error(message);
			return;
		}

		toast.success(message);

		router.replace(`/system/users`);
	};

	const handleDelete = async () => {
		const { success, message } = {} as { success: boolean; message?: string };

		if (!success) {
			toast.error(message || 'No se pudo eliminar el usuario');
			return;
		}

		toast.success(message || 'Usuario eliminado exitosamente');
		router.replace('/system/users');
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

	const {
		results: departmentOptions,
		handleSearch: handleDepartmentSearch,
		isLoading: isLoadingDepartments,
	} = useSearch<Department>({
		initialData: departments,
		searchAction: searchDepartments,
		debounceMs: 500,
	});

	const {
		results: rolesOptions,
		handleSearch: handleRoleSearch,
		isLoading: isLoadingRoles,
	} = useSearch<Role>({
		initialData: roles,
		searchAction: searchRoles,
		debounceMs: 500,
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 mb-6 pb-6">
			{/* Columna Izquierda - Información del Usuario */}
			<div className="w-[70%] flex flex-col gap-6">
				{/* Sección: Información Personal */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Información Personal
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

						{/* Fecha de nacimiento */}
						<div className="flex gap-4">
							<DatePicker
								label="Fecha de nacimiento *"
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
									required: 'Este campo es requerido',
									validate: (value) => validateDateOfBirth(value),
								})}
								onChange={(date) =>
									setValue(
										'date_of_birth',
										date ? dayjs(date).toDate() : (null as any),
										{
											shouldValidate: true,
										}
									)
								}
							/>
							<div className="w-full"></div>
						</div>
					</div>
				</div>

				{/* Sección: Información Laboral */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Información Laboral
					</h3>
					<div className="flex flex-col gap-4">
						{/* Fecha de contratación y Departamento */}
						<div className="flex gap-4">
							<DatePicker
								label="Fecha de contratación *"
								value={watch('hire_date') ? dayjs(watch('hire_date')) : null}
								format="DD/MM/YYYY"
								slotProps={{
									textField: {
										variant: 'filled',
										error: !!errors.hire_date,
										helperText: errors.hire_date?.message,
										fullWidth: true,
									},
									field: { clearable: true },
								}}
								{...register('hire_date', { required: 'Este campo es requerido' })}
								onChange={(date) =>
									setValue(
										'hire_date',
										date ? dayjs(date).toDate() : (null as any),
										{
											shouldValidate: true,
										}
									)
								}
							/>

							<CustomSelect
								className="w-full"
								id="department-select"
								label="Departamento"
								value={watch('department_id') || ''}
								{...register('department_id', {
									required: 'Este campo es requerido',
								})}
								onChange={(value) => {
									setValue('department_id', value ? Number(value) : ('' as any), {
										shouldValidate: true,
									});
								}}
								onSearch={handleDepartmentSearch}
								options={departmentOptions.map((dept) => ({
									value: dept.department_id,
									label: dept.department_name,
								}))}
								error={!!errors.department_id}
								helperText={errors.department_id?.message}
								clearable
								required
								loading={isLoadingDepartments}
							/>
						</div>

						{/* Email*/}
						<div className="flex gap-4">
							<TextField
								label="Email *"
								variant="filled"
								className="w-full"
								error={!!errors.email}
								helperText={errors.email?.message}
								{...register('email', {
									required: 'Este campo es requerido',
								})}
							/>

							{/* Rol */}
							<CustomSelect
								className="w-full"
								id="role-select"
								label="Rol"
								value={watch('role_id') || ''}
								{...register('role_id', {
									required: 'Este campo es requerido',
								})}
								onChange={(value) => {
									setValue('role_id', value ? Number(value) : ('' as any), {
										shouldValidate: true,
									});
								}}
								onSearch={handleRoleSearch}
								options={rolesOptions.map((role: Role) => ({
									value: role.role_id,
									label: role.role_name,
								}))}
								error={!!errors.role_id}
								helperText={errors.role_id?.message}
								clearable
								required
							/>
						</div>
					</div>
				</div>

				{/* Sección: Acceso al Sistema */}
				<div className="w-full">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">Acceso al Sistema</h3>
					<div className="flex flex-col gap-4">
						{/* Usuario */}
						<TextField
							label="Usuario *"
							variant="filled"
							className="w-full"
							error={!!errors.username}
							helperText={errors.username?.message}
							{...register('username', {
								required: 'Este campo es requerido',
							})}
						/>

						{/* Contraseña */}
						<TextField
							label={
								isEditMode
									? 'Contraseña (dejar sin cambios si no desea modificarla)'
									: 'Contraseña *'
							}
							type="password"
							variant="filled"
							className="w-full"
							error={!!errors.password}
							helperText={
								errors.password?.message ||
								(isEditMode
									? 'Solo ingrese una nueva contraseña si desea cambiarla'
									: '')
							}
							{...register('password', {
								required: isEditMode ? false : 'Este campo es requerido',
								minLength: {
									value: 6,
									message: 'La contraseña debe tener al menos 6 caracteres',
								},
								validate: (value) => {
									// En modo edición, si es la contraseña fake, es válido
									if (isEditMode && value === FAKE_PASSWORD) return true;
									// Si el usuario está escribiendo una nueva contraseña, validar longitud
									if (value && value !== FAKE_PASSWORD && value.length < 6) {
										return 'La contraseña debe tener al menos 6 caracteres';
									}
									return true;
								},
							})}
						/>

						{/* Confirmar Contraseña */}
						<TextField
							label={isEditMode ? 'Confirmar Contraseña' : 'Confirmar Contraseña *'}
							type="password"
							variant="filled"
							className="w-full"
							error={!!errors.confirm_password}
							helperText={errors.confirm_password?.message}
							{...register('confirm_password', {
								required: isEditMode ? false : 'Este campo es requerido',
								validate: (value) => {
									const password = watch('password');
									// En modo edición, ambas deben ser fake o deben coincidir
									if (
										isEditMode &&
										password === FAKE_PASSWORD &&
										value === FAKE_PASSWORD
									) {
										return true;
									}
									// Si se está cambiando la contraseña, deben coincidir
									if (value !== password) {
										return 'Las contraseñas no coinciden';
									}
									return true;
								},
							})}
						/>

						<StateSwitch
							state={watch('state')}
							onStateChange={(newState) => setValue('state', newState)}
							gender="el"
							entityName="usuario"
						/>
					</div>
				</div>

				{/* Información del Sistema */}
				{user.username && (
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

					{user.username && (
						<DeleteButton onDelete={handleDelete} itemName={user.username} />
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
					<h3 className="text-lg font-semibold text-gray-700 mb-4">Direcciones</h3>
					<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[200px] max-h-[300px] overflow-y-auto">
						{/* Aquí irá el componente de manejo de direcciones */}
						<p className="text-gray-500 text-sm">
							Componente de direcciones pendiente...
						</p>
					</div>
				</div>
			</div>
		</form>
	);
};
