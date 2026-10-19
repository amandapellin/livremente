import { getAuthToken } from '@/api/auth-storage'
import type { PublicationCard, ReadingStatus } from '@/api/generated/model'

const baseURL = import.meta.env.VITE_API_URL ?? ''

// Item da estante (RF05): o card da publicação + estado + progresso (espelha o
// ShelfItemDto do back-end). Usa o mesmo PublicationCard do catálogo.
export interface ShelfItem {
	publication: PublicationCard
	status: ReadingStatus
	readPercentage: number | null
	lastPageRead: number | null
}

const authHeaders = (): Record<string, string> => {
	const token = getAuthToken()
	return token ? { Authorization: `Bearer ${token}` } : {}
}

// RF05 (#32): lista a estante do usuário, opcionalmente filtrada por estado.
// Sem token (deslogado) → lista vazia (a tela exige login à parte).
export const fetchShelf = async (status?: ReadingStatus): Promise<ShelfItem[]> => {
	if (!getAuthToken()) return []
	const qs = status ? `?status=${encodeURIComponent(status)}` : ''
	const res = await fetch(`${baseURL}/api/shelf${qs}`, { headers: authHeaders() })
	if (!res.ok) throw new Error(`GET /api/shelf ${res.status}`)
	const rows = (await res.json()) as ShelfItem[]
	return Array.isArray(rows) ? rows : []
}

// RF06 (#33): upsert do estado da obra (define o estado enviado; preserva o
// progresso). `true` = aplicado; `false` = falhou (ex.: 404 publicação inexistente).
export const setShelfStatus = async (publicationId: string, status: ReadingStatus): Promise<boolean> => {
	const res = await fetch(`${baseURL}/api/shelf/${Number(publicationId)}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json', ...authHeaders() },
		body: JSON.stringify({ status }),
	})
	return res.ok
}

// RF06 (#33): remove a obra da estante. `true` = removida; `false` = não estava/erro.
export const removeFromShelf = async (publicationId: string): Promise<boolean> => {
	const res = await fetch(`${baseURL}/api/shelf/${Number(publicationId)}`, {
		method: 'DELETE',
		headers: authHeaders(),
	})
	return res.ok
}
