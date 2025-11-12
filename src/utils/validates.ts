import dayjs from 'dayjs';

export const validateDateOfBirth = (value: Date) => {
	if (!value) return 'La fecha de nacimiento es requerida';

	const age = dayjs().diff(dayjs(value), 'year');
	if (age < 18) return 'Debe ser mayor de 18 años';
	if (age > 100) return 'Fecha inválida';

	return true;
};
