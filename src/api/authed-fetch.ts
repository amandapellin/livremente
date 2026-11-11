import { getAuthToken, getAuthTokens, saveAuthTokens, clearAuthTokens } from './auth-storage'

// Base da API (vazia em dev — o Vite faz proxy de /api). Fonte única: antes cada
// util de fetch declarava a sua própria cópia desta constante.
export const API_BASE = import.meta.env.VITE_API_URL ?? ''

/**
 * Monta os headers da requisição injetando `Authorization: Bearer <token>` quando
 * há sessão. Mescla com `extra` (ex.: Content-Type) sem sobrescrever um
 * Authorization já presente.
 */
export const authHeaders = (extra?: HeadersInit): Headers => {
	const headers = new Headers(extra)
	const token = getAuthToken()
	if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)
	return headers
}

// Refresh do access token com single-flight (uma só chamada concorrente). Exportado
// para ser COMPARTILHADO com o customFetch do orval (fetcher.ts) — dois locks
// independentes causariam refresh duplo e, como o refresh rotaciona/revoga o token,
// logout espúrio.
let refreshPromise: Promise<boolean> | null = null

export const refreshAuthToken = (): Promise<boolean> => {
	refreshPromise ??= runRefresh()
	return refreshPromise
}

const runRefresh = async (): Promise<boolean> => {
	try {
		const { refreshToken, storage } = getAuthTokens()
		if (!refreshToken || !storage) return false
		const res = await fetch(`${API_BASE}/api/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken }),
		})
		if (!res.ok) throw new Error('refresh falhou')
		const data = await res.json()
		saveAuthTokens(data.token, data.refreshToken, storage === 'local')
		return true
	} catch {
		clearAuthTokens()
		return false
	} finally {
		refreshPromise = null
	}
}

/**
 * `fetch` autenticado contra a API: resolve a `API_BASE`, injeta o Bearer, define
 * Content-Type JSON quando há corpo e, no **401 com sessão**, tenta UM refresh e
 * repete a requisição. Devolve a `Response` crua — cada chamador decide a política
 * (null / [] / throw / bool). Ao contrário do `customFetch` do orval, **não
 * redireciona** para /login: é usado por chamadas que toleram estar deslogado.
 *
 * `path` deve ser um caminho relativo (ex.: `/api/reading/stats`); é prefixado por
 * `API_BASE`. Não use para disparos *fire-and-forget* com `keepalive` (o await do
 * refresh anula o keepalive) — nesses casos use `fetch` + `authHeaders` direto.
 */
export const authedFetch = async (path: string, init: RequestInit = {}): Promise<Response> => {
	const build = (): Headers => {
		const headers = authHeaders(init.headers)
		if (init.body != null && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
			headers.set('Content-Type', 'application/json')
		}
		return headers
	}

	const hadToken = getAuthToken() !== null
	let res = await fetch(`${API_BASE}${path}`, { ...init, headers: build() })
	if (res.status === 401 && hadToken && (await refreshAuthToken())) {
		res = await fetch(`${API_BASE}${path}`, { ...init, headers: build() }) // build() relê o token já renovado
	}
	return res
}
