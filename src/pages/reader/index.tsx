import { useParams } from 'react-router'
import { Alert, Box, CircularProgress, Container } from '@mui/material'
import { usePublicationDetails } from '@/hooks/usePublicationDetails'
import { useEpubReader } from '@/hooks/useEpubReader'
import { readerThemeColors } from '@/constants/reader-const'
import ReaderTopbar from '@/components/reader/reader-topbar'
import ReaderView from '@/components/reader/reader-view'
import ReaderNav from '@/components/reader/reader-nav'

export default function LeitorPage() {
	const { id } = useParams()
	const { data, isLoading: loadingMeta, isError: metaError } = usePublicationDetails(id)
	const reader = useEpubReader(data?.epubFileUrl)

	if (loadingMeta) {
		return (
			<Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
				<CircularProgress />
			</Box>
		)
	}

	if (metaError || !data) {
		return (
			<Container maxWidth="sm" sx={{ py: 5 }}>
				<Alert severity="error">Não foi possível abrir a obra.</Alert>
			</Container>
		)
	}

	if (!data.epubFileUrl) {
		return (
			<Container maxWidth="sm" sx={{ py: 5 }}>
				<Alert severity="info">Esta obra não tem arquivo EPUB disponível.</Alert>
			</Container>
		)
	}

	const surface = readerThemeColors[reader.theme]

	return (
		// Preenche a área principal (header global escondido; footer fica abaixo).
		// O fundo acompanha o tema do leitor (cobre as margens da renderização).
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
