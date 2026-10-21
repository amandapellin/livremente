import { NavLink } from 'react-router'
import { AutoStories } from '@mui/icons-material'
import { Box, Button, Card, LinearProgress, Stack, Typography } from '@mui/material'
import type { ReadingStatus } from '@/api/generated/model'
import type { ShelfItem } from '@/utils/shelf'
import PublicationCover from '@/components/catalog/publication-card/publication-cover'
import ShelfStatusMenu from '@/components/shelf/shelf-status-menu'
import { formatReadingTime } from '@/utils/format-reading-time'
import { colors, radii } from '@/theme/tokens'

interface Props {
	item: ShelfItem
	onSelectStatus: (status: ReadingStatus) => void
	onRemove: () => void
}

const formatLabel = (f: string | null): string | null => (f ? f.toUpperCase() : null)
const sourceLabel = (s?: string | null): string | null =>
	s === 'arxiv' ? 'arXiv' : s === 'gutendex' ? 'Project Gutenberg' : null

/**
 * Card da obra na visão Lista da estante (#27, RF05/RF14): capa, título,
 * autor · formato · fonte, progresso (% lido + tempo de leitura ativa RF20) e as
 * ações "Retomar" + dropdown de estado.
 */
export default function ShelfBookCard({ item, onSelectStatus, onRemove }: Props) {
	const { publication: pub, readPercentage, readingTimeMinutes, format } = item
	const percent = readPercentage ?? 0
	const time = formatReadingTime(readingTimeMinutes)
	const isArticle = pub.type === 'scientific_article'
	const meta = [pub.authors.join(', '), formatLabel(format), isArticle ? sourceLabel(pub.source) : null]
		.filter(Boolean)
		.join(' · ')

	return (
		<Card variant="outlined" sx={{ borderRadius: radii.card, p: 2, height: '100%' }}>
			<Stack sx={{ gap: 1, height: '100%' }}>
				<Box sx={{ alignSelf: 'center', width: '60%', maxWidth: 160 }}>
					<PublicationCover title={pub.title} coverUrl={pub.coverUrl} variant="full" />
				</Box>

				<Typography variant="h6" component="h3" sx={{ lineHeight: 1.2 }}>
					{pub.title}
				</Typography>
				<Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
					{meta}
				</Typography>

				<Stack sx={{ gap: 0.5, mt: 'auto', pt: 1 }}>
					<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
						<Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
							{percent}% lido
						</Typography>
						{time ? (
							<Typography variant="caption" sx={{ color: 'text.secondary' }}>
								{time}
							</Typography>
						) : null}
					</Stack>
					<LinearProgress
						variant="determinate"
						value={Math.min(100, Math.max(0, percent))}
						sx={{
							height: 6,
							borderRadius: 999,
							bgcolor: colors.papel[200],
							'& .MuiLinearProgress-bar': { bgcolor: colors.gold[500], borderRadius: 999 },
						}}
					/>
				</Stack>

				<Stack direction="row" sx={{ gap: 1, alignItems: 'center', pt: 1, flexWrap: 'wrap' }}>
					<Button
						component={NavLink}
						to={`/leitura/${pub.id}`}
						variant="contained"
						color="primary"
						size="small"
						startIcon={<AutoStories />}
					>
						Retomar
					</Button>
					<ShelfStatusMenu status={item.status} onSelect={onSelectStatus} onRemove={onRemove} />
				</Stack>
			</Stack>
		</Card>
	)
}
