import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import type { Highlight } from '@/types/reader-types'
import {
	getHighlights,
	saveHighlight,
	deleteHighlight,
	updateHighlightColor,
	updateHighlightNote,
	fetchHighlightsRemote,
	fetchReadingNotesRemote,
	sendHighlight,
	updateHighlightRemote,
	updateHighlightNoteRemote,
	removeHighlightRemote,
} from './reader-highlights'

const okJson = (data: unknown) => ({ ok: true, json: async () => data }) as Response
const makeHighlight = (o: Partial<Highlight> = {}): Highlight => ({
	id: 'cfi1',
	cfiRange: 'cfi1',
	text: 'um trecho',
	chapter: '',
	color: 'amarelo',
	createdAt: 1,
	...o,
})

describe('reader-highlights', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => vi.restoreAllMocks())

	describe('CRUD local (localStorage)', () => {
		it('getHighlights vazio e com JSON inválido devolve []', () => {
			expect(getHighlights('1')).toEqual([])
			localStorage.setItem('reader:highlights:1', 'nao-json')
			expect(getHighlights('1')).toEqual([])
		})

		it('saveHighlight adiciona e deduplica por id', () => {
			const h = makeHighlight()
			expect(saveHighlight('1', h)).toHaveLength(1)
			expect(saveHighlight('1', h)).toHaveLength(1) // mesmo id → não duplica
			expect(getHighlights('1')[0].id).toBe('cfi1')
		})

		it('deleteHighlight remove por id', () => {
			saveHighlight('1', makeHighlight({ id: 'a', cfiRange: 'a' }))
			saveHighlight('1', makeHighlight({ id: 'b', cfiRange: 'b' }))
			expect(deleteHighlight('1', 'a').map((h) => h.id)).toEqual(['b'])
		})

		it('updateHighlightColor troca a cor', () => {
			saveHighlight('1', makeHighlight({ color: 'amarelo' }))
			expect(updateHighlightColor('1', 'cfi1', 'verde')[0].color).toBe('verde')
		})

		it('updateHighlightNote grava a nota e nota vazia a remove', () => {
			saveHighlight('1', makeHighlight())
			expect(updateHighlightNote('1', 'cfi1', 'minha nota')[0].note).toBe('minha nota')
			expect(updateHighlightNote('1', 'cfi1', '')[0].note).toBeUndefined()
		})
	})

	describe('fetchHighlightsRemote', () => {
		it('sem token devolve []', async () => {
			expect(await fetchHighlightsRemote('1')).toEqual([])
		})

		it('mapeia a linha do back (epubPosition→id/cfiRange, excerpt→text, createdAt parseado)', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const rows = [{ id: 5, excerpt: 'texto', epubPosition: 'cfiX', color: 'azul', createdAt: '2026-10-01T00:00:00Z' }]
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(rows))
			const res = await fetchHighlightsRemote('9')
			expect(String(spy.mock.calls[0][0])).toContain('/api/reading/9/highlights')
			expect(res).toHaveLength(1)
			expect(res[0]).toMatchObject({ id: 'cfiX', cfiRange: 'cfiX', text: 'texto', color: 'azul', chapter: '' })
			expect(res[0].createdAt).toBe(Date.parse('2026-10-01T00:00:00Z'))
		})

		it('resposta não-ok devolve []', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response)
			expect(await fetchHighlightsRemote('1')).toEqual([])
		})
	})

	describe('fetchReadingNotesRemote (combinado #29)', () => {
		it('sem token devolve listas vazias', async () => {
			expect(await fetchReadingNotesRemote('1')).toEqual({ highlights: [], notes: [] })
		})

		it('mapeia grifos e reduz anotações por cfiRange (mantém a mais nova)', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const data = {
				highlights: [{ id: 1, excerpt: 't', epubPosition: 'c1', color: 'rosa', createdAt: '2026-10-01T00:00:00Z' }],
				annotations: [
					{ epubPosition: 'c1', content: 'nota nova' },
					{ epubPosition: 'c1', content: 'nota antiga' },
				],
			}
			vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson(data))
			const res = await fetchReadingNotesRemote('1')
			expect(res.highlights).toHaveLength(1)
			expect(res.highlights[0]).toMatchObject({ id: 'c1', color: 'rosa' })
			expect(res.notes).toEqual([{ cfiRange: 'c1', content: 'nota nova' }])
		})
	})

	describe('envio e mutações remotas', () => {
		it('sendHighlight faz POST com { excerpt, epubPosition, color }', () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true } as Response)
			sendHighlight('9', makeHighlight({ text: 'abc', cfiRange: 'cfiZ', color: 'verde' }))
			const [url, init] = spy.mock.calls[0]
			expect(String(url)).toContain('/api/reading/9/highlights')
			expect(init?.method).toBe('POST')
			expect(JSON.parse(String(init?.body))).toEqual({ excerpt: 'abc', epubPosition: 'cfiZ', color: 'verde' })
		})

		it('recolorir/nota/excluir remotos ainda não chamam a API (mutações locais por ora)', () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch')
			updateHighlightRemote('9', 'cfi1', 'azul')
			updateHighlightNoteRemote('9', 'cfi1', 'x')
			removeHighlightRemote('9', 'cfi1')
			expect(spy).not.toHaveBeenCalled()
		})
	})
})
