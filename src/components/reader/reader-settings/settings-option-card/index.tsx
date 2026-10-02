import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { colors } from '@/theme/tokens'

interface Props {
	selected: boolean
	onClick: () => void
	children: ReactNode
	sx?: object
	'aria-label'?: string
	title?: string
}

export default function SettingsOptionCard({
	selected,
	onClick,
	children,
	sx,
	'aria-label': ariaLabel,
	title,
}: Props) {
	return (
		<Box
			component="button"
			type="button"
			aria-pressed={selected}
			aria-label={ariaLabel}
			title={title}
			onClick={onClick}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 0.75,
				px: 1.5,
				py: 1.5,
				borderRadius: 2,
				cursor: 'pointer',
				color: selected ? colors.gold[900] : 'text.primary',
				bgcolor: selected ? colors.gold[50] : 'transparent',
				border: selected ? `1px solid ${colors.gold[700]}` : '1px solid',
				borderColor: selected ? colors.gold[700] : 'divider',
				'&:hover': { borderColor: selected ? colors.gold[700] : 'text.secondary' },
				...sx,
			}}
		>
			{children}
		</Box>
	)
}
