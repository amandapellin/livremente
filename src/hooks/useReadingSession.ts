import { useEffect, useState } from 'react'
import { addStoredReadingTime, formatDuration, sendReadingTime } from '@/utils/reading-session'

const FLUSH_INTERVAL_MS = 30_000

export const useReadingSession = (bookId?: string) => {
	const [seconds, setSeconds] = useState(0)

	useEffect(() => {
		let accumulatedMs = 0
		let startedAt: number | null = null
		let flushedMs = 0

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
			addStoredReadingTime(bookId, deltaSec)
			sendReadingTime(bookId, deltaSec)
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
