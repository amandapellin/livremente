import { useSyncExternalStore } from 'react'
import { isAuthenticated, subscribeAuthChange } from '@/api/auth-storage'

export const useIsAuthenticated = (): boolean => {
	return useSyncExternalStore(subscribeAuthChange, isAuthenticated, () => false)
}
