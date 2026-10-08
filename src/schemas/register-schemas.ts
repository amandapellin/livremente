import { z } from 'zod'

export const cadastroSchema = z
	.object({
		name: z.string().trim().min(2, 'Informe seu nome completo.'),
		birthDate: z
			.string()
			.min(1, 'Informe sua data de nascimento.')
			.refine((v) => {
				const d = new Date(v)
				return !Number.isNaN(d.getTime()) && d <= new Date()
			}, 'Data de nascimento inválida.'),
		gender: z.string().min(1, 'Selecione um gênero.'),
		email: z
			.string()
			.trim()
			.min(1, 'Informe seu e-mail.')
			.pipe(z.email('E-mail inválido.')),
		password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
		confirmPassword: z.string().min(1, 'Confirme sua senha.'),
		languages: z.array(z.string()),
		publications: z.array(z.string()),
		bookCategories: z.array(z.string()),
		articleAreas: z.array(z.string()),
		literaryGenres: z.array(z.string()),
		lgpdConsent: z
			.boolean()
			.refine((v) => v, { message: 'É necessário aceitar o tratamento de dados para criar a conta.' }),
		marketingConsent: z.boolean(),
	})
	.refine((d) => d.password === d.confirmPassword, {
		path: ['confirmPassword'],
		message: 'As senhas não coincidem.',
	})

export type CadastroForm = z.infer<typeof cadastroSchema>

export const initialCadastroForm: CadastroForm = {
	name: '',
	birthDate: '',
	gender: '',
	email: '',
	password: '',
	confirmPassword: '',
	languages: [],
	publications: [],
	bookCategories: [],
	articleAreas: [],
	literaryGenres: [],
	lgpdConsent: false,
	marketingConsent: false,
}

export const stepFields = [
	['name', 'birthDate', 'gender', 'email', 'password', 'confirmPassword'],
	[],
	['lgpdConsent'],
] as const satisfies readonly (keyof CadastroForm)[][]
