import { getAuthToken } from '@/api/auth-storage'
import type { Highlight, HighlightColor } from '@/types/reader-types'
import { reduceRemoteAnnotations, type AnnotationSeed } from '@/utils/reader-annotations'

const PREFIX = 'reader:highlights:'
const baseURL = import.meta.env.VITE_API_URL ?? ''
// Back-end (#27): criação e listagem de grifos já existem em /api/reading/{id}/highlights.
const USE_HIGHLIGHTS_API = true
// Recolorir/nota/excluir ainda NÃO têm endpoint no back (issues futuras; nota = annotation
// #28). Mantém essas mutações locais até lá, para não baterem em rota inexistente.
const USE_HIGHLIGHT_MUTATIONS_API = false

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

// Linha do grifo como vem do back-end (#27). `id` é inteiro; a unidade de posição
// é o CFI range (epub_position). O front, porém, chaveia tudo pelo cfiRange.
interface RemoteHighlight {
	id: number
	excerpt: string
	epubPosition: string
	color: HighlightColor
	createdAt: string
}

// Mapeia a linha do back para o modelo do front, usando o cfiRange como id (chave
// estável do epub.js e das operações locais).
const toHighlight = (r: RemoteHighlight): Highlight => ({
	id: r.epubPosition,
	cfiRange: r.epubPosition,
	text: r.excerpt,
	chapter: '',
	color: r.color,
	createdAt: Date.parse(r.createdAt) || Date.now(),
})

// RF22: carrega os grifos do back-end (cross-device).
export const fetchHighlightsRemote = async (bookId: string): Promise<Highlight[]> => {
	if (!USE_HIGHLIGHTS_API) return []
	const token = getAuthToken()
	if (!token) return []
	try {
		const res = await fetch(`${baseURL}/api/reading/${bookId}/highlights`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!res.ok) return []
		const rows = (await res.json()) as RemoteHighlight[]
		if (!Array.isArray(rows)) return []
		return rows.map(toHighlight)
	} catch {
		return []
	}
}

// RF24 (#29): grifos + anotações num único GET combinado — o snapshot de "reabrir
// obra". Substitui as duas chamadas separadas (1 round-trip).
interface ReadingNotesResponse {
	highlights: RemoteHighlight[]
	annotations: Array<{ epubPosition: string; content: string }>
}

export const fetchReadingNotesRemote = async (
	bookId: string,
): Promise<{ highlights: Highlight[]; notes: AnnotationSeed[] }> => {
	const empty = { highlights: [], notes: [] }
	if (!USE_HIGHLIGHTS_API) return empty
	const token = getAuthToken()
	if (!token) return empty
	try {
		const res = await fetch(`${baseURL}/api/reading/${bookId}/highlights-annotations`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!res.ok) return empty
		const data = (await res.json()) as ReadingNotesResponse
		return {
			highlights: Array.isArray(data?.highlights) ? data.highlights.map(toHighlight) : [],
			notes: Array.isArray(data?.annotations) ? reduceRemoteAnnotations(data.annotations) : [],
		}
	} catch {
		return empty
	}
}

export const sendHighlight = (bookId: string, highlight: Highlight): void => {
	if (!USE_HIGHLIGHTS_API) return
	// Back (#27): só EPUB. Corpo { excerpt, epubPosition, color } — nota/capítulo não entram.
	fetch(`${baseURL}/api/reading/${bookId}/highlights`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify({ excerpt: highlight.text, epubPosition: highlight.cfiRange, color: highlight.color }),
	}).catch(() => undefined)
}

export const updateHighlightRemote = (bookId: string, id: string, color: HighlightColor): void => {
	if (!USE_HIGHLIGHT_MUTATIONS_API) return
	fetch(`${baseURL}/api/reading/${bookId}/highlights/${encodeURIComponent(id)}`, {
		method: 'PATCH',
		headers: authHeaders(),
		body: JSON.stringify({ color }),
	}).catch(() => undefined)
}

export const updateHighlightNoteRemote = (bookId: string, id: string, note: string): void => {
	if (!USE_HIGHLIGHT_MUTATIONS_API) return
	fetch(`${baseURL}/api/reading/${bookId}/highlights/${encodeURIComponent(id)}`, {
		method: 'PATCH',
		headers: authHeaders(),
		body: JSON.stringify({ note }),
	}).catch(() => undefined)
}

export const removeHighlightRemote = (bookId: string, id: string): void => {
	if (!USE_HIGHLIGHT_MUTATIONS_API) return
	fetch(`${baseURL}/api/reading/${bookId}/highlights/${encodeURIComponent(id)}`, {
		method: 'DELETE',
		headers: authHeaders(),
	}).catch(() => undefined)
}
