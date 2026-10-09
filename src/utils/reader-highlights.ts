import { getAuthToken } from '@/api/auth-storage'
import type { Highlight, HighlightColor } from '@/types/reader-types'

const PREFIX = 'reader:highlights:'
const baseURL = import.meta.env.VITE_API_URL ?? ''
const USE_HIGHLIGHTS_API = false

export const getHighlights = (bookId: string): Highlight[] => {
	try {
		const raw = localStorage.getItem(PREFIX + bookId)
		const list = raw ? (JSON.parse(raw) as Highlight[]) : []
		return Array.isArray(list) ? list : []
	} catch {
		return []
	}
}

const persist = (bookId: string, list: Highlight[]): Highlight[] => {
	try {
		localStorage.setItem(PREFIX + bookId, JSON.stringify(list))
	} catch {
		/* storage indisponível — ignora */
	}
	return list
}

export const saveHighlight = (bookId: string, highlight: Highlight): Highlight[] => {
	const list = getHighlights(bookId)
	if (list.some((h) => h.id === highlight.id)) return list
	return persist(bookId, [...list, highlight])
}

export const deleteHighlight = (bookId: string, id: string): Highlight[] =>
	persist(bookId, getHighlights(bookId).filter((h) => h.id !== id))

export const updateHighlightColor = (bookId: string, id: string, color: HighlightColor): Highlight[] =>
	persist(bookId, getHighlights(bookId).map((h) => (h.id === id ? { ...h, color } : h)))

export const updateHighlightNote = (bookId: string, id: string, note: string): Highlight[] =>
	persist(bookId, getHighlights(bookId).map((h) => (h.id === id ? { ...h, note: note || undefined } : h)))

const authHeaders = () => {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' }
	const token = getAuthToken()
	if (token) headers.Authorization = `Bearer ${token}`
	return headers
}

export const sendHighlight = (bookId: string, highlight: Highlight): void => {
	if (!USE_HIGHLIGHTS_API) return
	fetch(`${baseURL}/api/users/me/reading-progress/${bookId}/highlights`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify({ cfiRange: highlight.cfiRange, text: highlight.text, color: highlight.color, note: highlight.note ?? null }),
	}).catch(() => undefined)
}

export const updateHighlightRemote = (bookId: string, id: string, color: HighlightColor): void => {
	if (!USE_HIGHLIGHTS_API) return
	fetch(`${baseURL}/api/users/me/reading-progress/${bookId}/highlights/${encodeURIComponent(id)}`, {
		method: 'PATCH',
		headers: authHeaders(),
		body: JSON.stringify({ color }),
	}).catch(() => undefined)
}

export const updateHighlightNoteRemote = (bookId: string, id: string, note: string): void => {
	if (!USE_HIGHLIGHTS_API) return
	fetch(`${baseURL}/api/users/me/reading-progress/${bookId}/highlights/${encodeURIComponent(id)}`, {
		method: 'PATCH',
		headers: authHeaders(),
		body: JSON.stringify({ note }),
	}).catch(() => undefined)
}

export const removeHighlightRemote = (bookId: string, id: string): void => {
	if (!USE_HIGHLIGHTS_API) return
	fetch(`${baseURL}/api/users/me/reading-progress/${bookId}/highlights/${encodeURIComponent(id)}`, {
		method: 'DELETE',
		headers: authHeaders(),
	}).catch(() => undefined)
}
