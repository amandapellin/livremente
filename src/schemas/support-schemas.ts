import { z } from 'zod'

// Formulário de contato do Suporte (#84). Limites espelham a validação do
// back-end (SupportValidation): name 2–120, email válido ≤254, subject 1–150,
// message 10–5000. `website` é o campo honeypot (fica oculto; deve chegar vazio).
export const MESSAGE_MAX = 5000

export const contactSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Informe seu nome (mínimo 2 caracteres).')
		.max(120, 'Nome muito longo (máximo 120 caracteres).'),
	email: z
		.string()
		.trim()
		.min(1, 'Informe seu e-mail.')
		.max(254, 'E-mail muito longo.')
		.pipe(z.email('E-mail inválido.')),
	subject: z
		.string()
		.trim()
		.min(1, 'Informe um assunto.')
		.max(150, 'Assunto muito longo (máximo 150 caracteres).'),
	message: z
		.string()
		.trim()
		.min(10, 'A mensagem deve ter ao menos 10 caracteres.')
		.max(MESSAGE_MAX, `A mensagem deve ter no máximo ${MESSAGE_MAX} caracteres.`),
	// Honeypot: humano deixa vazio; bot tende a preencher.
	website: z.string().max(0, '').optional(),
})

export type ContactForm = z.infer<typeof contactSchema>

export const initialContactForm: ContactForm = {
	name: '',
	email: '',
	subject: '',
	message: '',
	website: '',
}
