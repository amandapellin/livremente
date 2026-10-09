import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import type { PublicationDetails } from '@/api/generated/model'
import type { ReaderTheme } from '@/types/reader-types'
import { useEpubReader } from '@/hooks/useEpubReader'
import { useReaderPreferences } from '@/hooks/useReaderPreferences'
import { useReadingSession } from '@/hooks/useReadingSession'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useHighlights } from '@/hooks/useHighlights'
import { readerThemeColors } from '@/constants/reader-const'
import ReaderTopbar from '@/components/reader/reader-topbar'
import ReaderView from '@/components/reader/reader-view'
import ReaderNav from '@/components/reader/reader-nav'
import HighlightToolbar from '@/components/reader/highlight-toolbar'
import HighlightsPanel from '@/components/reader/highlights-panel'

interface Props {
	data: PublicationDetails
}

export default function EpubReader({ data }: Props) {
	const reader = useEpubReader(data.epubFileUrl, data.id)
	const prefs = useReaderPreferences()
	const session = useReadingSession(data.id)
	const bookmarks = useBookmarks(data.id)
	const highlights = useHighlights(data.id)
	const surface = readerThemeColors[reader.theme]
	const marked = bookmarks.has(reader.currentCfi)
	const [panelOpen, setPanelOpen] = useState(false)
	const appliedRef = useRef(false)

	useEffect(() => {
		if (prefs.serverTheme) reader.setTheme(prefs.serverTheme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prefs.serverTheme])

	useEffect(() => {
		if (reader.isLoading || appliedRef.current) return
		appliedRef.current = true
		highlights.highlights.forEach((h) => reader.addHighlight(h.cfiRange))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reader.isLoading])

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

	const createHighlight = () => {
		const sel = reader.selection
		if (!sel) return
		reader.addHighlight(sel.cfiRange)
		highlights.add({
			id: sel.cfiRange,
			cfiRange: sel.cfiRange,
			text: sel.text,
			chapter: reader.chapter,
			createdAt: Date.now(),
		})
		reader.clearSelection()
	}

	const removeActive = () => {
		const mark = reader.activeMark
		if (!mark) return
		reader.removeHighlight(mark.cfiRange)
		highlights.remove(mark.cfiRange)
		reader.clearActiveMark()
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, bgcolor: surface.background, transition: 'background-color .15s' }}>
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
			/>
			<Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
				<ReaderView containerRef={reader.containerRef} isLoading={reader.isLoading} isError={reader.isError} />
				{panelOpen && (
					<HighlightsPanel
						highlights={highlights.highlights}
						surface={surface}
						onSelect={(h) => reader.display(h.cfiRange)}
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
					label="Grifar"
					icon={<BorderColorOutlinedIcon fontSize="small" />}
					onAction={createHighlight}
					onClose={reader.clearSelection}
				/>
			)}
			{reader.activeMark && (
				<HighlightToolbar
					top={reader.activeMark.top}
					left={reader.activeMark.left}
					label="Remover grifo"
					icon={<DeleteOutlineIcon fontSize="small" />}
					onAction={removeActive}
					onClose={reader.clearActiveMark}
				/>
			)}
		</Box>
	)
}
