const TOKEN_KEY = 'livremente.auth.token'
const REFRESH_TOKEN_KEY = 'livremente.auth.refresh_token'

/**
 * Persistência do token de autenticação (RF02).
 *
 * Com "Manter conectado", o token vai para o `localStorage` — sobrevive ao
 * fechar o navegador. Sem a opção, vai para o `sessionStorage` — vale só
 * enquanto a aba/sessão existir. Todos os acessos são protegidos com try/catch,
 * pois o storage pode lançar (janela anônima, cookies bloqueados, etc.).
 */
export function saveAuthTokens(token: string, refreshToken: string, remember: boolean): void {
	try {
		const primary = remember ? window.localStorage : window.sessionStorage
		const secondary = remember ? window.sessionStorage : window.localStorage
		primary.setItem(TOKEN_KEY, token)
		primary.setItem(REFRESH_TOKEN_KEY, refreshToken)
		// Evita um token "órfão" no outro storage ao alternar a opção entre logins.
		secondary.removeItem(TOKEN_KEY)
		secondary.removeItem(REFRESH_TOKEN_KEY)
	} catch {
		// Storage indisponível — segue sem persistir.
	}
}

/** Lê os tokens atuais (local ou de sessão), junto com o tipo de storage usado. */
export function getAuthTokens(): { token: string | null; refreshToken: string | null; storage: 'local' | 'session' | null } {
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

/** Lê apenas o token de acesso (para compatibilidade com chamadas simples). */
export function getAuthToken(): string | null {
	return getAuthTokens().token
}

/** Remove ambos os tokens de ambos os storages (usado no logout). */
export function clearAuthTokens(): void {
	try {
		window.localStorage.removeItem(TOKEN_KEY)
		window.localStorage.removeItem(REFRESH_TOKEN_KEY)
		window.sessionStorage.removeItem(TOKEN_KEY)
		window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
	} catch {
		// Ignorado.
	}
}
