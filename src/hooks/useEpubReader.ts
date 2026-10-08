import { useEffect, useRef, useState } from 'react'
import ePub, { type Book, type NavItem, type Rendition } from 'epubjs'
import type { ReaderAlign, ReaderFont, ReaderPageType, ReaderTheme } from '@/types/reader-types'
import { FONT_FAMILIES, FONT_SIZE, LINE_SPACING, readerThemeColors } from '@/constants/reader-const'
import {
	getResumeAuto,
	getStoredPosition,
	getStoredTheme,
	setStoredPosition,
	setStoredTheme,
} from '@/utils/reader-preferences'

type RelocatedLocation = { start: { cfi: string; href: string } }

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
	const [progress, setProgress] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [theme, setThemeState] = useState<ReaderTheme>(getStoredTheme)
	const [fontScale, setFontScale] = useState(FONT_SIZE.default)
	const [lineHeight, setLineHeight] = useState(LINE_SPACING.default)
	const [fontFamily, setFontFamily] = useState<ReaderFont>('editor')
	const [textAlign, setTextAlign] = useState<ReaderAlign>('justify')
	const [pageType, setPageType] = useState<ReaderPageType>('single')

	useEffect(() => {
		const el = containerRef.current
		if (!url || !el) return

		setIsLoading(true)
		setIsError(false)

		const book: Book = ePub(url)
		const rendition: Rendition = book.renderTo(el, { width: '100%', height: '100%' })
		renditionRef.current = rendition

		rendition.hooks.content.register((contents: { document: Document }) => {
			const style = contents.document.createElement('style')
			style.textContent = `@font-face{font-family:'OpenDyslexic';src:url('${location.origin}/fonts/opendyslexic-regular.woff2') format('woff2');font-weight:400;font-display:swap}@font-face{font-family:'OpenDyslexic';src:url('${location.origin}/fonts/opendyslexic-bold.woff2') format('woff2');font-weight:700;font-display:swap}`
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

		const resumeCfi = bookId && getResumeAuto() ? getStoredPosition(bookId) : undefined
		const onDisplayed = () => {
			setIsLoading(false)
			resizeObserver.observe(el)
		}
		rendition.display(resumeCfi).then(onDisplayed, () => {
			if (resumeCfi) rendition.display().then(onDisplayed, fail)
			else fail()
		})
		book.ready.then(() => book.locations.generate(1600)).catch(() => undefined)
		book.opened.catch(fail)

		rendition.on('relocated', (location: RelocatedLocation) => {
			if (bookId) setStoredPosition(bookId, location.start.cfi)
			try {
				const pct = book.locations.percentageFromCfi(location.start.cfi)
				if (typeof pct === 'number') setProgress(Math.round(pct * 100))
			} catch {
				/* locations ainda não geradas */
			}
			const item = findTocItem(book.navigation?.toc ?? [], location.start.href)
			if (item?.label) setChapter(item.label.trim())
		})

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') rendition.next()
			if (e.key === 'ArrowLeft') rendition.prev()
		}
		document.addEventListener('keydown', onKey)
		rendition.on('keyup', onKey)

		return () => {
			document.removeEventListener('keydown', onKey)
			resizeObserver.disconnect()
			rendition.destroy()
			book.destroy()
			renditionRef.current = null
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url])

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

	return {
		containerRef,
		chapter,
		progress,
		isLoading,
		isError,
		theme,
		setTheme,
		next: () => renditionRef.current?.next(),
		prev: () => renditionRef.current?.prev(),
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
