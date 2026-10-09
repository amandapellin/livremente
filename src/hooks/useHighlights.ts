import { useState } from 'react'
import type { Highlight } from '@/types/reader-types'
import {
	deleteHighlight,
	getHighlights,
	removeHighlightRemote,
	saveHighlight,
	sendHighlight,
} from '@/utils/reader-highlights'

export const useHighlights = (bookId?: string) => {
	const [highlights, setHighlights] = useState<Highlight[]>(() => (bookId ? getHighlights(bookId) : []))

	const add = (highlight: Highlight) => {
		if (!bookId) return
		setHighlights(saveHighlight(bookId, highlight))
		sendHighlight(bookId, highlight)
	}
	const remove = (id: string) => {
		if (!bookId) return
		setHighlights(deleteHighlight(bookId, id))
		removeHighlightRemote(bookId, id)
	}

	return { highlights, add, remove }
}
