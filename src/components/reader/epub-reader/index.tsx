import { useEffect } from 'react'
import { Box } from '@mui/material'
import type { PublicationDetails } from '@/api/generated/model'
import type { ReaderTheme } from '@/types/reader-types'
import { useEpubReader } from '@/hooks/useEpubReader'
import { useReaderPreferences } from '@/hooks/useReaderPreferences'
import { useReadingSession } from '@/hooks/useReadingSession'
import { useBookmarks } from '@/hooks/useBookmarks'
import { readerThemeColors } from '@/constants/reader-const'
import ReaderTopbar from '@/components/reader/reader-topbar'
import ReaderView from '@/components/reader/reader-view'
import ReaderNav from '@/components/reader/reader-nav'

interface Props {
	data: PublicationDetails
}

export default function EpubReader({ data }: Props) {
	const reader = useEpubReader(data.epubFileUrl, data.id)
	const prefs = useReaderPreferences()
	const session = useReadingSession(data.id)
	const bookmarks = useBookmarks(data.id)
	const surface = readerThemeColors[reader.theme]
	const marked = bookmarks.has(reader.currentCfi)

	useEffect(() => {
		if (prefs.serverTheme) reader.setTheme(prefs.serverTheme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prefs.serverTheme])

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
			/>
			<ReaderView containerRef={reader.containerRef} isLoading={reader.isLoading} isError={reader.isError} />
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
		</Box>
	)
}
