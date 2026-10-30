import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import { reduceRemoteAnnotations, fetchAnnotationsRemote, sendAnnotation } from './reader-annotations'

const okJson = (data: unknown) => ({ ok: true, json: async () => data }) as Response

describe('reader-annotations', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => vi.restoreAllMocks())

	describe('reduceRemoteAnnotations', () => {
		it('reduz a { cfiRange, content } e mantém a 1ª (mais nova) por cfiRange', () => {
			const out = reduceRemoteAnnotations([
				{ epubPosition: 'c1', content: 'nova' },
				{ epubPosition: 'c1', content: 'antiga' },
				{ epubPosition: 'c2', content: 'outra' },
			])
			expect(out).toEqual([
				{ cfiRange: 'c1', content: 'nova' },
				{ cfiRange: 'c2', content: 'outra' },
			])
		})

		it('lista vazia devolve []', () => {
			expect(reduceRemoteAnnotations([])).toEqual([])
		})
	})

	describe('fetchAnnotationsRemote', () => {
		it('sem token devolve []', async () => {
			expect(await fetchAnnotationsRemote('1')).toEqual([])
		})

		it('com token devolve as anotações reduzidas', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const rows = [{ id: 1, linkedExcerpt: 'trecho', content: 'nota', epubPosition: 'c1', createdAt: '2026-10-01T00:00:00Z' }]
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(rows))
			const res = await fetchAnnotationsRemote('9')
			expect(String(spy.mock.calls[0][0])).toContain('/api/reading/9/annotations')
			expect(res).toEqual([{ cfiRange: 'c1', content: 'nota' }])
		})

		it('resposta não-ok devolve []', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response)
			expect(await fetchAnnotationsRemote('1')).toEqual([])
		})
	})

	describe('sendAnnotation', () => {
		it('sem token não chama a API', () => {
			const spy = vi.spyOn(globalThis, 'fetch')
			sendAnnotation('9', 'trecho', 'nota', 'c1')
			expect(spy).not.toHaveBeenCalled()
		})

		it('com token faz POST com { linkedExcerpt, content, epubPosition }', () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true } as Response)
			sendAnnotation('9', 'trecho', 'minha nota', 'cfiY')
			const [url, init] = spy.mock.calls[0]
			expect(String(url)).toContain('/api/reading/9/annotations')
			expect(init?.method).toBe('POST')
			expect(JSON.parse(String(init?.body))).toEqual({ linkedExcerpt: 'trecho', content: 'minha nota', epubPosition: 'cfiY' })
		})
	})
})
