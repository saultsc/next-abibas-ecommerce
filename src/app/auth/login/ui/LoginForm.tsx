'use client';

import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { toast } from 'sonner';

import { login } from '@/actions';

interface LoginFormInputs {
	username: string;
	password: string;
}

export const LoginForm = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>();

	const onSubmit = async (data: LoginFormInputs) => {
		setIsLoading(true);

		try {
			// Convertir a FormData
			const formData = new FormData();
			formData.append('username', data.username);
			formData.append('password', data.password);

			const result = await login(formData);

			if (!result.success) {
				toast.error(result.message || 'Error al iniciar sesión');
				return;
			}

			toast.success('¡Bienvenido!');
			router.push('/system/dashboard');
		} catch (error) {
			console.log('Error en login:', error);
			toast.error('Error al iniciar sesión');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			{/* Username */}
			<TextField
				label="Usuario"
				variant="outlined"
				fullWidth
				autoComplete="username"
				autoFocus
				disabled={isLoading}
				error={!!errors.username}
				helperText={errors.username?.message}
				{...register('username', {
					required: 'El usuario es requerido',
					minLength: {
						value: 3,
						message: 'El usuario debe tener al menos 3 caracteres',
					},
				})}
			/>

			{/* Password */}
			<TextField
				label="Contraseña"
				type={showPassword ? 'text' : 'password'}
				variant="outlined"
				fullWidth
				autoComplete="current-password"
				disabled={isLoading}
				error={!!errors.password}
				helperText={errors.password?.message}
				{...register('password', {
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

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
				{isLoading ? (
					<>
						<CircularProgress size={20} color="inherit" />
						<span>Iniciando sesión...</span>
					</>
				) : (
					'Iniciar sesión'
				)}
			</button>
		</form>
	);
};
