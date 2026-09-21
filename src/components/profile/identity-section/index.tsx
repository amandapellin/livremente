import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { Avatar, Button, Stack, TextField, Typography } from '@mui/material'
import type { ProfileForm } from '@/schemas/profile-schemas'
import { colors } from '@/theme/tokens'

export interface IdentitySectionProps {
	control: Control<ProfileForm>
	errors: FieldErrors<ProfileForm>
	email: string
	/** Nome atual do usuário, usado para as iniciais do avatar. */
	displayName: string
}

function initialsFromName(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return '?'
	const first = parts[0][0]
	const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
	return (first + last).toUpperCase()
}

/**
 * Bloco "Identificação" — os campos editáveis do perfil (RF03): nome editável e
 * e-mail desativado (não alterável). O avatar (envio de imagem) é apenas visual.
 * O botão de salvar fica na página, abaixo do bloco de senha.
 */
export default function IdentitySection({ control, errors, email, displayName }: IdentitySectionProps) {
	return (
		<Stack sx={{ gap: 2 }}>
			<Typography variant="h6" component="h2">
				Identificação
			</Typography>

			<Stack direction="row" sx={{ gap: 2.25, alignItems: 'center', flexWrap: 'wrap' }}>
				<Avatar
					sx={{
						width: 72,
						height: 72,
						bgcolor: colors.gold[500],
						color: colors.papel[900],
						fontFamily: 'Lora, Georgia, serif',
						fontSize: 26,
					}}
				>
					{initialsFromName(displayName)}
				</Avatar>
				<Stack sx={{ gap: 1 }}>
					{/* Envio de imagem fica para outra issue — botões apenas visuais. */}
					<Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
						<Button variant="outlined" color="inherit" size="small" disabled>
							Enviar imagem
						</Button>
						<Button variant="outlined" color="inherit" size="small" disabled>
							Usar iniciais
						</Button>
					</Stack>
					<Typography variant="caption" sx={{ color: 'text.secondary' }}>
						PNG ou JPG de até 2 MB. Sem imagem, exibimos suas iniciais.
					</Typography>
				</Stack>
			</Stack>

			<Stack sx={{ gap: 0.75 }}>
				<Typography variant="caption" component="label" sx={{ color: 'text.secondary' }}>
					Nome completo
				</Typography>
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							size="small"
							error={Boolean(errors.name)}
							helperText={errors.name?.message}
						/>
					)}
				/>
			</Stack>

			<Stack sx={{ gap: 0.75 }}>
				<Typography variant="caption" component="label" sx={{ color: 'text.secondary' }}>
					E-mail
				</Typography>
				{/* E-mail não é alterável aqui (troca exige confirmação por e-mail). */}
				<TextField value={email} fullWidth size="small" disabled />
			</Stack>
		</Stack>
	)
}
