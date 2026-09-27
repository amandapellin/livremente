import { useEffect, useState } from 'react'

/**
 * Retorna `value` com atraso: só muda após `delay` ms sem novas alterações.
 * Usado na busca do catálogo (RF11) para não disparar uma requisição a cada
 * tecla, mantendo o campo responsivo.
 */
export function useDebouncedValue<T>(value: T, delay = 350): T {
	const [debounced, setDebounced] = useState(value)
	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay)
		return () => clearTimeout(id)
	}, [value, delay])
	return debounced
}
