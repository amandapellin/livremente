import { getAuthToken } from '@/api/auth-storage'
import { authedFetch } from '@/api/authed-fetch'

// Métricas agregadas de leitura (RF27, #37) — espelha o ReadingStatsDto do back.
export interface ReadingStats {
	totalMinutes: number
	todayMinutes: number
	dailyAverageMinutes: number
	currentStreakDays: number
	longestStreakDays: number
	activeDays: number
	daysThisMonth: number
}

export const fetchReadingStats = async (): Promise<ReadingStats | null> => {
	if (!getAuthToken()) return null
	try {
		const res = await authedFetch('/api/reading/stats')
		return res.ok ? ((await res.json()) as ReadingStats) : null
	} catch {
		return null
	}
}
