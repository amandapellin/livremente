import { getAuthToken } from '@/api/auth-storage'
import { authedFetch } from '@/api/authed-fetch'
import type { PublicationCard } from '@/api/generated/model'

// Recomendações personalizadas (RF27, #36). Espelha o RecommendationsDto do back:
// `coldStart` = true quando a pessoa não tem perfil (lista cai em popularidade);
// `items` são cards do catálogo (obras fora da estante). Deslogado → null.
export interface Recommendations {
	coldStart: boolean
	items: PublicationCard[]
}

export const fetchRecommendations = async (limit = 12): Promise<Recommendations | null> => {
	if (!getAuthToken()) return null
	try {
		const res = await authedFetch(`/api/recommendations?limit=${limit}`)
		return res.ok ? ((await res.json()) as Recommendations) : null
	} catch {
		return null
	}
}
