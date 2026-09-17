import { Box, Paper, Stack, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import { colors } from '@/theme/tokens'

export interface FeatureCardProps {
	icon: SvgIconComponent
	title: string
	text: string
}

export default function FeatureCard({ icon: Icon, title, text }: FeatureCardProps) {
	return (
		<Paper
			elevation={0}
			sx={{ p: '25px', borderRadius: '12px', border: 1, borderColor: 'divider', boxShadow: '0px 4px 24px -4px rgba(0,35,111,0.12)' }}
		>
			<Stack sx={{ gap: 2, alignItems: 'flex-start' }}>
				<Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: colors.acao[50], color: 'primary.main' }}>
					<Icon fontSize="small" />
				</Box>
				<Typography variant="h5" sx={{ color: 'primary.main' }}>
					{title}
				</Typography>
				<Typography variant="body2" sx={{ color: 'text.secondary' }}>
					{text}
				</Typography>
			</Stack>
		</Paper>
	)
}