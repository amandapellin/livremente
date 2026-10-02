import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'

interface Props {
	title: string
	children: ReactNode
}

export default function SettingsSection({ title, children }: Props) {
	return (
		<Stack sx={{ gap: 1 }}>
			<Typography variant="subtitle2">{title}</Typography>
			{children}
		</Stack>
	)
}
