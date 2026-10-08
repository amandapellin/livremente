import { useRef } from 'react'
import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { Avatar, Button, Stack, TextField, Typography } from '@mui/material'
import type { ProfileForm } from '@/schemas/profile-schemas'

export interface IdentitySectionAvatar {
	src?: string
	displayName: string
	error: string | null
	pick: (file: File) => void
	useInitials: () => void
	canRemove: boolean
}

export interface IdentitySectionProps {
	control: Control<ProfileForm>
	errors: FieldErrors<ProfileForm>
	email: string
	avatar: IdentitySectionAvatar
	disabled?: boolean
}

function initialsFromName(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return '?'
	const first = parts[0][0]
	const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
	return (first + last).toUpperCase()
}

export default function IdentitySection({ control, errors, email, avatar, disabled }: IdentitySectionProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) avatar.pick(file)
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
				<TextField value={email} fullWidth size="small" disabled />
			</Stack>
		</Stack>
	)
}
