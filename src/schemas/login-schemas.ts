import { z } from 'zod'

/** Validação do login (RF02): e-mail válido, senha não vazia, e "manter conectado". */
export const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Informe seu e-mail.')
		.pipe(z.email('E-mail inválido.')),
	password: z.string().min(1, 'Informe sua senha.'),
	/** "Manter conectado" — persiste a sessão entre aberturas do navegador. */
	rememberMe: z.boolean(),
})

export type LoginForm = z.infer<typeof loginSchema>

export const initialLoginForm: LoginForm = {
	email: '',
	password: '',
	rememberMe: false,
}
