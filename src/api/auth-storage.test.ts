import { describe, it, expect, beforeEach } from 'vitest'
import { saveAuthTokens, getAuthToken, getAuthTokens, clearAuthTokens, isAuthenticated } from './auth-storage'

describe('auth-storage', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})

	it('sem token: getAuthToken é null e não está autenticado', () => {
		expect(getAuthToken()).toBeNull()
		expect(isAuthenticated()).toBe(false)
	})

	it('remember=true grava no localStorage (persistente)', () => {
		saveAuthTokens('tkn', 'rfr', true)
		expect(getAuthToken()).toBe('tkn')
		expect(getAuthTokens().storage).toBe('local')
		expect(isAuthenticated()).toBe(true)
	})

	it('remember=false grava no sessionStorage (sessão)', () => {
		saveAuthTokens('tkn', 'rfr', false)
		expect(getAuthTokens().storage).toBe('session')
		expect(getAuthToken()).toBe('tkn')
	})

	it('clearAuthTokens remove de ambos os armazenamentos', () => {
		saveAuthTokens('tkn', 'rfr', true)
		clearAuthTokens()
		expect(getAuthToken()).toBeNull()
		expect(isAuthenticated()).toBe(false)
	})
})
