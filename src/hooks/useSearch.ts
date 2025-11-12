import { useRef, useState, useTransition } from 'react';

import { Response } from '@/interfaces';

interface Props<T> {
	initialData: T[];
	searchAction: (term: string) => Promise<Response<T[]>>;
	debounceMs?: number;
}

/**
 * Hook personalizado para búsqueda con debounce usando Server Actions
 * @param initialData - Datos iniciales a mostrar
 * @param searchAction - Server Action que realiza la búsqueda
 * @param debounceMs - Tiempo de espera en milisegundos (default: 500ms)
 * @returns Objeto con los resultados, función de búsqueda y estado de carga
 */
export function useSearch<T>({ initialData, searchAction, debounceMs = 500 }: Props<T>) {
	const [results, setResults] = useState<T[]>(initialData);
	const [isLoading, startTransition] = useTransition();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleSearch = (searchTerm: string) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		if (!searchTerm || searchTerm.trim() === '') {
			setResults(initialData);
			return;
		}

		// Capturar el valor del searchTerm para evitar problemas de closure
		const termToSearch = searchTerm;

		timeoutRef.current = setTimeout(() => {
			startTransition(async () => {
				try {
					const { success, data } = await searchAction(termToSearch);

					if (success && data) {
						setResults(data);
					} else {
						setResults([]);
					}
				} catch (error) {
					console.error('Error en búsqueda:', error);
					setResults([]);
				}
			});
		}, debounceMs);
	};

	const cleanup = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	return {
		results,
		handleSearch,
		isLoading,
		setResults,
		cleanup,
	};
}
