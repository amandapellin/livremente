import { Box } from '@mui/material'
import type { PublicationDetails } from '@/api/generated/model'
import { useEpubReader } from '@/hooks/useEpubReader'
import { readerThemeColors } from '@/constants/reader-const'
import ReaderTopbar from '@/components/reader/reader-topbar'
import ReaderView from '@/components/reader/reader-view'
import ReaderNav from '@/components/reader/reader-nav'

interface Props {
	data: PublicationDetails
}

/**
 * Leitor de EPUB (RF15) via epub.js. O fundo acompanha o tema do leitor (cobre
 * as margens da renderização); topbar e navegação seguem a mesma cor.
 */
export default function EpubReader({ data }: Props) {
	const reader = useEpubReader(data.epubFileUrl)
	const surface = readerThemeColors[reader.theme]

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, bgcolor: surface.background, transition: 'background-color .15s' }}>
			<ReaderTopbar
				backTo={`/obra/${data.id}`}
				title={data.title}
				chapter={reader.chapter}
				progress={reader.progress}
				surface={surface}
				theme={reader.theme}
				fontScale={reader.fontScale}
				lineHeight={reader.lineHeight}
				fontFamily={reader.fontFamily}
				textAlign={reader.textAlign}
				pageType={reader.pageType}
				onThemeChange={reader.setTheme}
				onFontScaleChange={reader.setFontScale}
				onLineHeightChange={reader.setLineHeight}
				onFontFamilyChange={reader.setFontFamily}
				onTextAlignChange={reader.setTextAlign}
				onPageTypeChange={reader.setPageType}
			/>
			<ReaderView containerRef={reader.containerRef} isLoading={reader.isLoading} isError={reader.isError} />
			<ReaderNav surface={surface} onPrev={reader.prev} onNext={reader.next} />
		</Box>
	)
}
