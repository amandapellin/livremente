import { Stack, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

interface Props {
	label: string
	color?: string
	sx?: object
}

export default function SessionTimer({ label, color, sx }: Props) {
	return (
		<Stack
			direction="row"
			aria-label={`Tempo de leitura da sessão: ${label}`}
			sx={{ gap: 0.5, alignItems: 'center', opacity: 0.8, color, ...sx }}
		>
			<AccessTimeIcon sx={{ fontSize: 16 }} />
			<Typography variant="caption" sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
				{label}
			</Typography>
		</Stack>
	)
}
