import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { EditOutlined, TipsAndUpdatesOutlined } from '@mui/icons-material'
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import type { Publication, PublicationCard as PublicationCardApi, ReadingLanguage } from '@/api/generated/model'
import PublicationGridCard from '@/components/catalog/publication-grid-card'
import { fetchRecommendations, type Recommendations } from '@/utils/recommendations'

// Mesmo adaptador do catálogo/estante: card do back-end → Publication do front
// (author/genre únicos), mantendo o card inalterado. `format`/`description` não
// vêm no card da listagem e ficam ausentes.
const toPublication = (c: PublicationCardApi): Publication => ({
	id: c.id,
	title: c.title,
	author: c.authors.join(', '),
	type: c.type,
	language: (c.language ?? '') as ReadingLanguage,
	genre: c.genres[0] ?? null,
	year: c.year ?? null,
	source: c.source === 'gutendex' ? 'Project Gutenberg' : c.source === 'arxiv' ? 'arXiv' : (c.source ?? null),
	coverUrl: c.coverUrl ?? null,
})

const GRID_SX = { display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' } as const

export default function RecomendacoesPage() {
	const [data, setData] = useState<Recommendations | null>(null)
	const [loading, setLoading] = useState(true)

	// Carga inicial (setState só no retorno assíncrono — evita setState síncrono no efeito).
	useEffect(() => {
		let cancelled = false
		fetchRecommendations(12).then((res) => {
			if (!cancelled) {
				setData(res)
				setLoading(false)
			}
		})
		return () => {
			cancelled = true
		}
	}, [])

	const items = data?.items ?? []

	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
			<Stack sx={{ gap: 0.5, mb: 3 }}>
				<Typography variant="overline" sx={{ color: 'text.secondary' }}>
					Para você
				</Typography>
				<Typography variant="h4" component="h1">
					Recomendações
				</Typography>
				<Typography variant="body1" sx={{ color: 'text.secondary' }}>
					Montadas a partir das preferências do seu cadastro e das obras que você leu na plataforma.
				</Typography>
			</Stack>

			{loading ? (
				<Box sx={GRID_SX}>
					{Array.from({ length: 10 }).map((_, i) => (
						<Skeleton key={i} variant="rounded" height={260} />
					))}
				</Box>
			) : items.length === 0 ? (
				// Estado para quando ainda não há recomendações (critério de aceite da #31).
				<Stack sx={{ alignItems: 'center', textAlign: 'center', py: 8, gap: 1 }}>
					<Typography variant="h6" component="p">
						Ainda não há recomendações
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
						Defina suas preferências e adicione obras à estante — vamos personalizar suas recomendações conforme
						você lê na plataforma.
					</Typography>
					<Button component={NavLink} to="/perfil" variant="contained" startIcon={<EditOutlined />} sx={{ mt: 1 }}>
						Ajustar preferências
					</Button>
				</Stack>
			) : (
				<Stack sx={{ gap: 2 }}>
					{data?.coldStart && (
						// Cold start: sem perfil ainda → mostramos os mais populares, com convite a personalizar.
						<Alert
							severity="info"
							icon={<TipsAndUpdatesOutlined />}
							action={
								<Button component={NavLink} to="/perfil" color="inherit" size="small" startIcon={<EditOutlined />}>
									Ajustar preferências
								</Button>
							}
						>
							Ainda estamos conhecendo seu gosto — por enquanto, mostramos as obras mais populares. Defina suas
							preferências e leia na plataforma para personalizar.
						</Alert>
					)}
					<Box sx={GRID_SX}>
						{items.map((it) => (
							<PublicationGridCard key={it.id} publication={toPublication(it)} />
						))}
					</Box>
				</Stack>
			)}
		</Box>
	)
}
