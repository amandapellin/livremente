import { useState } from 'react'
import { Box, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { colors } from '@/theme/tokens'
import { highlightFill } from '@/constants/reader-const'
import type { Highlight, ReaderSurface } from '@/types/reader-types'

type PanelTab = 'todos' | 'grifos' | 'anotacoes'

interface Props {
	highlights: Highlight[]
	surface: ReaderSurface
	onSelect: (highlight: Highlight) => void
	onEditNote: (highlight: Highlight) => void
	onRemove: (id: string) => void
	onClose: () => void
}

export default function HighlightsPanel({ highlights, surface, onSelect, onEditNote, onRemove, onClose }: Props) {
	const [tab, setTab] = useState<PanelTab>('todos')
	const ordered = [...highlights].sort((a, b) => b.createdAt - a.createdAt)
	const shown = ordered.filter((h) => (tab === 'anotacoes' ? h.note : tab === 'grifos' ? !h.note : true))
	const emptyLabel = tab === 'anotacoes' ? 'Selecione um trecho para anotar.' : 'Selecione um trecho no texto para grifar.'

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

			<Tabs
				value={tab}
				onChange={(_, v) => setTab(v)}
				variant="fullWidth"
				sx={{ minHeight: 40, borderBottom: `1px solid ${surface.border}`, '& .MuiTab-root': { minHeight: 40, color: 'inherit', opacity: 0.7 }, '& .Mui-selected': { opacity: 1 } }}
			>
				<Tab value="todos" label="Todos" />
				<Tab value="grifos" label="Grifos" />
				<Tab value="anotacoes" label="Anotações" />
			</Tabs>

			{shown.length === 0 ? (
				<Stack sx={{ alignItems: 'center', justifyContent: 'center', flex: 1, p: 3 }}>
					<Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
						{emptyLabel}
					</Typography>
				</Stack>
			) : (
				<Stack sx={{ gap: 1.5, p: 2, overflowY: 'auto' }}>
					{shown.map((h) => (
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
								'&:hover .hl-actions': { opacity: 1 },
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
								<Stack direction="row" className="hl-actions" sx={{ opacity: 0, transition: 'opacity .15s', mt: -0.5, mr: -0.5 }}>
									<IconButton
										aria-label={h.note ? 'Editar anotação' : 'Anotar'}
										size="small"
										onClick={(e) => {
											e.stopPropagation()
											onEditNote(h)
										}}
										sx={{ color: 'inherit' }}
									>
										<EditNoteIcon fontSize="small" />
									</IconButton>
									<IconButton
										aria-label="Remover grifo"
										size="small"
										onClick={(e) => {
											e.stopPropagation()
											onRemove(h.id)
										}}
										sx={{ color: 'inherit' }}
									>
										<DeleteOutlineIcon fontSize="small" />
									</IconButton>
								</Stack>
							</Stack>
							<Typography
								variant="body2"
								sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
							>
								{h.text}
							</Typography>
							{h.note && (
								<Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.75 }}>
									{h.note}
								</Typography>
							)}
						</Box>
					))}
				</Stack>
			)}
		</Stack>
	)
}
