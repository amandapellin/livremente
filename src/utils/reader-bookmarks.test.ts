import { describe, it, expect, beforeEach } from 'vitest'
import type { Bookmark } from '@/types/reader-types'
import { getBookmarks, addBookmark, removeBookmark } from './reader-bookmarks'

const makeBookmark = (o: Partial<Bookmark> = {}): Bookmark => ({
	id: 'b1',
	label: 'Capítulo 1',
	cfi: 'cfi1',
	createdAt: 1,
	...o,
})

describe('reader-bookmarks', () => {
	beforeEach(() => localStorage.clear())

	describe('getBookmarks', () => {
		it('devolve [] quando não há nada salvo', () => {
			expect(getBookmarks('1')).toEqual([])
		})

		it('devolve [] com JSON inválido', () => {
			localStorage.setItem('reader:bookmarks:1', 'nao-json')
			expect(getBookmarks('1')).toEqual([])
		})

		it('devolve [] quando o conteúdo salvo não é um array', () => {
			localStorage.setItem('reader:bookmarks:1', '{"id":"x"}')
			expect(getBookmarks('1')).toEqual([])
		})
	})

	describe('addBookmark', () => {
		it('adiciona uma marcação', () => {
			expect(addBookmark('1', makeBookmark())).toHaveLength(1)
			expect(getBookmarks('1')[0].id).toBe('b1')
		})

		it('deduplica por id (não adiciona a mesma marcação duas vezes)', () => {
			addBookmark('1', makeBookmark())
			expect(addBookmark('1', makeBookmark({ label: 'outro rótulo' }))).toHaveLength(1)
		})

		it('isola as marcações por obra', () => {
			addBookmark('1', makeBookmark({ id: 'a', cfi: 'a' }))
			addBookmark('2', makeBookmark({ id: 'b', cfi: 'b' }))
			expect(getBookmarks('1').map((b) => b.id)).toEqual(['a'])
			expect(getBookmarks('2').map((b) => b.id)).toEqual(['b'])
		})
	})

	describe('removeBookmark', () => {
		it('remove por id, preservando as demais', () => {
			addBookmark('1', makeBookmark({ id: 'a', cfi: 'a' }))
			addBookmark('1', makeBookmark({ id: 'b', cfi: 'b' }))
			expect(removeBookmark('1', 'a').map((b) => b.id)).toEqual(['b'])
			expect(getBookmarks('1').map((b) => b.id)).toEqual(['b'])
		})

		it('id inexistente não altera a lista', () => {
			addBookmark('1', makeBookmark({ id: 'a', cfi: 'a' }))
			expect(removeBookmark('1', 'zzz').map((b) => b.id)).toEqual(['a'])
		})
	})
})
