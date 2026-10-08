import { z } from 'zod'

export const profileSchema = z
	.object({
		name: z.string().trim().min(2, 'Informe seu nome completo.'),
		currentPassword: z.string(),
		newPassword: z.string(),
		confirmNewPassword: z.string(),
	})
	.superRefine((val, ctx) => {
		const touchedPassword =
			val.currentPassword !== '' || val.newPassword !== '' || val.confirmNewPassword !== ''
		if (!touchedPassword) return

		if (val.currentPassword === '') {
			ctx.addIssue({ path: ['currentPassword'], code: 'custom', message: 'Informe a senha atual.' })
		}
		if (val.newPassword.length < 8) {
			ctx.addIssue({ path: ['newPassword'], code: 'custom', message: 'A nova senha deve ter ao menos 8 caracteres.' })
		} else if (val.newPassword.length > 128) {
			ctx.addIssue({ path: ['newPassword'], code: 'custom', message: 'A nova senha deve ter no máximo 128 caracteres.' })
		}
		if (val.confirmNewPassword !== val.newPassword) {
			ctx.addIssue({ path: ['confirmNewPassword'], code: 'custom', message: 'As senhas não coincidem.' })
		}
	})

export type ProfileForm = z.infer<typeof profileSchema>
