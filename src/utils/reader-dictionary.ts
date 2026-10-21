import { getAuthToken } from '@/api/auth-storage'

const baseURL = import.meta.env.VITE_API_URL ?? ''

export interface DictionaryDefinition {
	definition: string
	example?: string | null
}

export interface DictionaryMeaning {
	partOfSpeech: string
	definitions: DictionaryDefinition[]
}

export interface DictionaryEntry {
	word: string
	phonetic?: string | null
	meanings: DictionaryMeaning[]
}

export type LookupResult =
	| { status: 'ok'; entry: DictionaryEntry }
	| { status: 'not-found' }
	| { status: 'error' }
	| { status: 'unauthorized' }

const doLookup = async (bookId: string, word: string): Promise<LookupResult> => {
	const token = getAuthToken()
	if (!token) return { status: 'unauthorized' }
	try {
		const res = await fetch(`${baseURL}/api/dictionary/lookup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({ word, publicationId: Number(bookId) }),
		})
		if (res.status === 401) return { status: 'unauthorized' }
		if (res.status === 404) return { status: 'not-found' }
		if (!res.ok) return { status: 'error' }
		return { status: 'ok', entry: (await res.json()) as DictionaryEntry }
	} catch {
		return { status: 'error' }
	}
}

// Deduplica a mesma consulta numa janela curta: a montagem dupla do StrictMode (dev)
// e cliques repetidos rápidos reusam a MESMA Promise -> um único POST -> um registro.
// Uma reconsulta deliberada depois da janela gera novo POST (nova consulta no histórico).
const inflight = new Map<string, Promise<LookupResult>>()

// RF07 (#30): consulta o significado. O back registra a consulta em word_lookup
// (se save_dictionary ligado) — o auto-registro acontece neste POST.
export const lookupWord = (bookId: string, word: string): Promise<LookupResult> => {
	const key = `${bookId}::${word}`
	const existing = inflight.get(key)
	if (existing) return existing
	const promise = doLookup(bookId, word)
	inflight.set(key, promise)
	void promise.finally(() => {
		setTimeout(() => inflight.delete(key), 1500)
	})
	return promise
}

export interface WordHistoryItem {
	word: string
	consultedAt: string
	publicationId: number
	publicationTitle: string
	/** Definição consultada (#27); null em consultas antigas, anteriores à migração. */
	definition?: string | null
}

// RF08 (#31): histórico de palavras consultadas, com a obra de origem.
export const fetchWordHistory = async (order: 'recent' | 'oldest' = 'recent'): Promise<WordHistoryItem[]> => {
	const token = getAuthToken()
	if (!token) return []
	try {
		const res = await fetch(`${baseURL}/api/dictionary/history?order=${order}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!res.ok) return []
		const rows = (await res.json()) as WordHistoryItem[]
		return Array.isArray(rows) ? rows : []
	} catch {
		return []
	}
}
