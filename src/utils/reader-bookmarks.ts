import type { Bookmark } from '@/types/reader-types'

const PREFIX = 'reader:bookmarks:'

export const getBookmarks = (bookId: string): Bookmark[] => {
	try {
		const raw = localStorage.getItem(PREFIX + bookId)
		const list = raw ? (JSON.parse(raw) as Bookmark[]) : []
		return Array.isArray(list) ? list : []
	} catch {
		return []
	}
}

const persist = (bookId: string, list: Bookmark[]): Bookmark[] => {
	try {
		localStorage.setItem(PREFIX + bookId, JSON.stringify(list))
	} catch {
		/* storage indisponível — ignora */
	}
	return list
}

export const addBookmark = (bookId: string, bookmark: Bookmark): Bookmark[] => {
	const list = getBookmarks(bookId)
	if (list.some((b) => b.id === bookmark.id)) return list
	return persist(bookId, [...list, bookmark])
}

export const removeBookmark = (bookId: string, id: string): Bookmark[] =>
	persist(bookId, getBookmarks(bookId).filter((b) => b.id !== id))