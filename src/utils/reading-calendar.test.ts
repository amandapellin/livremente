import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import { fetchReadingCalendar } from './reading-calendar'

const okJson = (data: unknown) => ({ ok: true, json: async () => data }) as Response
const emptyCal = { from: '', to: '', days: [] }

describe('fetchReadingCalendar', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => vi.restoreAllMocks())

	it('sem token devolve null', async () => {
		const spy = vi.spyOn(globalThis, 'fetch')
		expect(await fetchReadingCalendar()).toBeNull()
		expect(spy).not.toHaveBeenCalled()
	})

	it('sem from/to chama o mês atual (sem query) com Bearer e devolve parseado', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		const cal = { from: '2026-10-01', to: '2026-10-31', days: [{ date: '2026-10-05', activeMinutes: 12, sessionCount: 1 }] }
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(cal))
		expect(await fetchReadingCalendar()).toEqual(cal)
		const [url, init] = spy.mock.calls[0]
		expect(String(url)).toContain('/api/reading/calendar')
		expect(String(url)).not.toContain('?')
		expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer tkn')
	})

	it('com from e to monta a query do intervalo', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(emptyCal))
		await fetchReadingCalendar('2026-10-01', '2026-10-31')
		expect(String(spy.mock.calls[0][0])).toContain('?from=2026-10-01&to=2026-10-31')
	})

	it('só from (sem to) ignora a query e usa o mês atual', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(emptyCal))
		await fetchReadingCalendar('2026-10-01')
		expect(String(spy.mock.calls[0][0])).not.toContain('?from')
	})

	it('resposta não-ok devolve null', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 400 } as Response)
		expect(await fetchReadingCalendar('2026-10-01', '2026-10-31')).toBeNull()
	})

	it('erro de rede devolve null (não propaga)', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
		expect(await fetchReadingCalendar()).toBeNull()
	})
})
