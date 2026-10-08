import { z } from 'zod'

export const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Informe seu e-mail.')
		.pipe(z.email('E-mail inválido.')),
	password: z.string().min(1, 'Informe sua senha.'),
	rememberMe: z.boolean(),
})

export type LoginForm = z.infer<typeof loginSchema>

export const initialLoginForm: LoginForm = {
	email: '',
	password: '',
	rememberMe: false,
}
