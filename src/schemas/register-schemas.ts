import { z } from 'zod'

// Idade máxima plausível: define o ano mínimo aceito para a data de nascimento
// (não anterior a hoje − MAX_AGE_YEARS, não posterior a hoje). Issue #81.
export const MAX_AGE_YEARS = 120

const pad = (n: number) => String(n).padStart(2, '0')
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Limites válidos da data de nascimento como strings "YYYY-MM-DD" (recalculados a
// cada chamada para não "congelar" o dia). Reusados pela validação e pelo input date.
export function birthDateBounds(): { min: string; max: string } {
	const now = new Date()
	const minDate = new Date(now)
	minDate.setFullYear(minDate.getFullYear() - MAX_AGE_YEARS)
	return { min: isoDate(minDate), max: isoDate(now) }
}

export const cadastroSchema = z
	.object({
		name: z.string().trim().min(2, 'Informe seu nome completo.'),
		birthDate: z
			.string()
			.min(1, 'Informe sua data de nascimento.')
			.superRefine((v, ctx) => {
				// Datas ISO "YYYY-MM-DD" comparam-se corretamente como string.
				if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(new Date(v).getTime())) {
					ctx.addIssue({ code: 'custom', message: 'Data de nascimento inválida.' })
					return
				}
				const { min, max } = birthDateBounds()
				if (v > max) {
					ctx.addIssue({ code: 'custom', message: 'A data de nascimento não pode ser futura.' })
				} else if (v < min) {
					ctx.addIssue({ code: 'custom', message: `Ano de nascimento inválido.` })
				}
			}),
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
