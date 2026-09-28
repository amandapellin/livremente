import { NavLink, useParams } from 'react-router'
import { Alert, Box, Container, Link, Skeleton, Stack, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { HttpError } from '@/api/fetcher'
import { usePublicationDetails } from '@/hooks/usePublicationDetails'
import PublicationHeader from '@/components/details/publication-header'
import SynopsisSection from '@/components/details/synopsis-section'
import MetadataAside from '@/components/details/metadata-aside'

export default function DetalhesObraPage() {
	const { id } = useParams()
	const { data, isLoading, isError, error } = usePublicationDetails(id)
	const notFound = isError && error instanceof HttpError && error.status === 404

	return (
		<Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
			<Link component={NavLink} to="/catalogo" underline="hover"
				sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'info.main', fontSize: 12, mb: 2 }}>
				<ChevronLeftIcon sx={{ fontSize: 16 }} /> Voltar à busca
			</Link>

			{isLoading ? (
				<Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 368px' } }}>
					<Stack sx={{ gap: 3 }}>
						<Skeleton variant="rounded" height={318} /><Skeleton variant="rounded" height={200} />
					</Stack>
					<Skeleton variant="rounded" height={480} />
				</Box>
			) : notFound ? (
				<Stack sx={{ alignItems: 'center', textAlign: 'center', py: 8, gap: 1 }}>
					<Typography variant="h6" component="p">Publicação não encontrada</Typography>
					<Link component={NavLink} to="/catalogo">Voltar à busca</Link>
				</Stack>
			) : isError || !data ? (
				<Alert severity="error">Não foi possível carregar os detalhes. Tente novamente.</Alert>
			) : (
				<Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 368px' }, alignItems: 'start' }}>
					<Stack sx={{ gap: 3 }}>
						<PublicationHeader
							publication={data}
							onSelectStatus={(status) => {
								// TODO(estante): persistir o estado quando o épico de Estante existir.
								console.debug('estante:', data.id, status)
							}}
						/>
						<SynopsisSection synopsis={data.synopsis} />
					</Stack>
					<MetadataAside publication={data} />
				</Box>
			)}
		</Container>
	)
}