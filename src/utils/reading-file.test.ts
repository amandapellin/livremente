import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveAuthTokens } from '@/api/auth-storage'
import { fetchReadingFileBlob } from './reading-file'

describe('fetchReadingFileBlob', () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	afterEach(() => vi.restoreAllMocks())

	it('sem token devolve null sem chamar a API', async () => {
		const spy = vi.spyOn(globalThis, 'fetch')
		expect(await fetchReadingFileBlob('/api/reading/1/epub')).toBeNull()
		expect(spy).not.toHaveBeenCalled()
	})

	it('com token busca com Bearer e devolve o Blob', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		const blob = new Blob(['conteudo'], { type: 'application/epub+zip' })
		const spy = vi
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue({ ok: true, blob: async () => blob } as Response)
		expect(await fetchReadingFileBlob('/api/reading/9/epub')).toBe(blob)
		const [url, init] = spy.mock.calls[0]
		expect(String(url)).toBe('/api/reading/9/epub')
		expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer tkn')
	})

	it('resposta não-ok devolve null', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 502 } as Response)
		expect(await fetchReadingFileBlob('/api/reading/1/pdf')).toBeNull()
	})

	it('erro de rede devolve null (não propaga)', async () => {
		saveAuthTokens('tkn', 'rfr', true)
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
		expect(await fetchReadingFileBlob('/api/reading/1/epub')).toBeNull()
	})
})
