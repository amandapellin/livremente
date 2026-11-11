import { useEffect, useRef, useState } from 'react'
import { addStoredReadingTime, formatDuration, startSession, updateSession } from '@/utils/reading-session'

const FLUSH_INTERVAL_MS = 30_000

export const useReadingSession = (bookId?: string) => {
	const [seconds, setSeconds] = useState(0)
	// Guard por bookId: o StrictMode (dev) monta → desmonta → remonta o efeito,
	// o que abriria DUAS sessões. Cacheamos a Promise do startSession por bookId
	// para que a 2ª montagem reaproveite a sessão da 1ª (e ainda receba o id —
	// pular o startSession deixaria o efeito sobrevivente sem heartbeats).
	const startedFor = useRef<string | null>(null)
	const sessionPromise = useRef<Promise<number | null> | null>(null)

	useEffect(() => {
		let accumulatedMs = 0
		let startedAt: number | null = null
		let flushedMs = 0
		let sessionId: number | null = null

		// RF20: abre a sessão no back-end (só autenticado; EPUB e PDF).
		if (bookId) {
			if (startedFor.current !== bookId) {
				startedFor.current = bookId
				sessionPromise.current = startSession(bookId)
			}
			sessionPromise.current?.then((id) => { sessionId = id })
		}

		const isActive = () => document.visibilityState === 'visible' && document.hasFocus()
		const elapsed = () => accumulatedMs + (startedAt != null ? Date.now() - startedAt : 0)

		const resume = () => {
			if (startedAt == null) startedAt = Date.now()
		}
		const pause = () => {
			if (startedAt != null) {
				accumulatedMs += Date.now() - startedAt
				startedAt = null
			}
		}

		const flush = () => {
			if (!bookId) return
			const deltaSec = Math.round((elapsed() - flushedMs) / 1000)
			if (deltaSec <= 0) return
			flushedMs += deltaSec * 1000
			addStoredReadingTime(bookId, deltaSec) // cache por-dispositivo (delta acumulado)
			// Back-end (RF20): envia o TOTAL ativo da sessão (o PUT sobrescreve active_seconds).
			if (sessionId != null) updateSession(sessionId, Math.round(elapsed() / 1000))
		}

		const sync = () => (isActive() ? resume() : pause())
		const onLostFocus = () => {
			pause()
			flush()
		}

		sync()

		const tick = window.setInterval(() => {
			sync()
			setSeconds(Math.floor(elapsed() / 1000))
		}, 1000)
		const flusher = window.setInterval(flush, FLUSH_INTERVAL_MS)
		document.addEventListener('visibilitychange', sync)
		window.addEventListener('blur', onLostFocus)
		window.addEventListener('focus', sync)
		window.addEventListener('pagehide', onLostFocus)

		return () => {
			window.clearInterval(tick)
			window.clearInterval(flusher)
			document.removeEventListener('visibilitychange', sync)
			window.removeEventListener('blur', onLostFocus)
			window.removeEventListener('focus', sync)
			window.removeEventListener('pagehide', onLostFocus)
			pause()
			flush()
		}
	}, [bookId])

	return { seconds, label: formatDuration(seconds) }
}
