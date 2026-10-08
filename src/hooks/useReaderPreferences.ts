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

export const useReaderPreferences = () => {
	const queryClient = useQueryClient()
	const authed = useIsAuthenticated()
	const key = getGetApiUsersMePreferencesQueryKey()

	const query = useGetApiUsersMePreferences({ query: { enabled: authed } })
	const server = query.data?.status === 200 ? query.data.data : undefined

	useEffect(() => {
		if (!server) return
		if (server.theme) setStoredTheme(server.theme)
		if (typeof server.resumeAuto === 'boolean') cacheResumeAuto(server.resumeAuto)
		if (typeof server.saveDictionary === 'boolean') cacheSaveDictionary(server.saveDictionary)
	}, [server])

	const save = usePutApiUsersMePreferences()

	const update = (partial: ReaderPrefs) => {
		if (partial.theme) setStoredTheme(partial.theme)
		if (typeof partial.resumeAuto === 'boolean') cacheResumeAuto(partial.resumeAuto)
		if (typeof partial.saveDictionary === 'boolean') cacheSaveDictionary(partial.saveDictionary)
		queryClient.setQueryData(key, (old: typeof query.data) =>
			old && old.status === 200 ? { ...old, data: { ...old.data, ...partial } } : old,
		)
		if (authed) {
			save.mutate(
				{ data: partial as UserPreferences },
				{ onSettled: () => queryClient.invalidateQueries({ queryKey: key }) },
			)
		}
	}

	const theme = (server?.theme ?? getStoredTheme()) as ReaderTheme

	return {
		theme,
		resumeAuto: server?.resumeAuto ?? getResumeAuto(),
		saveDictionary: server?.saveDictionary ?? getSaveDictionary(),
		serverTheme: (server?.theme ?? undefined) as ReaderTheme | undefined,
		setTheme: (value: ReaderTheme) => update({ theme: value }),
		setResumeAuto: (value: boolean) => update({ resumeAuto: value }),
		setSaveDictionary: (value: boolean) => update({ saveDictionary: value }),
	}
}
