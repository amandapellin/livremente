import { getAuthToken, getAuthTokens, saveAuthTokens, clearAuthTokens } from './auth-storage'

const baseURL = import.meta.env.VITE_API_URL ?? ''

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

export const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers)
  if (options.body != null && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  let token = getAuthToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response = await fetch(`${baseURL}${url}`, { ...options, headers })

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
    if (response.status === 401 && !url.includes('/api/auth/login')) {
      clearAuthTokens()
      window.location.href = '/login'
    }
    throw new HttpError(response.status, data, url)
  }

  return { data, status: response.status, headers: response.headers } as T
}
