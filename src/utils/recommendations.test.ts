import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import { fetchRecommendations } from './recommendations'

describe('fetchRecommendations', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => vi.restoreAllMocks())

	it('sem token devolve null e não chama a API', async () => {
		const fetchSpy = vi.spyOn(globalThis, 'fetch')
		expect(await fetchRecommendations()).toBeNull()
		expect(fetchSpy).not.toHaveBeenCalled()
	})

	it('com token devolve os dados parseados e envia o Bearer', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		const payload = { coldStart: false, items: [] }
		const fetchSpy = vi
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue({ ok: true, json: async () => payload } as Response)

		const res = await fetchRecommendations(5)

		expect(res).toEqual(payload)
		const [url, init] = fetchSpy.mock.calls[0]
		expect(String(url)).toContain('/api/recommendations?limit=5')
		expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer tkn')
	})

	it('resposta não-ok devolve null', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 500 } as Response)
		expect(await fetchRecommendations()).toBeNull()
	})

	it('erro de rede devolve null (não propaga)', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
		expect(await fetchRecommendations()).toBeNull()
	})
})
