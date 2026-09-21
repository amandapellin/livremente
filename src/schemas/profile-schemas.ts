import { z } from 'zod'

/**
 * Validação da edição de perfil (RF03). O e-mail é read-only (troca exige
 * confirmação por e-mail — fluxo à parte), então só o nome é editável aqui.
 */
export const profileSchema = z.object({
	name: z.string().trim().min(2, 'Informe seu nome completo.'),
})

export type ProfileForm = z.infer<typeof profileSchema>
