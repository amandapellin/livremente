import { z } from 'zod'
import { Gender } from '@/api/generated/model'

/**
 * Estado do formulário de cadastro, acumulado ao longo das três etapas do
 * stepper (dados cadastrais, preferências e consentimento LGPD).
 */
export interface CadastroForm {
	// Etapa 1 — Dados cadastrais (RF01)
	name: string
	birthDate: string
	gender: string
	email: string
	password: string
	confirmPassword: string
	// Etapa 2 — Preferências de leitura
	languages: string[]
	materials: string[]
	categories: string[]
	literaryGenres: string[]
	// Etapa 3 — Consentimento (RN03)
	lgpdConsent: boolean
	marketingConsent: boolean
}

export const initialCadastroForm: CadastroForm = {
	name: '',
	birthDate: '',
	gender: '',
	email: '',
	password: '',
	confirmPassword: '',
	languages: [],
	materials: [],
	categories: [],
	literaryGenres: [],
	lgpdConsent: false,
	marketingConsent: false,
}

/** Validação da etapa 1 — dados cadastrais exigidos pelo RF01. */
export const dadosSchema = z
	.object({
		name: z.string().trim().min(2, 'Informe seu nome completo.'),
		birthDate: z
			.string()
			.min(1, 'Informe sua data de nascimento.')
			.refine((v) => {
				const d = new Date(v)
				return !Number.isNaN(d.getTime()) && d <= new Date()
			}, 'Data de nascimento inválida.'),
		gender: z.enum(Gender, { message: 'Selecione um gênero.' }),
		email: z
			.string()
			.trim()
			.min(1, 'Informe seu e-mail.')
			.pipe(z.email('E-mail inválido.')),
		password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
		confirmPassword: z.string().min(1, 'Confirme sua senha.'),
	})
	.refine((d) => d.password === d.confirmPassword, {
		path: ['confirmPassword'],
		message: 'As senhas não coincidem.',
	})

/** Validação da etapa 3 — o consentimento LGPD é obrigatório (RN03). */
export const lgpdSchema = z.object({
	lgpdConsent: z.literal(true, {
		message: 'É necessário aceitar o tratamento de dados para criar a conta.',
	}),
})

/**
 * Reduz um `ZodError` a um mapa campo → primeira mensagem, no formato usado
 * pelo estado de erros do formulário.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
	const out: Record<string, string> = {}
	for (const issue of error.issues) {
		const key = issue.path[0]
		if (typeof key === 'string' && !(key in out)) {
			out[key] = issue.message
		}
	}
	return out
}
