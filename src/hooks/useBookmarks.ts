import { useState } from 'react'
import type { Bookmark } from '@/types/reader-types'
import { addBookmark, getBookmarks, removeBookmark } from '@/utils/reader-bookmarks'

export const useBookmarks = (bookId?: string) => {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => (bookId ? getBookmarks(bookId) : []))

	const add = (bookmark: Bookmark) => {
		if (bookId) setBookmarks(addBookmark(bookId, bookmark))
	}
	const remove = (id: string) => {
		if (bookId) setBookmarks(removeBookmark(bookId, id))
	}
	const has = (id: string) => bookmarks.some((b) => b.id === id)

	return { bookmarks, add, remove, has }
}