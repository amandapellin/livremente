import { Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export default function MetaSection({ label, children }: { label: string; children: ReactNode }) {
	return (
		<Stack sx={{ gap: 1 }}>
			<Typography variant="overline" sx={{ color: 'text.secondary' }}>{label}</Typography>
			{children}
		</Stack>
	)
}