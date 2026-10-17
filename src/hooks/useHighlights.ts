import { useEffect, useState } from 'react'
import type { Highlight, HighlightColor } from '@/types/reader-types'
import {
	deleteHighlight,
	fetchHighlightsRemote,
	getHighlights,
	removeHighlightRemote,
	saveHighlight,
	sendHighlight,
	updateHighlightColor,
	updateHighlightNote,
	updateHighlightNoteRemote,
	updateHighlightRemote,
} from '@/utils/reader-highlights'

export const useHighlights = (bookId?: string) => {
	const [highlights, setHighlights] = useState<Highlight[]>(() => (bookId ? getHighlights(bookId) : []))

	// RF22 (cross-device): semeia do back-end só quando o dispositivo ainda não tem
	// cópia local — assim creates vão ao servidor e aparecem em outro dispositivo, sem
	// re-semear/ressuscitar grifos já excluídos localmente (delete remoto virá numa issue).
	useEffect(() => {
		if (!bookId || getHighlights(bookId).length > 0) return
		let cancelled = false
		fetchHighlightsRemote(bookId).then((remote) => {
			if (cancelled || remote.length === 0) return
			remote.forEach((h) => saveHighlight(bookId, h))
			setHighlights(getHighlights(bookId))
		})
		return () => {
			cancelled = true
		}
	}, [bookId])

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
	const setColor = (id: string, color: HighlightColor) => {
		if (!bookId) return
		setHighlights(updateHighlightColor(bookId, id, color))
		updateHighlightRemote(bookId, id, color)
	}
	const setNote = (id: string, note: string) => {
		if (!bookId) return
		setHighlights(updateHighlightNote(bookId, id, note))
		updateHighlightNoteRemote(bookId, id, note)
	}

	return { highlights, add, remove, setColor, setNote }
}
