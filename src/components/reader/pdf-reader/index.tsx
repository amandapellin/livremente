import { useEffect, useState } from 'react'
import { Alert, Box, CircularProgress, Stack } from '@mui/material'
import type { PublicationDetails } from '@/api/generated/model'
import { colors } from '@/theme/tokens'
import { useReadingSession } from '@/hooks/useReadingSession'
import { fetchReadingFileBlob } from '@/utils/reading-file'
import PdfTopbar from '@/components/reader/pdf-topbar'

interface Props {
	data: PublicationDetails
}

export default function PdfReader({ data }: Props) {
	const session = useReadingSession(data.id)
	const subtitle = [data.source, data.type === 'scientific_article' ? 'artigo científico' : 'livro', data.format]
		.filter(Boolean)
		.join(' · ')

	// O proxy do PDF agora exige autenticação (ler exige login). O iframe não envia o
	// header Authorization, então buscamos o arquivo com o JWT e exibimos via Blob URL.
	const [blobUrl, setBlobUrl] = useState<string | null>(null)
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

	useEffect(() => {
		let objectUrl: string | null = null
		let cancelled = false
		fetchReadingFileBlob(`/api/reading/${data.id}/pdf`).then((blob) => {
			if (cancelled) return
			if (!blob) {
				setStatus('error')
				return
			}
			objectUrl = URL.createObjectURL(blob)
			setBlobUrl(objectUrl)
			setStatus('ready')
		})
		return () => {
			cancelled = true
			if (objectUrl) URL.revokeObjectURL(objectUrl)
		}
	}, [data.id])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, bgcolor: colors.papel[800] }}>
			<PdfTopbar
				backTo={`/obra/${data.id}`}
				title={data.title}
				subtitle={subtitle}
				sessionTime={session.label}
				externalUrl={data.downloadUrl}
				externalLabel={`Abrir no ${data.source ?? 'site'}`}
			/>
			<Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
				{status === 'loading' && (
					<Stack sx={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
						<CircularProgress />
					</Stack>
				)}
				{status === 'error' && (
					<Alert severity="error" sx={{ m: 2 }}>
						Não foi possível carregar o arquivo. Verifique se você está autenticado e tente novamente.
					</Alert>
				)}
				{blobUrl && (
					<iframe
						src={blobUrl}
						title={data.title}
						style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
					/>
				)}
			</Box>
		</Box>
	)
}
