import { useEffect, useRef, useState } from 'react'
import ePub, { type Book, type Contents, type NavItem, type Rendition } from 'epubjs'
import type { HighlightColor, ReaderAlign, ReaderFont, ReaderPageType, ReaderTheme } from '@/types/reader-types'
import { FONT_FAMILIES, FONT_SIZE, highlightFill, LINE_SPACING, readerThemeColors } from '@/constants/reader-const'
import {
	getResumeAuto,
	getStoredPercentage,
	getStoredPosition,
	getStoredTheme,
	setStoredPercentage,
	setStoredPosition,
	setStoredTheme,
} from '@/utils/reader-preferences'
import { fetchLastPage, saveLastPage, savePercentage } from '@/utils/reader-progress'
import { fetchReadingFileBlob } from '@/utils/reading-file'

const PROGRESS_SYNC_MS = 4000

type RelocatedLocation = { start: { cfi: string; href: string } }

export type SelectionAnchor = { cfiRange: string; text: string; top: number; left: number }
export type MarkAnchor = { cfiRange: string; top: number; left: number }

const anchorFrom = (range: Range, contents: Contents): { top: number; left: number } => {
	const r = range.getBoundingClientRect()
	const frame = contents.document.defaultView?.frameElement as HTMLElement | null
	const f = frame?.getBoundingClientRect()
	return { top: (f?.top ?? 0) + r.top, left: (f?.left ?? 0) + r.left + r.width / 2 }
}

const findTocItem = (toc: NavItem[], href: string): NavItem | undefined => {
	for (const item of toc) {
		if (item.href && href.includes(item.href.split('#')[0])) return item
		const sub = item.subitems?.length ? findTocItem(item.subitems, href) : undefined
		if (sub) return sub
	}
	return undefined
}

const applyTypography = (r: Rendition, fontScale: number, lineHeight: number, font: ReaderFont, align: ReaderAlign) => {
	r.themes.fontSize(`${fontScale}%`)
	r.themes.override('line-height', String(lineHeight), true)
	r.themes.override('font-family', FONT_FAMILIES[font], true)
	r.themes.override('text-align', align, true)
}

const applyPageType = (r: Rendition, type: ReaderPageType) => {
	if (type === 'scroll') {
		r.flow('scrolled-doc')
		return
	}
	r.flow('paginated')
	r.spread(type === 'double' ? 'auto' : 'none')
}

const applyTheme = (r: Rendition, theme: ReaderTheme) => {
	const c = readerThemeColors[theme]
	r.themes.override('color', c.text, true)
	r.themes.override('background', c.background, true)
}

export const useEpubReader = (url: string | undefined | null, bookId?: string) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const renditionRef = useRef<Rendition | null>(null)
	const [chapter, setChapter] = useState('')
	const [currentCfi, setCurrentCfi] = useState('')
	const [selection, setSelection] = useState<SelectionAnchor | null>(null)
	const [activeMark, setActiveMark] = useState<MarkAnchor | null>(null)
	const [progress, setProgress] = useState(() => (bookId ? getStoredPercentage(bookId) ?? 0 : 0))
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [theme, setThemeState] = useState<ReaderTheme>(getStoredTheme)
	const [fontScale, setFontScale] = useState(FONT_SIZE.default)
	const [lineHeight, setLineHeight] = useState(LINE_SPACING.default)
	const [fontFamily, setFontFamily] = useState<ReaderFont>('editor')
	const [textAlign, setTextAlign] = useState<ReaderAlign>('justify')
	const [pageType, setPageType] = useState<ReaderPageType>('single')
	const [fileUrl, setFileUrl] = useState<string | null>(null)

	// Busca o EPUB com o JWT (o proxy agora exige autenticação) e cria um Blob URL
	// LOCAL. O epub.js carrega esse Blob URL (same-origin, sem precisar do header),
	// reusando o caminho já testado `ePub(url, { openAs: 'epub' })`.
	useEffect(() => {
		if (!url) return
		let objectUrl: string | null = null
		let cancelled = false
		fetchReadingFileBlob(url).then((blob) => {
			if (cancelled) return
			if (!blob) {
				setIsError(true)
				setIsLoading(false)
				return
			}
			objectUrl = URL.createObjectURL(blob)
			setFileUrl(objectUrl)
		})
		return () => {
			cancelled = true
			if (objectUrl) URL.revokeObjectURL(objectUrl)
		}
	}, [url])

	useEffect(() => {
		const el = containerRef.current
		if (!fileUrl || !el) return

		setIsLoading(true)
		setIsError(false)

		// Blob URL local (bytes já baixados com o JWT). openAs:'epub' força modo arquivo.
		const book: Book = ePub(fileUrl, { openAs: 'epub' })
		const rendition: Rendition = book.renderTo(el, { width: '100%', height: '100%' })
		renditionRef.current = rendition

		rendition.hooks.content.register((contents: { document: Document }) => {
			const style = contents.document.createElement('style')
			const fontFaces = `@font-face{font-family:'OpenDyslexic';src:url('${location.origin}/fonts/opendyslexic-regular.woff2') format('woff2');font-weight:400;font-display:swap}@font-face{font-family:'OpenDyslexic';src:url('${location.origin}/fonts/opendyslexic-bold.woff2') format('woff2');font-weight:700;font-display:swap}`
			// O tema controla a cor do texto. Vários EPUBs do Gutenberg trazem âncoras
			// vazias auto-fechadas (`<a id=".."/>`) que, parseadas como HTML (não XML),
			// abrem e embrulham o capítulo inteiro; como o CSS do livro tem
			// `a:hover{color:red}` e essas âncoras não têm `href` (logo `a:link` não as
			// pinta, mas `:hover` pega qualquer `<a>`), passar o mouse deixava o texto
			// todo vermelho. Forçar a cor dos `<a>` a herdar do tema mata o vermelho (e o
			// azul dos links), mantendo só os links reais (`a[href]`) sublinhados.
			const anchorReset = `a,a:link,a:visited,a:hover,a:active{color:inherit !important}a[href]{text-decoration:underline}`
			style.textContent = fontFaces + anchorReset
			contents.document.head.appendChild(style)
		})

		applyTheme(rendition, theme)
		applyTypography(rendition, fontScale, lineHeight, fontFamily, textAlign)
		applyPageType(rendition, pageType)

		const fail = () => {
			setIsError(true)
			setIsLoading(false)
		}

		const resizeObserver = new ResizeObserver(() => {
			try {
				rendition.resize(el.clientWidth, el.clientHeight)
			} catch {
				/* manager ainda não pronto ou já destruído */
			}
		})

		let latestCfi = ''
		let latestPct = -1
		let syncTimer: number | undefined

		// RF17/RN08 + RF19: salva a última página (índice de location) e o percentual
		// lido no back-end.
		const saveProgress = () => {
			if (!bookId || !latestCfi) return
			try {
				const loc = book.locations.locationFromCfi(latestCfi)
				if (typeof loc === 'number' && loc >= 0) saveLastPage(bookId, loc)
			} catch {
				/* locations ainda não geradas */
			}
			if (latestPct >= 0) savePercentage(bookId, latestPct)
		}
		const scheduleSync = () => {
			if (!bookId) return
			window.clearTimeout(syncTimer)
			syncTimer = window.setTimeout(saveProgress, PROGRESS_SYNC_MS)
		}
		const flushSync = () => {
			window.clearTimeout(syncTimer)
			saveProgress()
		}

		const updateProgress = (cfi: string) => {
			try {
				const pct = book.locations.percentageFromCfi(cfi)
				if (typeof pct === 'number' && !Number.isNaN(pct)) {
					const rounded = Math.round(pct * 100)
					latestPct = rounded
					setProgress(rounded)
					if (bookId) setStoredPercentage(bookId, rounded)
				}
			} catch {
				/* locations ainda não geradas */
			}
		}

		const resumeCfi = bookId && getResumeAuto() ? getStoredPosition(bookId) : undefined
		const onDisplayed = () => {
			setIsLoading(false)
			resizeObserver.observe(el)
		}
		rendition.display(resumeCfi).then(onDisplayed, () => {
			if (resumeCfi) rendition.display().then(onDisplayed, fail)
			else fail()
		})
		book.ready
			.then(() => book.locations.generate(1600))
			.then(async () => {
				const loc = rendition.currentLocation() as unknown as RelocatedLocation | undefined
				if (loc?.start?.cfi) updateProgress(loc.start.cfi)

				// RF18 — retomada cross-device: sem posição local e com "retomar"
				// ligado, salta para a última página salva no back-end.
				if (bookId && getResumeAuto() && !resumeCfi) {
					const backendLoc = await fetchLastPage(bookId)
					if (backendLoc != null) {
						const cfi = book.locations.cfiFromLocation(backendLoc)
						if (cfi) await rendition.display(cfi)
					}
				}
			})
			.catch(() => undefined)
		book.opened.catch(fail)

		rendition.on('relocated', (location: RelocatedLocation) => {
			if (bookId) setStoredPosition(bookId, location.start.cfi)
			setCurrentCfi(location.start.cfi)
			updateProgress(location.start.cfi)
			latestCfi = location.start.cfi
			scheduleSync()
			setSelection(null)
			setActiveMark(null)
			const item = findTocItem(book.navigation?.toc ?? [], location.start.href)
			if (item?.label) setChapter(item.label.trim())
		})

		rendition.on('selected', (cfiRange: string, contents: Contents) => {
			const sel = contents.window.getSelection()
			const text = sel?.toString().trim() ?? ''
			if (!text || !sel || sel.rangeCount === 0) return
			setSelection({ cfiRange, text, ...anchorFrom(sel.getRangeAt(0), contents) })
			setActiveMark(null)
		})

		rendition.on('markClicked', (cfiRange: string, _data: unknown, contents: Contents) => {
			const range = rendition.getRange(cfiRange)
			if (!range) return
			setActiveMark({ cfiRange, ...anchorFrom(range, contents) })
			setSelection(null)
		})

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') rendition.next()
			if (e.key === 'ArrowLeft') rendition.prev()
		}
		document.addEventListener('keydown', onKey)
		rendition.on('keyup', onKey)
		window.addEventListener('pagehide', flushSync)

		return () => {
			document.removeEventListener('keydown', onKey)
			window.removeEventListener('pagehide', flushSync)
			flushSync()
			resizeObserver.disconnect()
			rendition.destroy()
			book.destroy()
			renditionRef.current = null
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fileUrl])

	useEffect(() => {
		if (renditionRef.current) applyTheme(renditionRef.current, theme)
	}, [theme])

	useEffect(() => {
		renditionRef.current?.themes.fontSize(`${fontScale}%`)
	}, [fontScale])

	useEffect(() => {
		renditionRef.current?.themes.override('line-height', String(lineHeight), true)
	}, [lineHeight])

	useEffect(() => {
		renditionRef.current?.themes.override('font-family', FONT_FAMILIES[fontFamily], true)
	}, [fontFamily])

	useEffect(() => {
		renditionRef.current?.themes.override('text-align', textAlign, true)
	}, [textAlign])

	useEffect(() => {
		if (renditionRef.current) applyPageType(renditionRef.current, pageType)
	}, [pageType])

	const setTheme = (next: ReaderTheme) => {
		setThemeState(next)
		setStoredTheme(next)
	}

	const addHighlight = (cfiRange: string, color: HighlightColor) => {
		renditionRef.current?.annotations.add('highlight', cfiRange, {}, undefined, 'epub-highlight', {
			fill: highlightFill(color),
			'fill-opacity': '0.45',
			'mix-blend-mode': 'multiply',
		})
	}

	const removeHighlight = (cfiRange: string) => {
		renditionRef.current?.annotations.remove(cfiRange, 'highlight')
	}

	// Trecho de texto no início da página atual, para nomear a página marcada
	// (RF21) de forma reconhecível em vez de só pelo capítulo. Resolve o CFI do
	// topo visível em um Range e coleta ~72 caracteres a partir dele. Qualquer
	// falha → string vazia (quem chama cai para capítulo/percentual).
	const getSnippet = (): string => {
		const r = renditionRef.current
		if (!r) return ''
		try {
			const rawContents = r.getContents() as unknown
			const contents = (Array.isArray(rawContents) ? rawContents[0] : rawContents) as
				| { document: Document; range: (cfi: string) => Range }
				| undefined
			const loc = r.currentLocation() as unknown as RelocatedLocation | undefined
			const cfi = loc?.start?.cfi
			if (!contents || !cfi) return ''
			const range = contents.range(cfi)
			const start = range?.startContainer
			if (!start) return ''
			const walker = contents.document.createTreeWalker(contents.document.body, NodeFilter.SHOW_TEXT)
			walker.currentNode = start
			let text =
				start.nodeType === Node.TEXT_NODE
					? (start.textContent ?? '').slice(range.startOffset)
					: (start.textContent ?? '')
			// A coluna pode quebrar no meio de uma palavra (ex.: "th|e tiny"): se o
			// caractere anterior ao corte for letra/dígito, descarta o fragmento.
			if (start.nodeType === Node.TEXT_NODE && range.startOffset > 0) {
				const prev = (start.textContent ?? '')[range.startOffset - 1]
				if (prev && /[\p{L}\p{N}]/u.test(prev)) text = text.replace(/^\S+\s*/, '')
			}
			while (text.replace(/\s+/g, ' ').trim().length < 60 && walker.nextNode()) {
				text += ' ' + (walker.currentNode.textContent ?? '')
			}
			const clean = text.replace(/\s+/g, ' ').trim()
			return clean.length > 72 ? clean.slice(0, 72).trimEnd() + '…' : clean
		} catch {
			return ''
		}
	}

	return {
		containerRef,
		chapter,
		currentCfi,
		progress,
		isLoading,
		isError,
		theme,
		setTheme,
		selection,
		clearSelection: () => setSelection(null),
		activeMark,
		clearActiveMark: () => setActiveMark(null),
		addHighlight,
		removeHighlight,
		getSnippet,
		next: () => renditionRef.current?.next(),
		prev: () => renditionRef.current?.prev(),
		display: (cfi: string) => {
			renditionRef.current?.display(cfi)
		},
		fontScale,
		setFontScale,
		lineHeight,
		setLineHeight,
		fontFamily,
		setFontFamily,
		textAlign,
		setTextAlign,
		pageType,
		setPageType,
	}
}
