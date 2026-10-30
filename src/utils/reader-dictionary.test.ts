import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import { lookupWord, fetchWordHistory } from './reader-dictionary'

const okJson = (data: unknown) => ({ ok: true, status: 200, json: async () => data }) as Response
const entry = { word: 'cat', phonetic: '/kæt/', meanings: [{ partOfSpeech: 'noun', definitions: [{ definition: 'felino' }] }] }

describe('reader-dictionary', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	describe('lookupWord', () => {
		it('sem token devolve unauthorized sem chamar a API', async () => {
			const spy = vi.spyOn(globalThis, 'fetch')
			expect(await lookupWord('1', 'semtoken')).toEqual({ status: 'unauthorized' })
			expect(spy).not.toHaveBeenCalled()
		})

		it('200 devolve ok + entry e envia word/publicationId no corpo', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(entry))
			const res = await lookupWord('7', 'cat200')
			expect(res).toEqual({ status: 'ok', entry })
			const [url, init] = spy.mock.calls[0]
			expect(String(url)).toContain('/api/dictionary/lookup')
			expect(init?.method).toBe('POST')
			expect(JSON.parse(String(init?.body))).toEqual({ word: 'cat200', publicationId: 7 })
		})

		it('mapeia 404→not-found, 401→unauthorized, 500→error e erro de rede→error', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 404, ok: false } as Response)
			expect(await lookupWord('1', 'nf')).toEqual({ status: 'not-found' })
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 401, ok: false } as Response)
			expect(await lookupWord('1', 'unauth')).toEqual({ status: 'unauthorized' })
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 500, ok: false } as Response)
			expect(await lookupWord('1', 'err')).toEqual({ status: 'error' })
			vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
			expect(await lookupWord('1', 'neterr')).toEqual({ status: 'error' })
		})

		it('deduplica consultas idênticas na janela: mesma Promise, um único POST', () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(entry))
			const p1 = lookupWord('1', 'dedup')
			const p2 = lookupWord('1', 'dedup')
			expect(p2).toBe(p1)
			expect(spy).toHaveBeenCalledTimes(1)
		})

		it('após a janela (1500ms), uma nova consulta gera novo POST', async () => {
			vi.useFakeTimers()
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(entry))
			await lookupWord('1', 'window')
			expect(spy).toHaveBeenCalledTimes(1)
			await lookupWord('1', 'window') // ainda dentro da janela → reusa
			expect(spy).toHaveBeenCalledTimes(1)
			await vi.advanceTimersByTimeAsync(1500) // fecha a janela (limpa o cache)
			await lookupWord('1', 'window')
			expect(spy).toHaveBeenCalledTimes(2)
		})
	})

	describe('fetchWordHistory', () => {
		it('sem token devolve []', async () => {
			expect(await fetchWordHistory()).toEqual([])
		})

		it('com token devolve a lista e passa a ordem na query', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const rows = [{ word: 'cat', consultedAt: '2026-10-01', publicationId: 1, publicationTitle: 'X' }]
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(rows))
			expect(await fetchWordHistory('oldest')).toEqual(rows)
			expect(String(spy.mock.calls[0][0])).toContain('?order=oldest')
		})

		it('resposta não-ok devolve []', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 500 } as Response)
			expect(await fetchWordHistory()).toEqual([])
		})
	})
})
