import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import { fetchShelf, setShelfStatus, removeFromShelf } from './shelf'

const okJson = (data: unknown) => ({ ok: true, json: async () => data }) as Response

describe('shelf utils', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => vi.restoreAllMocks())

	describe('fetchShelf', () => {
		it('sem token devolve [] e não chama a API', async () => {
			const spy = vi.spyOn(globalThis, 'fetch')
			expect(await fetchShelf()).toEqual([])
			expect(spy).not.toHaveBeenCalled()
		})

		it('com token devolve a lista, sem query e com Bearer', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const rows = [{ status: 'reading' }]
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(rows))
			expect(await fetchShelf()).toEqual(rows)
			const [url, init] = spy.mock.calls[0]
			expect(String(url)).toContain('/api/shelf')
			expect(String(url)).not.toContain('?status')
			expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer tkn')
		})

		it('filtra por estado via query (encodeURIComponent)', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson([]))
			await fetchShelf('want_to_read')
			expect(String(spy.mock.calls[0][0])).toContain('?status=want_to_read')
		})

		it('resposta não-ok lança erro', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 500 } as Response)
			await expect(fetchShelf()).rejects.toThrow('500')
		})

		it('json que não é lista vira []', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson({ nope: true }))
			expect(await fetchShelf()).toEqual([])
		})
	})

	describe('setShelfStatus', () => {
		it('faz PUT em /api/shelf/{id} com o estado e devolve true quando ok', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true } as Response)
			expect(await setShelfStatus('42', 'read')).toBe(true)
			const [url, init] = spy.mock.calls[0]
			expect(String(url)).toContain('/api/shelf/42')
			expect(init?.method).toBe('PUT')
			expect(init?.body).toBe(JSON.stringify({ status: 'read' }))
		})

		it('devolve false quando a resposta não é ok', async () => {
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response)
			expect(await setShelfStatus('1', 'reading')).toBe(false)
		})
	})

	describe('removeFromShelf', () => {
		it('faz DELETE em /api/shelf/{id} e devolve true quando ok', async () => {
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true } as Response)
			expect(await removeFromShelf('7')).toBe(true)
			const [url, init] = spy.mock.calls[0]
			expect(String(url)).toContain('/api/shelf/7')
			expect(init?.method).toBe('DELETE')
		})

		it('devolve false quando não-ok', async () => {
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response)
			expect(await removeFromShelf('7')).toBe(false)
		})
	})
})
