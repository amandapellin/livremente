import { Button, Stack, Typography } from '@mui/material'

/**
 * Bloco "Dados e privacidade" — apenas visual (placeholder). Exportar/excluir
 * dados e rever consentimento serão implementados em issues futuras.
 */
export default function PrivacySection() {
	return (
		<Stack sx={{ gap: 1, borderTop: 1, borderColor: 'divider', pt: 2 }}>
			<Typography variant="h6" component="h2">
				Dados e privacidade
			</Typography>
			<Typography variant="caption" sx={{ color: 'text.secondary' }}>
				Consentimento LGPD registrado em 12 de março de 2026.
			</Typography>
			<Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', pt: 1 }}>
				<Button variant="outlined" color="inherit" size="small" disabled>
					Exportar meus dados
				</Button>
				<Button variant="outlined" color="inherit" size="small" disabled>
					Rever consentimento
				</Button>
				<Button variant="outlined" color="error" size="small" disabled>
					Excluir conta e dados
				</Button>
			</Stack>
		</Stack>
	)
}
