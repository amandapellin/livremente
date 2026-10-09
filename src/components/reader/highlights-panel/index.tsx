import { Box, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { colors } from '@/theme/tokens'
import { highlightFill } from '@/constants/reader-const'
import type { Highlight, ReaderSurface } from '@/types/reader-types'

interface Props {
	highlights: Highlight[]
	surface: ReaderSurface
	onSelect: (highlight: Highlight) => void
	onRemove: (id: string) => void
	onClose: () => void
}

export default function HighlightsPanel({ highlights, surface, onSelect, onRemove, onClose }: Props) {
	const ordered = [...highlights].sort((a, b) => b.createdAt - a.createdAt)

	return (
		<Stack
			sx={{
				width: { xs: '100%', sm: 320 },
				flexShrink: 0,
				minHeight: 0,
				borderLeft: `1px solid ${surface.border}`,
				bgcolor: surface.background,
				color: surface.text,
			}}
		>
			<Stack
				direction="row"
				sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: `1px solid ${surface.border}` }}
			>
				<Typography variant="subtitle1">Grifos e Anotações</Typography>
				<IconButton aria-label="Fechar painel" size="small" onClick={onClose} sx={{ color: 'inherit' }}>
					<CloseIcon fontSize="small" />
				</IconButton>
			</Stack>

			{ordered.length === 0 ? (
				<Stack sx={{ alignItems: 'center', justifyContent: 'center', flex: 1, p: 3, gap: 1 }}>
					<Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
						Selecione um trecho no texto para grifar.
					</Typography>
				</Stack>
			) : (
				<Stack sx={{ gap: 1.5, p: 2, overflowY: 'auto' }}>
					{ordered.map((h) => (
						<Box
							key={h.id}
							role="button"
							tabIndex={0}
							onClick={() => onSelect(h)}
							onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(h)}
							sx={{
								position: 'relative',
								cursor: 'pointer',
								borderRadius: 1.5,
								border: `1px solid ${surface.border}`,
								p: 1.5,
								pl: 2,
								'&:hover': { borderColor: colors.gold[500] },
								'&:hover .hl-remove': { opacity: 1 },
								'&::before': {
									content: '""',
									position: 'absolute',
									left: 0,
									top: 8,
									bottom: 8,
									width: 3,
									borderRadius: 999,
									bgcolor: highlightFill(h.color),
								},
							}}
						>
							<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'start', gap: 1 }}>
								<Typography variant="overline" sx={{ opacity: 0.6 }}>
									{h.chapter || 'Trecho'}
								</Typography>
								<IconButton
									className="hl-remove"
									aria-label="Remover grifo"
									size="small"
									onClick={(e) => {
										e.stopPropagation()
										onRemove(h.id)
									}}
									sx={{ color: 'inherit', opacity: 0, transition: 'opacity .15s', mt: -0.5, mr: -0.5 }}
								>
									<DeleteOutlineIcon fontSize="small" />
								</IconButton>
							</Stack>
							<Typography
								variant="body2"
								sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
							>
								{h.text}
							</Typography>
						</Box>
					))}
				</Stack>
			)}
		</Stack>
	)
}
