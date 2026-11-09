import { getAuthToken } from '@/api/auth-storage'
import { authedFetch } from '@/api/authed-fetch'

// Um dia com leitura (RF09, #35): minutos de tela ativa + nº de sessões.
export interface ReadingCalendarDay {
	date: string // yyyy-MM-dd
	activeMinutes: number
	sessionCount: number
}

// Calendário de frequência (espelha o ReadingCalendarDto do back). `days` é esparso
// (só dias com atividade); o componente preenche o grid do mês.
export interface ReadingCalendar {
	from: string
	to: string
	days: ReadingCalendarDay[]
}

// RF09 (#35): calendário de frequência de leitura do usuário. Sem from/to, o back
// usa o mês atual (e devolve o intervalo usado). Deslogado → null.
export const fetchReadingCalendar = async (from?: string, to?: string): Promise<ReadingCalendar | null> => {
	if (!getAuthToken()) return null
	const params = from && to ? `?from=${from}&to=${to}` : ''
	try {
		const res = await authedFetch(`/api/reading/calendar${params}`)
		return res.ok ? ((await res.json()) as ReadingCalendar) : null
	} catch {
		return null
	}
}
