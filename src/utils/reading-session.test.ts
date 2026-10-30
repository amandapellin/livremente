import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import {
	formatDuration,
	getStoredReadingTime,
	addStoredReadingTime,
	startSession,
	updateSession,
} from './reading-session'

const okJson = (data: unknown) => ({ ok: true, json: async () => data }) as Response

describe('reading-session', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => vi.restoreAllMocks())

	describe('formatDuration', () => {
		it('formata m:ss abaixo de uma hora', () => {
			expect(formatDuration(0)).toBe('0:00')
			expect(formatDuration(65)).toBe('1:05')
			expect(formatDuration(59)).toBe('0:59')
		})

		it('formata h:mm:ss a partir de uma hora', () => {
			expect(formatDuration(3600)).toBe('1:00:00')
			expect(formatDuration(3661)).toBe('1:01:01')
		})

		it('arredonda para baixo e trata negativo como zero', () => {
			expect(formatDuration(90.9)).toBe('1:30')
			expect(formatDuration(-5)).toBe('0:00')
		})
	})

	describe('tempo armazenado por obra (localStorage)', () => {
		it('zero quando não há nada salvo', () => {
			expect(getStoredReadingTime('1')).toBe(0)
		})

		it('acumula os segundos somando sobre o valor anterior', () => {
			addStoredReadingTime('1', 30)
			addStoredReadingTime('1', 15)
			expect(getStoredReadingTime('1')).toBe(45)
		})

		it('valor inválido no storage vira 0', () => {
			localStorage.setItem('reader:time:1', 'abc')
			expect(getStoredReadingTime('1')).toBe(0)
		})
	})

	describe('startSession', () => {
		it('sem token devolve null sem chamar a API', async () => {
			const spy = vi.spyOn(globalThis, 'fetch')
			expect(await startSession('1')).toBeNull()
			expect(spy).not.toHaveBeenCalled()
		})

		it('abre a sessão (POST) e devolve o sessionId', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson({ sessionId: 99 }))
			expect(await startSession('7')).toBe(99)
			const [url, init] = spy.mock.calls[0]
			expect(String(url)).toContain('/api/reading/7/session')
			expect(init?.method).toBe('POST')
		})

		it('resposta sem sessionId numérico devolve null', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			vi.spyOn(globalThis, 'fetch').mockResolvedValue(okJson({}))
			expect(await startSession('7')).toBeNull()
		})

		it('resposta não-ok devolve null', async () => {
			saveAuthTokens('tkn', 'rfr', true)
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response)
			expect(await startSession('7')).toBeNull()
		})
	})

	describe('updateSession (heartbeat fire-and-forget)', () => {
		it('sem token não chama a API', () => {
			const spy = vi.spyOn(globalThis, 'fetch')
			updateSession(99, 120)
			expect(spy).not.toHaveBeenCalled()
		})

		it('activeSeconds negativo não chama a API', () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch')
			updateSession(99, -1)
			expect(spy).not.toHaveBeenCalled()
		})

		it('com token faz PUT com keepalive e o corpo { activeSeconds }', () => {
			saveAuthTokens('tkn', 'rfr', true)
			const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true } as Response)
			updateSession(99, 120)
			const [url, init] = spy.mock.calls[0]
			expect(String(url)).toContain('/api/reading/sessions/99')
			expect(init?.method).toBe('PUT')
			expect(init?.keepalive).toBe(true)
			expect(JSON.parse(String(init?.body))).toEqual({ activeSeconds: 120 })
		})
	})
})
