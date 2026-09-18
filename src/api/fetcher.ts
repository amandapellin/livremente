import { getAuthToken } from './auth-storage'

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

/**
 * Custom fetch usado pelo cliente gerado (orval, httpClient: 'fetch').
 * Prefixa a baseURL vinda do ambiente e centraliza o tratamento de resposta —
 * ponto único para, no futuro, injetar o token JWT nos headers.
 *
 * Segue a convenção do cliente fetch do orval: devolve o envelope
 * `{ data, status, headers }`, onde `data` é o corpo já desserializado.
 * Em requests não-ok, lança um `HttpError` — o React Query então marca a
 * query/mutation como erro, com status e corpo disponíveis para a UI.
 */
export const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers)
  // Content-Type só quando há corpo — evita preflight CORS desnecessário em GETs.
  if (options.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  // Injeta o token JWT (quando há sessão) — ponto único de autenticação.
  const token = getAuthToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${baseURL}${url}`, { ...options, headers })

  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    throw new HttpError(response.status, data, url)
  }

  return { data, status: response.status, headers: response.headers } as T
}
