import { getAuthToken } from '@/api/auth-storage'

// Busca um arquivo de leitura (EPUB/PDF) do proxy do back-end COM o JWT. Os
// endpoints passaram a exigir autenticação (ler exige login), e epub.js/iframe não
// enviam o header Authorization — por isso buscamos via fetch e entregamos os bytes
// (ArrayBuffer p/ o epub.js, Blob URL p/ o iframe do PDF). `url` é o proxy same-origin.
export const fetchReadingFileBlob = async (url: string): Promise<Blob | null> => {
	const token = getAuthToken()
	if (!token) return null
	try {
		const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
		if (!res.ok) return null
		return await res.blob()
	} catch {
		return null
	}
}
