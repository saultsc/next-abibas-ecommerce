import { useRef, useState, useTransition } from 'react';

interface UseSearchWithDebounceProps<T> {
	initialData: T[];
	searchAction: (term: string) => Promise<{ success: boolean; data?: T[] }>;
	debounceMs?: number;
}

/**
 * Hook personalizado para búsqueda con debounce usando Server Actions
 * @param initialData - Datos iniciales a mostrar
 * @param searchAction - Server Action que realiza la búsqueda
 * @param debounceMs - Tiempo de espera en milisegundos (default: 500ms)
 * @returns Objeto con los resultados, función de búsqueda y estado de carga
 */
export function useSearchWithDebounce<T>({
	initialData,
	searchAction,
	debounceMs = 500,
}: UseSearchWithDebounceProps<T>) {
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

		timeoutRef.current = setTimeout(() => {
			startTransition(async () => {
				try {
					const { success, data } = await searchAction(searchTerm);
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
