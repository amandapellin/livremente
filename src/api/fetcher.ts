const baseURL = import.meta.env.VITE_API_URL ?? ''

/**
 * Custom fetch usado pelo cliente gerado (orval, httpClient: 'fetch').
 * Prefixa a baseURL vinda do ambiente e centraliza o tratamento de resposta —
 * ponto único para, no futuro, injetar o token JWT nos headers.
 *
 * Segue a convenção do cliente fetch do orval: devolve o envelope
 * `{ data, status, headers }`, onde `data` é o corpo já desserializado.
 * Em requests não-ok, lança — o React Query então marca a query como erro.
 */
export const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers)
  // Content-Type só quando há corpo — evita preflight CORS desnecessário em GETs.
  if (options.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${baseURL}${url}`, { ...options, headers })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ao chamar ${url}`)
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined

  return { data, status: response.status, headers: response.headers } as T
}
