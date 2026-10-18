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
	updateHighlightRemote,
} from '@/utils/reader-highlights'
import { fetchAnnotationsRemote, sendAnnotation } from '@/utils/reader-annotations'

export const useHighlights = (bookId?: string) => {
	const [highlights, setHighlights] = useState<Highlight[]>(() => (bookId ? getHighlights(bookId) : []))

	// RF22/RF23 (cross-device): semeia do back-end só quando o dispositivo ainda não
	// tem cópia local — assim creates vão ao servidor e aparecem em outro dispositivo,
	// sem re-semear/ressuscitar grifos já excluídos localmente (delete remoto virá
	// numa issue). Grifos primeiro, depois as notas (anotações) por cfiRange.
	useEffect(() => {
		if (!bookId || getHighlights(bookId).length > 0) return
		let cancelled = false
		void (async () => {
			const remote = await fetchHighlightsRemote(bookId)
			if (cancelled) return
			remote.forEach((h) => saveHighlight(bookId, h))
			const notes = await fetchAnnotationsRemote(bookId)
			if (cancelled) return
			notes.forEach((n) => updateHighlightNote(bookId, n.cfiRange, n.content))
			if (remote.length > 0 || notes.length > 0) setHighlights(getHighlights(bookId))
		})()
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
		const prev = highlights.find((h) => h.id === id)
		const hadNote = Boolean(prev?.note && prev.note.trim())
		setHighlights(updateHighlightNote(bookId, id, note))
		// Back (#28): cria a anotação só na 1ª nota (o back só tem create+list; editar/
		// limpar fica local até existir endpoint de update/delete de anotação).
		if (prev && !hadNote && note.trim()) sendAnnotation(bookId, prev.text, note, prev.cfiRange)
	}

	return { highlights, add, remove, setColor, setNote }
}
