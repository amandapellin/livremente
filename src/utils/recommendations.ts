import { getAuthToken } from '@/api/auth-storage'
import type { PublicationCard } from '@/api/generated/model'

const baseURL = import.meta.env.VITE_API_URL ?? ''

// Recomendações personalizadas (RF27, #36). Espelha o RecommendationsDto do back:
// `coldStart` = true quando a pessoa não tem perfil (lista cai em popularidade);
// `items` são cards do catálogo (obras fora da estante). Deslogado → null.
export interface Recommendations {
	coldStart: boolean
	items: PublicationCard[]
}

export const fetchRecommendations = async (limit = 12): Promise<Recommendations | null> => {
	const token = getAuthToken()
	if (!token) return null
	try {
		const res = await fetch(`${baseURL}/api/recommendations?limit=${limit}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!res.ok) return null
		return (await res.json()) as Recommendations
	} catch {
		return null
	}
}
