import { getAuthToken } from '@/api/auth-storage'

const baseURL = import.meta.env.VITE_API_URL ?? ''
// Back-end (#28): criar + listar anotações já existem em /api/reading/{id}/annotations.
// Editar/excluir ainda NÃO têm endpoint (ficam locais até lá).
const USE_ANNOTATIONS_API = true

// Linha da anotação como vem do back-end (#28). No front, a nota vive no Highlight
// (campo `note`), correlacionada pelo cfiRange == epub_position.
interface RemoteAnnotation {
	id: number
	linkedExcerpt: string
	content: string
	epubPosition: string
	createdAt: string
}

export interface AnnotationSeed {
	cfiRange: string
	content: string
}

// Reduz as linhas de anotação a { cfiRange, content }, mantendo a mais nova por
// cfiRange (a lista do back vem mais recente primeiro). Reusado pela listagem
// combinada (#29). Aceita o shape mínimo { epubPosition, content }.
export const reduceRemoteAnnotations = (
	rows: ReadonlyArray<Pick<RemoteAnnotation, 'epubPosition' | 'content'>>,
): AnnotationSeed[] => {
	const byCfi = new Map<string, string>()
	for (const r of rows) if (!byCfi.has(r.epubPosition)) byCfi.set(r.epubPosition, r.content)
	return [...byCfi].map(([cfiRange, content]) => ({ cfiRange, content }))
}

// RF23: carrega as anotações do back-end e as reduz a { cfiRange, content }.
export const fetchAnnotationsRemote = async (bookId: string): Promise<AnnotationSeed[]> => {
	if (!USE_ANNOTATIONS_API) return []
	const token = getAuthToken()
	if (!token) return []
	try {
		const res = await fetch(`${baseURL}/api/reading/${bookId}/annotations`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!res.ok) return []
		const rows = (await res.json()) as RemoteAnnotation[]
		if (!Array.isArray(rows)) return []
		return reduceRemoteAnnotations(rows)
	} catch {
		return []
	}
}

// RF23: cria a anotação no back-end (só EPUB). Fire-and-forget; só com sessão.
export const sendAnnotation = (bookId: string, linkedExcerpt: string, content: string, epubPosition: string): void => {
	if (!USE_ANNOTATIONS_API) return
	const token = getAuthToken()
	if (!token) return
	fetch(`${baseURL}/api/reading/${bookId}/annotations`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify({ linkedExcerpt, content, epubPosition }),
	}).catch(() => undefined)
}
