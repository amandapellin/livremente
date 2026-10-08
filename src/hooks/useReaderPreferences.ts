import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
	getGetApiUsersMePreferencesQueryKey,
	useGetApiUsersMePreferences,
	usePutApiUsersMePreferences,
} from '@/api/generated/endpoints'
import type { UserPreferences } from '@/api/generated/model'
import { useIsAuthenticated } from '@/hooks/useAuth'
import type { ReaderTheme } from '@/types/reader-types'
import {
	getResumeAuto,
	getSaveDictionary,
	getStoredTheme,
	setResumeAuto as cacheResumeAuto,
	setSaveDictionary as cacheSaveDictionary,
	setStoredTheme,
} from '@/utils/reader-preferences'

type ReaderPrefs = Pick<UserPreferences, 'theme' | 'resumeAuto' | 'saveDictionary'>

/**
 * Preferências de interface do leitor — tema, retomar, dicionário (RF26).
 * Fonte da verdade no back-end (campos estendidos em `/api/users/me/preferences`,
 * **merge parcial**), com **cache em `localStorage`** para o leitor ler de forma
 * síncrona (sem flash). A query hidrata o cache ao abrir perfil/leitor; só roda
 * autenticado (o leitor acessível sem sessão não dispara chamada protegida).
 */
export function useReaderPreferences() {
	const queryClient = useQueryClient()
	const authed = useIsAuthenticated()
	const key = getGetApiUsersMePreferencesQueryKey()

	const query = useGetApiUsersMePreferences({ query: { enabled: authed } })
	const server = query.data?.status === 200 ? query.data.data : undefined

	// Hidrata o cache local quando o servidor responde (só efeito, sem setState).
	useEffect(() => {
		if (!server) return
		if (server.theme) setStoredTheme(server.theme)
		if (typeof server.resumeAuto === 'boolean') cacheResumeAuto(server.resumeAuto)
		if (typeof server.saveDictionary === 'boolean') cacheSaveDictionary(server.saveDictionary)
	}, [server])

	const save = usePutApiUsersMePreferences()

	const update = (partial: ReaderPrefs) => {
		// Cache imediato (o leitor lê daqui, sem flash).
		if (partial.theme) setStoredTheme(partial.theme)
		if (typeof partial.resumeAuto === 'boolean') cacheResumeAuto(partial.resumeAuto)
		if (typeof partial.saveDictionary === 'boolean') cacheSaveDictionary(partial.saveDictionary)
		// Atualização otimista do cache de query (reflete no perfil na hora).
		queryClient.setQueryData(key, (old: typeof query.data) =>
			old && old.status === 200 ? { ...old, data: { ...old.data, ...partial } } : old,
		)
		// Persiste no back-end (merge parcial) — só autenticado.
		if (authed) {
			save.mutate(
				{ data: partial as UserPreferences },
				{ onSettled: () => queryClient.invalidateQueries({ queryKey: key }) },
			)
		}
	}

	// Valores efetivos: servidor → cache local → padrão.
	const theme = (server?.theme ?? getStoredTheme()) as ReaderTheme

	return {
		theme,
		resumeAuto: server?.resumeAuto ?? getResumeAuto(),
		saveDictionary: server?.saveDictionary ?? getSaveDictionary(),
		/** Tema vindo do servidor (para o leitor sincronizar ao abrir); undefined até carregar. */
		serverTheme: (server?.theme ?? undefined) as ReaderTheme | undefined,
		setTheme: (value: ReaderTheme) => update({ theme: value }),
		setResumeAuto: (value: boolean) => update({ resumeAuto: value }),
		setSaveDictionary: (value: boolean) => update({ saveDictionary: value }),
	}
}
