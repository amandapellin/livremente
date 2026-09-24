import { useSyncExternalStore } from 'react'
import { isAuthenticated, subscribeAuthChange } from '@/api/auth-storage'

/**
 * Estado reativo de autenticação. Usa `useSyncExternalStore` para refletir
 * login/logout imediatamente (na mesma aba e entre abas), sem recarregar. A UI
 * (ex.: o header) alterna entre visitante e autenticado a partir daqui.
 */
export function useIsAuthenticated(): boolean {
	return useSyncExternalStore(subscribeAuthChange, isAuthenticated, () => false)
}
