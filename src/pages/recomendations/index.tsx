import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { AutoAwesomeOutlined, EditOutlined, TipsAndUpdatesOutlined } from '@mui/icons-material'
import { Alert, Box, Button, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material'
import type { Publication, PublicationCard as PublicationCardApi, ReadingLanguage } from '@/api/generated/model'
import { useGetApiUsersMeGenres, useGetApiUsersMePreferences } from '@/api/generated/endpoints'
import { areasArtigos, categoriasLivros, generosLiterarios, idiomaOptions } from '@/schemas/category-schemas'
import PublicationGridCard from '@/components/catalog/publication-grid-card'
import ReadingStatsCards from '@/components/recommendations/reading-stats-cards'
import { fetchRecommendations, type Recommendations } from '@/utils/recommendations'
import { colors } from '@/theme/tokens'

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

// Mapa slug→label unindo idiomas, áreas de artigo, categorias e gêneros de livro
// (mesma fonte dos chips do perfil/estante).
const labelMap = new Map(
	[...idiomaOptions, ...areasArtigos, ...categoriasLivros, ...generosLiterarios].map((o) => [o.value, o.label]),
)
const labelOf = (slug: string): string => labelMap.get(slug) ?? slug

// Chips do header: poucos idiomas, mais gêneros (com "+N" para os demais gêneros).
const LANG_CHIPS = 2
const GENRE_CHIPS = 4
// Quantas obras por seção de gênero na listagem.
const SECTION_SIZE = 6
// Quantas recomendações buscar (mais itens = seções de gênero mais cheias).
const REC_LIMIT = 30

const goldChipSx = { bgcolor: colors.gold[100], color: colors.gold[900], border: `1px solid ${colors.gold[600]}` } as const

export default function RecomendacoesPage() {
	const [data, setData] = useState<Recommendations | null>(null)
	const [loading, setLoading] = useState(true)
	const [chipsExpanded, setChipsExpanded] = useState(false)

	// Preferências do usuário (chips do header, títulos e subtítulo das seções).
	const prefsQuery = useGetApiUsersMePreferences()
	const genresQuery = useGetApiUsersMeGenres()
	const eav = prefsQuery.data?.status === 200 ? prefsQuery.data.data : undefined
	const genres = genresQuery.data?.status === 200 ? genresQuery.data.data : undefined

	// Carga inicial (setState só no retorno assíncrono — evita setState síncrono no efeito).
	useEffect(() => {
		let cancelled = false
		fetchRecommendations(REC_LIMIT).then((res) => {
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
	const coldStart = data?.coldStart ?? false

	const languages = eav?.languages ?? []
	const areas = eav?.knowledgeAreas ?? []
	const genreSlugs = genres?.genres ?? []

	// Header: poucos idiomas + gêneros (áreas contam como interesses), com "+N".
	const langChips = languages.slice(0, LANG_CHIPS)
	const genreChips = [...genreSlugs, ...areas]
	const visibleGenreChips = chipsExpanded ? genreChips : genreChips.slice(0, GENRE_CHIPS)
	const hiddenGenres = Math.max(0, genreChips.length - GENRE_CHIPS)

	// Listagem: uma seção por gênero preferido (obras recomendadas desse gênero);
	// obras que não casam nenhum gênero preferido vão para "Outras recomendações".
	const genreSections = genreSlugs
		.map((slug) => ({
			slug,
			label: labelOf(slug),
			items: items.filter((it) => it.genres.includes(slug)).slice(0, SECTION_SIZE),
		}))
		.filter((s) => s.items.length > 0)
	const otherItems = items.filter((it) => !genreSlugs.some((g) => it.genres.includes(g))).slice(0, SECTION_SIZE * 2)
	const personalized = !coldStart && genreSections.length > 0

	// Subtítulo único (idioma do cadastro); os gêneros viram títulos das seções.
	const prefSubtitle = !coldStart && langChips.length
		? `Preferências do cadastro: idioma ${langChips.map((l) => labelOf(l).toLowerCase()).join(', ')}.`
		: null

	// Cabeçalho de uma seção da listagem: título + "Ver tudo" (abre a busca já filtrada).
	const sectionHeader = (title: string, to: string) => (
		<Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
			<Typography variant="h5" component="h2">
				{title}
			</Typography>
			<Typography
				component={NavLink}
				to={to}
				variant="subtitle2"
				sx={{ color: colors.info, textDecoration: 'underline', whiteSpace: 'nowrap', fontWeight: 500 }}
			>
				Ver tudo
			</Typography>
		</Stack>
	)

	const cardGrid = (list: PublicationCardApi[]) => (
		<Box sx={GRID_SX}>
			{list.map((it) => (
				<PublicationGridCard key={it.id} publication={toPublication(it)} />
			))}
		</Box>
	)

	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
			{/* Header: título + subtítulo à esquerda; chips de preferência + "Ajustar" à direita. */}
			<Paper
				variant="section"
				sx={{
					p: 3,
					mb: 3,
					display: 'flex',
					flexWrap: 'wrap',
					gap: 2,
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Stack sx={{ gap: 1, flex: '1 1 340px', minWidth: 260 }}>
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

				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 1,
						alignItems: 'center',
						justifyContent: 'flex-end',
						flexShrink: 0,
						maxWidth: 360,
					}}
				>
					{langChips.map((slug) => (
						<Chip key={slug} label={labelOf(slug)} size="small" sx={goldChipSx} />
					))}
					{visibleGenreChips.map((slug) => (
						<Chip key={slug} label={labelOf(slug)} size="small" sx={goldChipSx} />
					))}
					{hiddenGenres > 0 && (
						<Chip
							label={chipsExpanded ? 'Mostrar menos' : `+${hiddenGenres}`}
							size="small"
							variant="outlined"
							clickable
							onClick={() => setChipsExpanded((v) => !v)}
							aria-expanded={chipsExpanded}
							sx={{ color: 'primary.main', borderColor: colors.papel[300], fontWeight: 600 }}
						/>
					)}
					<Chip
						icon={<EditOutlined sx={{ fontSize: 16 }} />}
						label="Ajustar preferências"
						size="small"
						variant="outlined"
						clickable
						component={NavLink}
						to="/perfil"
						sx={{
							bgcolor: colors.papel[50],
							borderColor: colors.papel[300],
							color: 'text.secondary',
							'&:hover': { bgcolor: colors.papel[100] },
						}}
					/>
				</Box>
			</Paper>

			<Box sx={{ mb: 3 }}>
				<ReadingStatsCards />
			</Box>

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
						Defina suas preferências e adicione obras à estante — vamos personalizar suas recomendações conforme você
						lê na plataforma.
					</Typography>
					<Button component={NavLink} to="/perfil" variant="contained" startIcon={<EditOutlined />} sx={{ mt: 1 }}>
						Ajustar preferências
					</Button>
				</Stack>
			) : !personalized ? (
				// Cold start ou sem gêneros que casem: uma grade única (populares/para você).
				<Stack sx={{ gap: 1.5 }}>
					{coldStart && (
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
					{sectionHeader(coldStart ? 'Com base nas obras mais populares' : 'Recomendações para você', '/catalogo')}
					{cardGrid(items.slice(0, SECTION_SIZE * 2))}
				</Stack>
			) : (
				// Personalizado: uma seção por gênero preferido + "Outras recomendações".
				<Stack sx={{ gap: 4 }}>
					{prefSubtitle && (
						<Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, mt: -2 }}>
							<AutoAwesomeOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
							<Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
								{prefSubtitle}
							</Typography>
						</Stack>
					)}

					{genreSections.map((s) => (
						<Stack key={s.slug} sx={{ gap: 1.5 }}>
							{sectionHeader(`Com base em seu interesse por ${s.label}`, `/catalogo?genero=${s.slug}`)}
							{cardGrid(s.items)}
						</Stack>
					))}

					{otherItems.length > 0 && (
						<Stack sx={{ gap: 1.5 }}>
							{sectionHeader('Outras recomendações para você', '/catalogo')}
							{cardGrid(otherItems)}
						</Stack>
					)}
				</Stack>
			)}
		</Box>
	)
}
