import { useCallback, useState } from 'react'

export interface AppNotification {
	id: string
	title: string
	body?: string
	createdAt: number
}

const KEY = 'livremente.notifications'
const SEEDED_KEY = 'livremente.notifications.seeded'

// Sem back-end de notificações: semeia algumas mensagens do próprio app na 1ª visita.
const seed = (): AppNotification[] => {
	const now = Date.now()
	return [
		{ id: 'welcome', title: 'Bem-vindo ao LivreMente!', body: 'Explore o acervo de livros e artigos e comece a ler.', createdAt: now },
		{
			id: 'tip-dict',
			title: 'Dica: dicionário integrado',
			body: 'Durante a leitura, selecione uma palavra e toque no ícone de dicionário para ver o significado.',
			createdAt: now - 1000,
		},
	]
}

const read = (): AppNotification[] => {
	try {
		const raw = localStorage.getItem(KEY)
		if (raw) {
			const list = JSON.parse(raw) as AppNotification[]
			return Array.isArray(list) ? list : []
		}
		// Primeira visita (nunca semeado): popula com as mensagens iniciais.
		if (!localStorage.getItem(SEEDED_KEY)) {
			const initial = seed()
			localStorage.setItem(KEY, JSON.stringify(initial))
			localStorage.setItem(SEEDED_KEY, '1')
			return initial
		}
		return []
	} catch {
		return []
	}
}

export const useNotifications = () => {
	const [notifications, setNotifications] = useState<AppNotification[]>(() => read())

	// Limpa todas (persiste a lista vazia — não re-semeia depois de limpar).
	const clear = useCallback(() => {
		setNotifications([])
		try {
			localStorage.setItem(KEY, JSON.stringify([]))
		} catch {
			/* storage indisponível — ignora */
		}
	}, [])

	return { notifications, clear }
}
