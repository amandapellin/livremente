import { useRef } from 'react'
import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { Avatar, Button, Stack, TextField, Typography } from '@mui/material'
import type { ProfileForm } from '@/schemas/profile-schemas'

export interface IdentitySectionAvatar {
	/** URL da imagem a exibir; ausente = exibe as iniciais. */
	src?: string
	/** Nome atual, usado para as iniciais quando não há imagem. */
	displayName: string
	error: string | null
	/** Recebe o arquivo escolhido (validação de tipo/tamanho fica no hook). */
	pick: (file: File) => void
	/** Volta às iniciais (remove o avatar ao salvar). */
	useInitials: () => void
	/** Habilita "Usar iniciais" (há avatar no servidor ou imagem escolhida). */
	canRemove: boolean
}

export interface IdentitySectionProps {
	control: Control<ProfileForm>
	errors: FieldErrors<ProfileForm>
	email: string
	avatar: IdentitySectionAvatar
	/** Desabilita os controles durante o salvamento. */
	disabled?: boolean
}

function initialsFromName(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return '?'
	const first = parts[0][0]
	const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
	return (first + last).toUpperCase()
}

/**
 * Bloco "Identificação" — dados cadastrais do perfil (RF03): nome editável,
 * e-mail desativado (não alterável) e avatar (envio de imagem ou volta às
 * iniciais). O botão de salvar fica na página e cobre todos os blocos.
 */
export default function IdentitySection({ control, errors, email, avatar, disabled }: IdentitySectionProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) avatar.pick(file)
		// Permite reescolher o mesmo arquivo depois.
		event.target.value = ''
	}

	return (
		<Stack sx={{ gap: 2 }}>
			<Typography variant="h6" component="h2">
				Identificação
			</Typography>

			<Stack direction="row" sx={{ gap: 2.25, alignItems: 'center', flexWrap: 'wrap' }}>
				<Avatar src={avatar.src}>{initialsFromName(avatar.displayName)}</Avatar>
				<Stack sx={{ gap: 1 }}>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/png,image/jpeg"
						hidden
						onChange={onFileChange}
					/>
					<Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
						<Button
							variant="outlined"
							color="inherit"
							size="small"
							disabled={disabled}
							onClick={() => fileInputRef.current?.click()}
						>
							Enviar imagem
						</Button>
						<Button
							variant="outlined"
							color="inherit"
							size="small"
							disabled={disabled || !avatar.canRemove}
							onClick={avatar.useInitials}
						>
							Usar iniciais
						</Button>
					</Stack>
					<Typography
						variant="caption"
						sx={{ color: avatar.error ? 'error.main' : 'text.secondary' }}
					>
						{avatar.error ?? 'PNG ou JPG de até 2 MB. Sem imagem, exibimos suas iniciais.'}
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
							disabled={disabled}
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
