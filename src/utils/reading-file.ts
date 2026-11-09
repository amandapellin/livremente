import { getAuthToken } from '@/api/auth-storage'
import { authedFetch } from '@/api/authed-fetch'

// Busca um arquivo de leitura (EPUB/PDF) do proxy do back-end COM o JWT. Os
// endpoints passaram a exigir autenticação (ler exige login), e epub.js/iframe não
// enviam o header Authorization — por isso buscamos via fetch e entregamos os bytes
// (ArrayBuffer p/ o epub.js, Blob URL p/ o iframe do PDF). `path` é o proxy same-origin.
export const fetchReadingFileBlob = async (path: string): Promise<Blob | null> => {
	if (!getAuthToken()) return null
	try {
		const res = await authedFetch(path)
		return res.ok ? await res.blob() : null
	} catch {
		return null
	}
}
