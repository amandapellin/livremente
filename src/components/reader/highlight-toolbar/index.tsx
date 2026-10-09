import { Box, ClickAwayListener, Divider, IconButton, Paper, Stack } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { HIGHLIGHT_COLORS } from '@/constants/reader-const'
import { colors } from '@/theme/tokens'
import type { HighlightColor } from '@/types/reader-types'

interface Props {
	top: number
	left: number
	onPick: (color: HighlightColor) => void
	onClose: () => void
	activeColor?: HighlightColor
	onAnnotate?: () => void
	onRemove?: () => void
}

export default function HighlightToolbar({ top, left, onPick, onClose, activeColor, onAnnotate, onRemove }: Props) {
	return (
		<ClickAwayListener onClickAway={onClose}>
			<Paper
				elevation={6}
				sx={{
					position: 'fixed',
					top: Math.max(8, top - 52),
					left,
					transform: 'translateX(-50%)',
					zIndex: (t) => t.zIndex.tooltip,
					p: 0.5,
					borderRadius: 2,
				}}
			>
				<Stack direction="row" sx={{ alignItems: 'center', gap: 0.25 }}>
					{HIGHLIGHT_COLORS.map((c) => (
						<IconButton key={c.value} size="small" aria-label={`Grifar em ${c.label}`} onClick={() => onPick(c.value)}>
							<Box
								sx={{
									width: 18,
									height: 18,
									borderRadius: '50%',
									bgcolor: c.fill,
									border: '1px solid rgba(0,0,0,0.2)',
									outline: activeColor === c.value ? `2px solid ${colors.gold[700]}` : 'none',
									outlineOffset: 2,
								}}
							/>
						</IconButton>
					))}
					{(onAnnotate || onRemove) && <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />}
					{onAnnotate && (
						<IconButton size="small" aria-label="Anotar" onClick={onAnnotate}>
							<EditNoteIcon fontSize="small" />
						</IconButton>
					)}
					{onRemove && (
						<IconButton size="small" aria-label="Remover grifo" onClick={onRemove}>
							<DeleteOutlineIcon fontSize="small" />
						</IconButton>
					)}
				</Stack>
			</Paper>
		</ClickAwayListener>
	)
}
