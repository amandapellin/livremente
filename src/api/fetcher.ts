import { getAuthToken, getAuthTokens, saveAuthTokens, clearAuthTokens } from './auth-storage'

const baseURL = import.meta.env.VITE_API_URL ?? ''

/**
 * Erro lançado quando o backend responde com status não-ok.
 * Carrega o `status` e o `data` (corpo já desserializado, quando houver) para
 * que a camada de UI possa reagir a casos específicos — por exemplo, tratar um
 * 409 no cadastro como "e-mail já cadastrado" e exibir a mensagem amigável.
 */
export class HttpError extends Error {
  readonly status: number
  readonly data: unknown

  constructor(status: number, data: unknown, url: string) {
    super(`HTTP ${status} ao chamar ${url}`)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

let refreshPromise: Promise<boolean> | null = null

async function performTokenRefresh(): Promise<boolean> {
  const { refreshToken, storage } = getAuthTokens()
  if (!refreshToken || !storage) return false

  try {
    const response = await fetch(`${baseURL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error('Refresh failed')
    }

    const data = await response.json()
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
 * Custom fetch usado pelo cliente gerado (orval, httpClient: 'fetch').
 * Prefixa a baseURL vinda do ambiente e centraliza o tratamento de resposta.
 * Injeta o token JWT e intercepta respostas 401 para renovação automática (RF02).
 */
export const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers)
  // Content-Type só quando há corpo — evita preflight CORS desnecessário em GETs.
  if (options.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  // Injeta o token JWT (quando há sessão) — ponto único de autenticação.
  let token = getAuthToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response = await fetch(`${baseURL}${url}`, { ...options, headers })

  // Intercepta 401 para tentar renovar o token (se não for nas rotas de login/refresh)
  if (response.status === 401 && !url.includes('/api/auth/login') && !url.includes('/api/auth/refresh')) {
    if (!refreshPromise) {
      refreshPromise = performTokenRefresh()
    }

    const refreshed = await refreshPromise

    if (refreshed) {
      token = getAuthToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        response = await fetch(`${baseURL}${url}`, { ...options, headers })
      }
    }
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    // Se o erro continua sendo 401 (refresh falhou ou url era auth), desloga e redireciona
    if (response.status === 401 && !url.includes('/api/auth/login')) {
      clearAuthTokens()
      window.location.href = '/login'
    }
    throw new HttpError(response.status, data, url)
  }

  return { data, status: response.status, headers: response.headers } as T
}
