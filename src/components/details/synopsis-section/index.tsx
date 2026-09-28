import { Paper, Stack, Typography } from '@mui/material'
import { fontFamilies } from '@/theme/tokens'

export default function SynopsisSection({ synopsis }: { synopsis?: string | null }) {
	if (!synopsis) return null
	return (
		<Paper variant="section" sx={{ p: 3 }}>
			<Stack sx={{ gap: 1 }}>
				<Typography variant="h5" component="h2">Sinopse</Typography>
				{synopsis.split('\n\n').map((p, i) => (
					<Typography key={i} sx={{ fontFamily: fontFamilies.heading, fontSize: 18, lineHeight: '30px' }}>{p}</Typography>
				))}
			</Stack>
		</Paper>
	)
}