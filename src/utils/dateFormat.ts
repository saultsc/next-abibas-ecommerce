export const dateFormat = (date: Date | string): string => {
	const d = typeof date === 'string' ? new Date(date) : date;

	// Formato: DD/MM/YYYY HH:MM AM/PM
	const day = d.getDate().toString().padStart(2, '0');
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const year = d.getFullYear();

	let hours = d.getHours();
	const minutes = d.getMinutes().toString().padStart(2, '0');
	const ampm = hours >= 12 ? 'PM' : 'AM';

	// Convertir a formato 12 horas
	hours = hours % 12;
	hours = hours ? hours : 12; // Si es 0, mostrar 12

	return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

export const dateOnlyFormat = (date: Date | string): string => {
	const d = typeof date === 'string' ? new Date(date) : date;

	// Formato: DD/MM/YYYY (solo fecha)
	const day = d.getDate().toString().padStart(2, '0');
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const year = d.getFullYear();

	return `${day}/${month}/${year}`;
};
