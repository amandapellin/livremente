import { Stack, TextField, Typography } from '@mui/material'

const fields = [
	{ label: 'Senha atual', helper: undefined as string | undefined },
	{ label: 'Nova senha', helper: 'Mínimo 8 caracteres' },
	{ label: 'Confirmar nova senha', helper: undefined },
]

/**
 * Bloco "Senha" — apenas visual (placeholder). A troca de senha é um fluxo de
 * segurança separado, fora do escopo do RF03.
 */
export default function PasswordSection() {
	return (
		<Stack sx={{ gap: 1, borderTop: 1, borderColor: 'divider', pt: 2 }}>
			<Typography variant="h6" component="h2">
				Senha
			</Typography>
			<Typography variant="caption" sx={{ color: 'text.secondary' }}>
				Última alteração em 12 de março de 2026.
			</Typography>
			<Stack sx={{ gap: 1.5, pt: 1 }}>
				{fields.map((f) => (
					<Stack key={f.label} sx={{ gap: 0.75, maxWidth: 320 }}>
						<Typography variant="caption" component="label" sx={{ color: 'text.secondary' }}>
							{f.label}
						</Typography>
						<TextField type="password" size="small" fullWidth disabled helperText={f.helper} />
					</Stack>
				))}
			</Stack>
		</Stack>
	)
}
