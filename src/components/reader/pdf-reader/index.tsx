import { Box } from '@mui/material'
import type { PublicationDetails } from '@/api/generated/model'
import { colors } from '@/theme/tokens'
import PdfTopbar from '@/components/reader/pdf-topbar'

interface Props {
	data: PublicationDetails
}

/**
 * Leitor de PDF (RF16): delega a renderização ao **visualizador nativo do
 * navegador** via `<iframe>` (scroll, zoom, miniaturas, busca e impressão vêm
 * prontos). Mantém uma topbar enxuta da marca com voltar, título e link externo.
 */
export default function PdfReader({ data }: Props) {
	const subtitle = [data.source, data.type === 'scientific_article' ? 'artigo científico' : 'livro', data.format]
		.filter(Boolean)
		.join(' · ')

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, bgcolor: colors.papel[800] }}>
			<PdfTopbar
				backTo={`/obra/${data.id}`}
				title={data.title}
				subtitle={subtitle}
				externalUrl={data.downloadUrl}
				externalLabel={`Abrir no ${data.source ?? 'site'}`}
			/>
			<Box sx={{ flex: 1, minHeight: 0 }}>
				<iframe
					src={data.pdfFileUrl ?? undefined}
					title={data.title}
					style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
				/>
			</Box>
		</Box>
	)
}
