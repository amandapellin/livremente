import { useEffect, useRef, useState } from 'react'
import { Box, GlobalStyles } from '@mui/material'
import type { PublicationDetails } from '@/api/generated/model'
import type { HighlightColor, ReaderTheme } from '@/types/reader-types'
import { useEpubReader } from '@/hooks/useEpubReader'
import { useReaderPreferences } from '@/hooks/useReaderPreferences'
import { useReadingSession } from '@/hooks/useReadingSession'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useHighlights } from '@/hooks/useHighlights'
import { DEFAULT_HIGHLIGHT, readerThemeColors } from '@/constants/reader-const'
import ReaderTopbar from '@/components/reader/reader-topbar'
import ReaderView from '@/components/reader/reader-view'
import ReaderNav from '@/components/reader/reader-nav'
import HighlightToolbar from '@/components/reader/highlight-toolbar'
import HighlightsPanel from '@/components/reader/highlights-panel'
import NoteDialog from '@/components/reader/note-dialog'
import DictionaryPopup from '@/components/reader/dictionary-popup'

interface Props {
	data: PublicationDetails
}

type DictTarget = { word: string; cfiRange: string; top: number; left: number }

// Primeira palavra da seleção, sem pontuação nas pontas (o dicionário é por palavra).
const firstWord = (text: string): string =>
	(text.trim().split(/\s+/)[0] ?? '').replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')

export default function EpubReader({ data }: Props) {
	// Proxy do back-end (mesma origem): evita CORS do Gutenberg e o "modo diretório" do epub.js.
	const reader = useEpubReader(data.epubFileUrl ? `/api/reading/${data.id}/epub` : null, data.id)
	const prefs = useReaderPreferences()
	const session = useReadingSession(data.id)
	const bookmarks = useBookmarks(data.id)
	const highlights = useHighlights(data.id)
	const surface = readerThemeColors[reader.theme]
	const marked = bookmarks.has(reader.currentCfi)
	const [panelOpen, setPanelOpen] = useState(false)
	const [noteTarget, setNoteTarget] = useState<string | null>(null)
	const [dictTarget, setDictTarget] = useState<DictTarget | null>(null)
	const appliedRef = useRef<Set<string>>(new Set())
	const noteHl = highlights.highlights.find((h) => h.cfiRange === noteTarget)

	useEffect(() => {
		if (prefs.serverTheme) reader.setTheme(prefs.serverTheme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prefs.serverTheme])

	// Desenha cada grifo uma vez (idempotente por cfiRange): cobre os grifos vindos
	// do back-end que chegam depois do carregamento, sem redesenhar os já aplicados;
	// esquece os removidos para permitir recriar o mesmo cfiRange depois.
	useEffect(() => {
		if (reader.isLoading) return
		const current = new Set(highlights.highlights.map((h) => h.cfiRange))
		highlights.highlights.forEach((h) => {
			if (appliedRef.current.has(h.cfiRange)) return
			appliedRef.current.add(h.cfiRange)
			reader.addHighlight(h.cfiRange, h.color ?? DEFAULT_HIGHLIGHT)
		})
		appliedRef.current.forEach((cfi) => {
			if (!current.has(cfi)) appliedRef.current.delete(cfi)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reader.isLoading, highlights.highlights])

	const activeHighlight = highlights.highlights.find((h) => h.cfiRange === reader.activeMark?.cfiRange)

	const changeTheme = (value: ReaderTheme) => {
		reader.setTheme(value)
		prefs.setTheme(value)
	}

	const toggleMark = () => {
		if (!reader.currentCfi) return
		if (marked) bookmarks.remove(reader.currentCfi)
		else
			bookmarks.add({
				id: reader.currentCfi,
				cfi: reader.currentCfi,
				label: reader.chapter || `${reader.progress}% lido`,
				createdAt: Date.now(),
			})
	}

	const createHighlight = (color: HighlightColor) => {
		const sel = reader.selection
		if (!sel) return
		reader.addHighlight(sel.cfiRange, color)
		appliedRef.current.add(sel.cfiRange) // já desenhado aqui; o efeito não redesenha
		highlights.add({
			id: sel.cfiRange,
			cfiRange: sel.cfiRange,
			text: sel.text,
			chapter: reader.chapter,
			color,
			createdAt: Date.now(),
		})
		reader.clearSelection()
	}

	const recolorActive = (color: HighlightColor) => {
		const mark = reader.activeMark
		if (!mark) return
		reader.removeHighlight(mark.cfiRange)
		reader.addHighlight(mark.cfiRange, color)
		highlights.setColor(mark.cfiRange, color)
		reader.clearActiveMark()
	}

	const removeActive = () => {
		const mark = reader.activeMark
		if (!mark) return
		reader.removeHighlight(mark.cfiRange)
		highlights.remove(mark.cfiRange)
		reader.clearActiveMark()
	}

	const annotateSelection = () => {
		const sel = reader.selection
		if (!sel) return
		if (!highlights.highlights.some((h) => h.id === sel.cfiRange)) {
			reader.addHighlight(sel.cfiRange, DEFAULT_HIGHLIGHT)
			appliedRef.current.add(sel.cfiRange) // já desenhado aqui; o efeito não redesenha
			highlights.add({
				id: sel.cfiRange,
				cfiRange: sel.cfiRange,
				text: sel.text,
				chapter: reader.chapter,
				color: DEFAULT_HIGHLIGHT,
				createdAt: Date.now(),
			})
		}
		setNoteTarget(sel.cfiRange)
		reader.clearSelection()
	}

	const annotateActive = () => {
		const mark = reader.activeMark
		if (!mark) return
		setNoteTarget(mark.cfiRange)
		reader.clearActiveMark()
	}

	// RF07: abre o popup de dicionário para a palavra selecionada, sem mexer na
	// posição de leitura (o popup é overlay). Guarda o cfiRange para o "Grifar palavra".
	const lookUpSelection = () => {
		const sel = reader.selection
		if (!sel) return
		const word = firstWord(sel.text)
		if (!word) return
		setDictTarget({ word, cfiRange: sel.cfiRange, top: sel.top, left: sel.left })
		reader.clearSelection()
	}

	const highlightFromDict = () => {
		if (!dictTarget) return
		if (!highlights.highlights.some((h) => h.id === dictTarget.cfiRange)) {
			reader.addHighlight(dictTarget.cfiRange, DEFAULT_HIGHLIGHT)
			appliedRef.current.add(dictTarget.cfiRange)
			highlights.add({
				id: dictTarget.cfiRange,
				cfiRange: dictTarget.cfiRange,
				text: dictTarget.word,
				chapter: reader.chapter,
				color: DEFAULT_HIGHLIGHT,
				createdAt: Date.now(),
			})
		}
		setDictTarget(null)
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, bgcolor: surface.background, transition: 'background-color .15s' }}>
			<GlobalStyles styles={{ '.epub-highlight': { pointerEvents: 'fill', cursor: 'pointer' } }} />
			<ReaderTopbar
				backTo={`/obra/${data.id}`}
				title={data.title}
				chapter={reader.chapter}
				progress={reader.progress}
				sessionTime={session.label}
				surface={surface}
				theme={reader.theme}
				fontScale={reader.fontScale}
				lineHeight={reader.lineHeight}
				fontFamily={reader.fontFamily}
				textAlign={reader.textAlign}
				pageType={reader.pageType}
				onThemeChange={changeTheme}
				onFontScaleChange={reader.setFontScale}
				onLineHeightChange={reader.setLineHeight}
				onFontFamilyChange={reader.setFontFamily}
				onTextAlignChange={reader.setTextAlign}
				onPageTypeChange={reader.setPageType}
				highlightsOpen={panelOpen}
				onToggleHighlights={() => setPanelOpen((v) => !v)}
				downloadUrl={data.downloadUrl}
			/>
			<Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
				<ReaderView containerRef={reader.containerRef} isLoading={reader.isLoading} isError={reader.isError} />
				{panelOpen && (
					<HighlightsPanel
						highlights={highlights.highlights}
						surface={surface}
						onSelect={(h) => reader.display(h.cfiRange)}
						onEditNote={(h) => setNoteTarget(h.cfiRange)}
						onRemove={(id) => {
							reader.removeHighlight(id)
							highlights.remove(id)
						}}
						onClose={() => setPanelOpen(false)}
					/>
				)}
			</Box>
			<ReaderNav
				surface={surface}
				onPrev={reader.prev}
				onNext={reader.next}
				marked={marked}
				onToggleMark={toggleMark}
				bookmarks={bookmarks.bookmarks}
				onSelectBookmark={(b) => b.cfi && reader.display(b.cfi)}
				onRemoveBookmark={bookmarks.remove}
			/>

			{reader.selection && (
				<HighlightToolbar
					top={reader.selection.top}
					left={reader.selection.left}
					onPick={createHighlight}
					onAnnotate={annotateSelection}
					onLookup={lookUpSelection}
					onClose={reader.clearSelection}
				/>
			)}

			{dictTarget && (
				<DictionaryPopup
					key={dictTarget.cfiRange}
					word={dictTarget.word}
					bookId={data.id}
					top={dictTarget.top}
					left={dictTarget.left}
					onHighlight={highlightFromDict}
					onClose={() => setDictTarget(null)}
				/>
			)}
			{reader.activeMark && (
				<HighlightToolbar
					top={reader.activeMark.top}
					left={reader.activeMark.left}
					activeColor={activeHighlight?.color}
					note={activeHighlight?.note}
					onPick={recolorActive}
					onAnnotate={annotateActive}
					onRemove={removeActive}
					onClose={reader.clearActiveMark}
				/>
			)}

			<NoteDialog
				key={noteTarget ?? 'none'}
				open={noteTarget !== null}
				initialValue={noteHl?.note ?? ''}
				onSave={(note) => noteTarget && highlights.setNote(noteTarget, note)}
				onClose={() => setNoteTarget(null)}
			/>
		</Box>
	)
}
