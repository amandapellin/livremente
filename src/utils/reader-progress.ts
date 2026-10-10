import { getAuthToken } from '@/api/auth-storage'

const baseURL = import.meta.env.VITE_API_URL ?? ''
const USE_READING_PROGRESS_API = false

export const sendReadingProgress = (bookId: string, cfi: string, percent: number): void => {
	if (!USE_READING_PROGRESS_API || !cfi) return
	try {
		const headers: Record<string, string> = { 'Content-Type': 'application/json' }
		const token = getAuthToken()
		if (token) headers.Authorization = `Bearer ${token}`
		fetch(`${baseURL}/api/users/me/reading-progress/${bookId}`, {
			method: 'PUT',
			headers,
			body: JSON.stringify({ cfi, percent }),
			keepalive: true,
		}).catch(() => undefined)
	} catch {
		/* ignora */
	}
}
