import { getAuthToken } from '@/api/auth-storage'

const TIME_PREFIX = 'reader:time:'
const baseURL = import.meta.env.VITE_API_URL ?? ''

const USE_READING_SESSION_API = false

export const getStoredReadingTime = (bookId: string): number => {
	try {
		const v = localStorage.getItem(TIME_PREFIX + bookId)
		const n = v == null ? 0 : Number(v)
		return Number.isFinite(n) ? n : 0
	} catch {
		return 0
	}
}

export const addStoredReadingTime = (bookId: string, seconds: number) => {
	try {
		localStorage.setItem(TIME_PREFIX + bookId, String(getStoredReadingTime(bookId) + seconds))
	} catch {
		/* storage indisponível — ignora */
	}
}

export const formatDuration = (totalSeconds: number): string => {
	const s = Math.max(0, Math.floor(totalSeconds))
	const h = Math.floor(s / 3600)
	const m = Math.floor((s % 3600) / 60)
	const sec = s % 60
	const pad = (n: number) => String(n).padStart(2, '0')
	return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}

export const sendReadingTime = (bookId: string, seconds: number): void => {
	if (!USE_READING_SESSION_API || seconds <= 0) return
	try {
		const headers: Record<string, string> = { 'Content-Type': 'application/json' }
		const token = getAuthToken()
		if (token) headers.Authorization = `Bearer ${token}`
		fetch(`${baseURL}/api/users/me/reading-progress/${bookId}/session`, {
			method: 'POST',
			headers,
			body: JSON.stringify({ seconds }),
			keepalive: true,
		}).catch(() => undefined)
	} catch {
		/* ignora */
	}
}
