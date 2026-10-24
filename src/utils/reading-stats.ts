import { getAuthToken } from '@/api/auth-storage'

const baseURL = import.meta.env.VITE_API_URL ?? ''

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
	const token = getAuthToken()
	if (!token) return null
	try {
		const res = await fetch(`${baseURL}/api/reading/stats`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!res.ok) return null
		return (await res.json()) as ReadingStats
	} catch {
		return null
	}
}
