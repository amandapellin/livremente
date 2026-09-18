const TOKEN_KEY = 'livremente.auth.token'

/**
 * Persistência do token de autenticação (RF02).
 *
 * Com "Manter conectado", o token vai para o `localStorage` — sobrevive ao
 * fechar o navegador. Sem a opção, vai para o `sessionStorage` — vale só
 * enquanto a aba/sessão existir. Todos os acessos são protegidos com try/catch,
 * pois o storage pode lançar (janela anônima, cookies bloqueados, etc.).
 */
export function saveAuthToken(token: string, remember: boolean): void {
	try {
		const primary = remember ? window.localStorage : window.sessionStorage
		const secondary = remember ? window.sessionStorage : window.localStorage
		primary.setItem(TOKEN_KEY, token)
		// Evita um token "órfão" no outro storage ao alternar a opção entre logins.
		secondary.removeItem(TOKEN_KEY)
	} catch {
		// Storage indisponível — segue sem persistir.
	}
}

/** Lê o token atual (local ou de sessão), ou `null` se não houver. */
export function getAuthToken(): string | null {
	try {
		return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY)
	} catch {
		return null
	}
}

/** Remove o token de ambos os storages (usado no logout). */
export function clearAuthToken(): void {
	try {
		window.localStorage.removeItem(TOKEN_KEY)
		window.sessionStorage.removeItem(TOKEN_KEY)
	} catch {
		// Ignorado.
	}
}
