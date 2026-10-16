import { getAuthToken } from '@/api/auth-storage'

const baseURL = import.meta.env.VITE_API_URL ?? ''

/**
 * Salva a última página lida (RF17/RN08) no back-end: `lastPageRead` é o índice
 * de *location* do epub.js. Fire-and-forget, com `keepalive` para sobreviver ao
 * fechamento da aba. Só envia se houver sessão (endpoint autenticado).
 */
export const saveLastPage = (bookId: string, lastPageRead: number): void => {
	const token = getAuthToken()
	if (!token || lastPageRead < 0) return
	try {
		fetch(`${baseURL}/api/reading/${bookId}/last-page`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({ lastPageRead }),
			keepalive: true,
		}).catch(() => undefined)
	} catch {
		/* ignora */
	}
}

/**
 * Salva o percentual lido (RF19) no back-end (0–100). Fire-and-forget, keepalive;
 * só envia se houver sessão (endpoint autenticado).
 */
export const savePercentage = (bookId: string, readPercentage: number): void => {
	const token = getAuthToken()
	if (!token || readPercentage < 0 || readPercentage > 100) return
	try {
		fetch(`${baseURL}/api/reading/${bookId}/percentage`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({ readPercentage }),
			keepalive: true,
		}).catch(() => undefined)
	} catch {
		/* ignora */
	}
}

/**
 * Retomada de leitura (RF18): última página salva no back-end (cross-device),
 * ou null (nunca leu / anônimo / erro).
 */
export const fetchLastPage = async (bookId: string): Promise<number | null> => {
	const token = getAuthToken()
	if (!token) return null
	try {
		const res = await fetch(`${baseURL}/api/reading/${bookId}/last-page`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!res.ok) return null
		const data = await res.json()
		return typeof data?.lastPageRead === 'number' ? data.lastPageRead : null
	} catch {
		return null
	}
}
