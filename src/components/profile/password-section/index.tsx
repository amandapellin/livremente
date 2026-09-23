import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { Stack, TextField, Typography } from '@mui/material'
import type { ProfileForm } from '@/schemas/profile-schemas'

export interface PasswordSectionProps {
	control: Control<ProfileForm>
	errors: FieldErrors<ProfileForm>
	/** Desabilita os campos durante o salvamento. */
	disabled?: boolean
}

const fields = [
	{ name: 'currentPassword', label: 'Senha atual', helper: undefined as string | undefined },
	{ name: 'newPassword', label: 'Nova senha', helper: 'Mínimo 8 caracteres' },
	{ name: 'confirmNewPassword', label: 'Confirmar nova senha', helper: undefined },
] as const

/**
 * Bloco "Senha" — troca de senha (RF03). Opcional: se os campos ficarem em
 * branco, a senha é mantida. A submissão é feita pelo botão único da página
 * ("Salvar alterações"), que chama `PATCH /api/users/me/password`.
 */
export default function PasswordSection({ control, errors, disabled }: PasswordSectionProps) {
	return (
		<Stack sx={{ gap: 1, borderTop: 1, borderColor: 'divider', pt: 2 }}>
			<Typography variant="h6" component="h2">
				Senha
			</Typography>
			<Typography variant="caption" sx={{ color: 'text.secondary' }}>
				Deixe em branco para manter a senha atual.
			</Typography>
			<Stack sx={{ gap: 1.5, pt: 1 }}>
				{fields.map((f) => (
					<Stack key={f.name} sx={{ gap: 0.75, maxWidth: 320 }}>
						<Typography variant="caption" component="label" sx={{ color: 'text.secondary' }}>
							{f.label}
						</Typography>
						<Controller
							name={f.name}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									type="password"
									size="small"
									fullWidth
									autoComplete={f.name === 'currentPassword' ? 'current-password' : 'new-password'}
									disabled={disabled}
									error={Boolean(errors[f.name])}
									helperText={errors[f.name]?.message ?? f.helper}
								/>
							)}
						/>
					</Stack>
				))}
			</Stack>
		</Stack>
	)
}
