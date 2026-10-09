import type { ReactNode } from 'react'
import { Button, ClickAwayListener, Paper } from '@mui/material'

interface Props {
	top: number
	left: number
	label: string
	icon: ReactNode
	onAction: () => void
	onClose: () => void
}

export default function HighlightToolbar({ top, left, label, icon, onAction, onClose }: Props) {
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
				<Button size="small" color="inherit" startIcon={icon} onClick={onAction} sx={{ px: 1.5 }}>
					{label}
				</Button>
			</Paper>
		</ClickAwayListener>
	)
}
