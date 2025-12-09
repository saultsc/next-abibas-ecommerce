'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import dayjs from 'dayjs';
import { toast } from 'sonner';

import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { register } from '@/actions/auth/register';
import { validateDateOfBirth } from '@/utils';
import { IoArrowBack, IoArrowForward, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

interface RegisterFormInputs {
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	password: string;
	confirm_password: string;
	date_of_birth: Date;
}

export const RegisterForm = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);

	const {
		register: registerForm,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
		trigger,
	} = useForm<RegisterFormInputs>();

	const validateStep1 = async () => {
		const isValid = await trigger(['first_name', 'last_name', 'date_of_birth']);
		if (isValid) {
			setCurrentStep(2);
		}
	};

	const onSubmit = async (data: RegisterFormInputs) => {
		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append('first_name', data.first_name);
			formData.append('last_name', data.last_name);
			formData.append('email', data.email);
			formData.append('date_of_birth', data.date_of_birth.toISOString());
			formData.append('username', data.username);
			formData.append('password', data.password);

			const { success, message } = await register(formData);

			if (success) {
				toast.success('¡Cuenta creada exitosamente!');
				router.push('/');
			} else {
				toast.error(message);
			}
		} catch (error) {
			console.error('Error en registro:', error);
			toast.error('Error al crear la cuenta');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{/* Progress Indicator */}
			<div className="flex items-center justify-center mb-4 gap-2">
				<div
					className={`flex-1 h-2 rounded-full ${
						currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'
					}`}></div>
				<div
					className={`flex-1 h-2 rounded-full ${
						currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
					}`}></div>
			</div>

			<div className="text-center mb-4">
				<p className="text-sm text-gray-600">
					Paso {currentStep} de 2:{' '}
					{currentStep === 1 ? 'Información personal' : 'Información de cuenta'}
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
				{/* STEP 1: Personal Information */}
				{currentStep === 1 && (
					<>
						{/* Nombres y Apellidos */}
						<div className="grid grid-cols-2 gap-4">
							<TextField
								label="Nombres"
								variant="outlined"
								fullWidth
								autoComplete="given-name"
								autoFocus
								disabled={isLoading}
								error={!!errors.first_name}
								helperText={errors.first_name?.message}
								{...registerForm('first_name', {
									required: 'Los nombres son requeridos',
									minLength: {
										value: 2,
										message: 'Los nombres deben tener al menos 2 caracteres',
									},
								})}
							/>

							<TextField
								label="Apellidos"
								variant="outlined"
								fullWidth
								autoComplete="family-name"
								disabled={isLoading}
								error={!!errors.last_name}
								helperText={errors.last_name?.message}
								{...registerForm('last_name', {
									required: 'Los apellidos son requeridos',
									minLength: {
										value: 2,
										message: 'Los apellidos deben tener al menos 2 caracteres',
									},
								})}
							/>
						</div>

						{/* Fecha de nacimiento */}
						<DatePicker
							label="Fecha de nacimiento"
							value={watch('date_of_birth') ? dayjs(watch('date_of_birth')) : null}
							format="DD/MM/YYYY"
							slotProps={{
								textField: {
									error: !!errors.date_of_birth,
									helperText: errors.date_of_birth?.message,
									fullWidth: true,
								},
								field: { clearable: true },
							}}
							{...registerForm('date_of_birth', {
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

						{/* Next Button */}
						<button
							type="button"
							onClick={validateStep1}
							disabled={isLoading}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
							<span>Continuar</span>
							<IoArrowForward />
						</button>
					</>
				)}

				{/* STEP 2: Account Information */}
				{currentStep === 2 && (
					<>
						{/* Username */}
						<TextField
							label="Nombre de usuario"
							variant="outlined"
							fullWidth
							autoComplete="username"
							autoFocus
							disabled={isLoading}
							error={!!errors.username}
							helperText={errors.username?.message}
							{...registerForm('username', {
								required: 'El nombre de usuario es requerido',
								minLength: {
									value: 3,
									message:
										'El nombre de usuario debe tener al menos 3 caracteres',
								},
								pattern: {
									value: /^[a-zA-Z0-9_]+$/,
									message: 'Solo letras, números y guiones bajos',
								},
							})}
						/>

						{/* Email */}
						<TextField
							label="Correo electrónico"
							variant="outlined"
							fullWidth
							type="email"
							autoComplete="email"
							disabled={isLoading}
							error={!!errors.email}
							helperText={errors.email?.message}
							{...registerForm('email', {
								required: 'El correo electrónico es requerido',
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'Correo electrónico inválido',
								},
							})}
						/>

						{/* Password */}
						<TextField
							label="Contraseña"
							type={showPassword ? 'text' : 'password'}
							variant="outlined"
							fullWidth
							autoComplete="new-password"
							disabled={isLoading}
							error={!!errors.password}
							helperText={errors.password?.message}
							{...registerForm('password', {
								required: 'La contraseña es requerida',
								minLength: {
									value: 6,
									message: 'La contraseña debe tener al menos 6 caracteres',
								},
							})}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => setShowPassword(!showPassword)}
											edge="end"
											disabled={isLoading}>
											{showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						{/* Confirm Password */}
						<TextField
							label="Confirmar contraseña"
							type={showConfirmPassword ? 'text' : 'password'}
							variant="outlined"
							fullWidth
							autoComplete="new-password"
							disabled={isLoading}
							error={!!errors.confirm_password}
							helperText={errors.confirm_password?.message}
							{...registerForm('confirm_password', {
								required: 'Debes confirmar la contraseña',
								validate: (value) =>
									value === watch('password') || 'Las contraseñas no coinciden',
							})}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											edge="end"
											disabled={isLoading}>
											{showConfirmPassword ? (
												<IoEyeOffOutline />
											) : (
												<IoEyeOutline />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						{/* Buttons */}
						<div className="flex gap-4">
							<button
								type="button"
								onClick={() => setCurrentStep(1)}
								disabled={isLoading}
								className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
								<IoArrowBack />
								<span>Atrás</span>
							</button>

							<button
								type="submit"
								disabled={isLoading}
								className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
								{isLoading ? (
									<>
										<CircularProgress size={20} color="inherit" />
										<span>Creando cuenta...</span>
									</>
								) : (
									'Crear cuenta'
								)}
							</button>
						</div>
					</>
				)}
			</form>
		</div>
	);
};
