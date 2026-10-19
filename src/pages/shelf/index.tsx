import { useMemo, useState } from 'react'
import { Alert, Box, Chip, Container, Skeleton, Stack, Typography } from '@mui/material'
import type { Publication, PublicationCard as PublicationCardApi, ReadingLanguage, ReadingStatus } from '@/api/generated/model'
import { useShelf } from '@/hooks/useShelf'
import { readingStatusMap, readingStatusOptions } from '@/schemas/reading-status-schemas'
import PublicationCard from '@/components/catalog/publication-card'

// Mesmo adaptador do catálogo: card do back-end → Publication do front.
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

type Filter = ReadingStatus | 'all'

export default function EstantePage() {
	const { data, isLoading, isError } = useShelf()
	const [filter, setFilter] = useState<Filter>('all')

	const items = useMemo(
		() => (data ?? []).filter((it) => filter === 'all' || it.status === filter),
		[data, filter],
	)

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
			<Stack sx={{ gap: 0.5, mb: 3 }}>
				<Typography variant="h3" component="h1">Minha Estante</Typography>
				<Typography variant="body1" sx={{ color: 'text.secondary' }}>
					As obras que você está lendo, já leu, quer ler ou abandonou.
				</Typography>
			</Stack>

			{/* Filtro por estado */}
			<Stack direction="row" sx={{ gap: 1, mb: 3, flexWrap: 'wrap' }}>
				<Chip
					label="Todos"
					color={filter === 'all' ? 'primary' : 'default'}
					variant={filter === 'all' ? 'filled' : 'outlined'}
					onClick={() => setFilter('all')}
				/>
				{readingStatusOptions.map((o) => (
					<Chip
						key={o.value}
						label={o.label}
						color={filter === o.value ? 'primary' : 'default'}
						variant={filter === o.value ? 'filled' : 'outlined'}
						onClick={() => setFilter(o.value)}
					/>
				))}
			</Stack>

			{isLoading ? (
				<Stack sx={{ gap: 2 }}>
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} variant="rounded" height={132} />
					))}
				</Stack>
			) : isError ? (
				<Alert severity="error">Não foi possível carregar sua estante. Tente novamente.</Alert>
			) : items.length === 0 ? (
				<Stack sx={{ alignItems: 'center', textAlign: 'center', py: 8, gap: 1 }}>
					<Typography variant="h6" component="p">
						{filter === 'all' ? 'Sua estante está vazia' : 'Nenhuma obra neste estado'}
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Adicione obras à estante pela página de detalhes ou toque em "Ler agora".
					</Typography>
				</Stack>
			) : (
				<Stack sx={{ gap: 2 }}>
					{items.map((it) => {
						const s = readingStatusMap.get(it.status)
						return (
							<Stack key={it.publication.id} sx={{ gap: 0.75 }}>
								<Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
									<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s?.color }} />
									<Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
										{s?.label ?? it.status}
										{it.readPercentage != null ? ` · ${it.readPercentage}% lido` : ''}
									</Typography>
								</Stack>
								<PublicationCard publication={toPublication(it.publication)} />
							</Stack>
						)
					})}
				</Stack>
			)}
		</Container>
	)
}
