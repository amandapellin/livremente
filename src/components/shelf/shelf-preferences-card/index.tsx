import { useState } from 'react'
import { NavLink } from 'react-router'
import { EditOutlined } from '@mui/icons-material'
import { Box, Button, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { useGetApiUsersMeGenres, useGetApiUsersMePreferences } from '@/api/generated/endpoints'
import { areasArtigos, categoriasLivros, generosLiterarios, idiomaOptions } from '@/schemas/category-schemas'
import { colors } from '@/theme/tokens'

// Mapa slug→label unindo idiomas, áreas de artigo, categorias e gêneros de livro.
const labelMap = new Map(
	[...idiomaOptions, ...areasArtigos, ...categoriasLivros, ...generosLiterarios].map((o) => [o.value, o.label]),
)
const labelOf = (slug: string): string => labelMap.get(slug) ?? slug

// Quantos chips mostrar antes do "+N mais" (card estreito na sidebar).
const VISIBLE = 6

/**
 * Card read-only das preferências de leitura na sidebar da estante (#27): chips de
 * idiomas, áreas e gêneros + atalho para editar no perfil. Lê os mesmos endpoints
 * do perfil (/me/preferences + /me/genres).
 */
export default function ShelfPreferencesCard() {
	const prefsQuery = useGetApiUsersMePreferences()
	const genresQuery = useGetApiUsersMeGenres()
	const eav = prefsQuery.data?.status === 200 ? prefsQuery.data.data : undefined
	const genres = genresQuery.data?.status === 200 ? genresQuery.data.data : undefined
	const isLoading = prefsQuery.isLoading || genresQuery.isLoading

	const [expanded, setExpanded] = useState(false)
	const chips = [...(eav?.languages ?? []), ...(eav?.knowledgeAreas ?? []), ...(genres?.genres ?? [])]
	const hidden = Math.max(0, chips.length - VISIBLE)
	const visibleChips = expanded ? chips : chips.slice(0, VISIBLE)

	return (
		<Paper variant="section" sx={{ p: 3 }}>
			<Stack sx={{ gap: 2 }}>
				<Typography variant="overline" sx={{ color: 'text.secondary' }}>
					Preferências de leitura
				</Typography>

				{isLoading ? (
					<Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} variant="rounded" width={80} height={30} />
						))}
					</Stack>
				) : chips.length === 0 ? (
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Você ainda não escolheu preferências.
					</Typography>
				) : (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						{visibleChips.map((slug) => (
							<Chip
								key={slug}
								label={labelOf(slug)}
								size="small"
								sx={{ bgcolor: colors.gold[100], color: colors.gold[900], border: `1px solid ${colors.gold[600]}` }}
							/>
						))}
						{hidden > 0 && (
							<Chip
								label={expanded ? 'Mostrar menos' : `+${hidden} mais`}
								size="small"
								variant="outlined"
								onClick={() => setExpanded((v) => !v)}
								aria-expanded={expanded}
								sx={{
									cursor: 'pointer',
									color: 'primary.main',
									borderColor: colors.papel[300],
									fontWeight: 600,
									'&:hover': { bgcolor: colors.papel[100] },
								}}
							/>
						)}
					</Box>
				)}

				<Typography variant="caption" sx={{ color: 'text.secondary' }}>
					Usadas junto ao seu histórico para gerar recomendações.
				</Typography>

				<Button
					component={NavLink}
					to="/perfil"
					variant="contained"
					color="primary"
					size="small"
					startIcon={<EditOutlined />}
					sx={{ alignSelf: 'flex-start' }}
				>
					Editar Preferências
				</Button>
			</Stack>
		</Paper>
	)
}
