const TOKEN_KEY = 'livremente.auth.token'
const REFRESH_TOKEN_KEY = 'livremente.auth.refresh_token'
const AUTH_EVENT = 'livremente:auth-changed'

const emitAuthChanged = (): void => {
	try {
		window.dispatchEvent(new Event(AUTH_EVENT))
	} catch {
		/* ambiente sem window */
	}
}

export const isAuthenticated = (): boolean => {
	return getAuthToken() !== null
}

export const subscribeAuthChange = (callback: () => void): () => void => {
	window.addEventListener(AUTH_EVENT, callback)
	window.addEventListener('storage', callback)
	return () => {
		window.removeEventListener(AUTH_EVENT, callback)
		window.removeEventListener('storage', callback)
	}
}

export const saveAuthTokens = (token: string, refreshToken: string, remember: boolean): void => {
	try {
		const primary = remember ? window.localStorage : window.sessionStorage
		const secondary = remember ? window.sessionStorage : window.localStorage
		primary.setItem(TOKEN_KEY, token)
		primary.setItem(REFRESH_TOKEN_KEY, refreshToken)
		secondary.removeItem(TOKEN_KEY)
		secondary.removeItem(REFRESH_TOKEN_KEY)
	} catch {
		/* storage indisponível */
	}
	emitAuthChanged()
}

export const getAuthTokens = (): { token: string | null; refreshToken: string | null; storage: 'local' | 'session' | null } => {
	try {
		if (window.localStorage.getItem(TOKEN_KEY)) {
			return {
				token: window.localStorage.getItem(TOKEN_KEY),
				refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY),
				storage: 'local'
			}
		}
		if (window.sessionStorage.getItem(TOKEN_KEY)) {
			return {
				token: window.sessionStorage.getItem(TOKEN_KEY),
				refreshToken: window.sessionStorage.getItem(REFRESH_TOKEN_KEY),
				storage: 'session'
			}
		}
		return { token: null, refreshToken: null, storage: null }
	} catch {
		return { token: null, refreshToken: null, storage: null }
	}
}

export const getAuthToken = (): string | null => {
	return getAuthTokens().token
}

export const clearAuthTokens = (): void => {
	try {
		window.localStorage.removeItem(TOKEN_KEY)
		window.localStorage.removeItem(REFRESH_TOKEN_KEY)
		window.sessionStorage.removeItem(TOKEN_KEY)
		window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
	} catch {
		/* ignora */
	}
	emitAuthChanged()
}
