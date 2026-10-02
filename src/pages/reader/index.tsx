import { useParams } from 'react-router'
import { Alert, Box, CircularProgress, Container } from '@mui/material'
import { usePublicationDetails } from '@/hooks/usePublicationDetails'
import PdfReader from '@/components/reader/pdf-reader'
import EpubReader from '@/components/reader/epub-reader'

/**
 * Resolve os detalhes da publicação e escolhe o leitor conforme o arquivo
 * disponível: PDF (RF16) ou EPUB (RF15). Cada leitor tem seu próprio hook.
 */
export default function LeitorPage() {
	const { id } = useParams()
	const { data, isLoading, isError } = usePublicationDetails(id)

	if (isLoading) {
		return (
			<Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
				<CircularProgress />
			</Box>
		)
	}

	if (isError || !data) {
		return (
			<Container maxWidth="sm" sx={{ py: 5 }}>
				<Alert severity="error">Não foi possível abrir a obra.</Alert>
			</Container>
		)
	}

	// key por obra: remonta o leitor ao trocar de publicação (estado limpo).
	if (data.pdfFileUrl) return <PdfReader key={data.id} data={data} />
	if (data.epubFileUrl) return <EpubReader key={data.id} data={data} />

	return (
		<Container maxWidth="sm" sx={{ py: 5 }}>
			<Alert severity="info">Esta obra não tem arquivo para leitura disponível.</Alert>
		</Container>
	)
}
