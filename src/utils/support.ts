import type { ContactForm } from '@/schemas/support-schemas'

const baseURL = import.meta.env.VITE_API_URL ?? ''

// Resultado do envio do formulário de contato do Suporte (#84). O endpoint
// `POST /api/support/contact` é público (não exige JWT).
type ContactErrorKind = 'validation' | 'rateLimit' | 'server' | 'network'

export type ContactResult = { ok: true } | { ok: false; kind: ContactErrorKind; message: string }

const MESSAGES: Record<ContactErrorKind, string> = {
	validation: 'Verifique os campos e tente novamente.',
	rateLimit: 'Você enviou muitas mensagens. Aguarde alguns minutos e tente novamente.',
	server: 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.',
	network: 'Falha de conexão. Verifique sua internet e tente novamente.',
}

// Envia a mensagem de contato. Mapeia os status do back para um resultado
// tratável na UI: 202 sucesso, 400 validação, 429 rate limit, 5xx/erro servidor.
export const sendContactMessage = async (values: ContactForm): Promise<ContactResult> => {
	let res: Response
	try {
		res = await fetch(`${baseURL}/api/support/contact`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: values.name,
				email: values.email,
				subject: values.subject,
				message: values.message,
				website: values.website ?? '',
			}),
		})
	} catch {
		return { ok: false, kind: 'network', message: MESSAGES.network }
	}

	if (res.ok) return { ok: true }

	if (res.status === 400) {
		// O back devolve { message, code }; usa a mensagem quando vier.
		const body = await res.json().catch(() => null)
		return { ok: false, kind: 'validation', message: body?.message ?? MESSAGES.validation }
	}
	if (res.status === 429) return { ok: false, kind: 'rateLimit', message: MESSAGES.rateLimit }
	return { ok: false, kind: 'server', message: MESSAGES.server }
}
