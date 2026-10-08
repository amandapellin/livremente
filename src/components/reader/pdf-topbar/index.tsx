import { NavLink } from 'react-router'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { colors } from '@/theme/tokens'
import SessionTimer from '@/components/reader/session-timer'

interface Props {
	backTo: string
	title: string
	subtitle: string
	sessionTime: string
	externalUrl?: string | null
	externalLabel: string
}

const squareSx = {
	width: 32,
	height: 32,
	borderRadius: '4px',
	border: `1px solid ${colors.papel[700]}`,
	color: colors.papel[200],
	'&:hover': { borderColor: colors.papel[400] },
}

export default function PdfTopbar({ backTo, title, subtitle, sessionTime, externalUrl, externalLabel }: Props) {
	return (
		<Stack
			direction="row"
			sx={{
				gap: 2,
				alignItems: 'center',
				px: 3,
				minHeight: 64,
				flexShrink: 0,
				bgcolor: colors.papel[900],
				color: colors.white,
				borderBottom: `1px solid ${colors.papel[700]}`,
			}}
		>
			<IconButton component={NavLink} to={backTo} aria-label="Voltar" sx={squareSx}>
				<ArrowBackIcon sx={{ fontSize: 18 }} />
			</IconButton>

			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography sx={{ fontSize: 16, lineHeight: '24px' }} noWrap>{title}</Typography>
				<Typography sx={{ fontSize: 12, lineHeight: '16px', color: colors.papel[400] }} noWrap>{subtitle}</Typography>
			</Box>

			<SessionTimer label={sessionTime} color={colors.papel[400]} sx={{ display: { xs: 'none', md: 'flex' } }} />

			{externalUrl && (
				<Stack
					component="a"
					href={externalUrl}
					target="_blank"
					rel="noopener noreferrer"
					direction="row"
					sx={{
						gap: 1,
						alignItems: 'center',
						px: 1.5,
						py: 0.5,
						borderRadius: 999,
						bgcolor: colors.primary[800],
						color: colors.white,
						textDecoration: 'none',
						fontSize: 12,
						fontWeight: 700,
						letterSpacing: '0.8px',
						whiteSpace: 'nowrap',
						boxShadow: 2,
						'&:hover': { bgcolor: colors.primary[700] },
					}}
				>
					<OpenInNewIcon sx={{ fontSize: 16 }} />
					{externalLabel}
				</Stack>
			)}
		</Stack>
	)
}
