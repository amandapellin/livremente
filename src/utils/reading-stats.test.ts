import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import { fetchReadingStats } from './reading-stats'

describe('fetchReadingStats', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => vi.restoreAllMocks())

	it('sem token devolve null', async () => {
		expect(await fetchReadingStats()).toBeNull()
	})

	it('com token devolve as métricas parseadas', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		const stats = {
			totalMinutes: 23,
			todayMinutes: 1,
			dailyAverageMinutes: 6,
			currentStreakDays: 2,
			longestStreakDays: 2,
			activeDays: 4,
			daysThisMonth: 4,
		}
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => stats } as Response)
		expect(await fetchReadingStats()).toEqual(stats)
	})

	it('resposta não-ok ou erro de rede devolve null', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 401 } as Response)
		expect(await fetchReadingStats()).toBeNull()
	})
})
