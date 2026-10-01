import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import {
	apiToPreferences,
	emptyPreferences,
	preferencesToEav,
	preferencesToGenres,
	type PreferencesValue,
} from '@/schemas/preferences-schemas'
import {
	getGetApiUsersMeGenresQueryKey,
	getGetApiUsersMePreferencesQueryKey,
	useGetApiUsersMeGenres,
	useGetApiUsersMePreferences,
	usePutApiUsersMeGenres,
	usePutApiUsersMePreferences,
} from '@/api/generated/endpoints'
import type { UserGenres, UserPreferences } from '@/api/generated/model'

/**
 * Lógica das preferências de leitura no perfil (RF04). Combina DOIS recursos do
 * back-end: as preferências EAV (`/me/preferences` — idioma, tipo, área) e os
 * gêneros/categorias de livro (`/me/genres`). Busca ambos para pré-preencher e
 * salva os dois em paralelo, reaproveitando o formato de UI do cadastro.
 */
export function useProfilePreferences() {
	const queryClient = useQueryClient()

	const prefsQuery = useGetApiUsersMePreferences()
	const genresQuery = useGetApiUsersMeGenres()
	// customFetch só resolve em respostas ok; o 200 carrega o corpo.
	const eav = prefsQuery.data?.status === 200 ? prefsQuery.data.data : undefined
	const genres = genresQuery.data?.status === 200 ? genresQuery.data.data : undefined
	const isLoaded = eav !== undefined && genres !== undefined

	const [success, setSuccess] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	const savePrefs = usePutApiUsersMePreferences()
	const saveGenres = usePutApiUsersMeGenres()

	const methods = useForm<PreferencesValue>({
		defaultValues: emptyPreferences,
		// Prefill: quando as duas queries resolvem, o RHF sincroniza o form.
		values: isLoaded ? apiToPreferences(eav, genres?.genres) : undefined,
	})

	const onSubmit = methods.handleSubmit(async (values) => {
		setSubmitError(null)
		try {
			const [prefsRes, genresRes] = await Promise.all([
				savePrefs.mutateAsync({ data: preferencesToEav(values) as UserPreferences }),
				saveGenres.mutateAsync({ data: preferencesToGenres(values) as UserGenres }),
			])
			if (prefsRes.status !== 200 || genresRes.status !== 200) {
				setSubmitError('Não foi possível salvar as preferências. Tente novamente.')
				return
			}
			setSuccess(true)
			queryClient.invalidateQueries({ queryKey: getGetApiUsersMePreferencesQueryKey() })
			queryClient.invalidateQueries({ queryKey: getGetApiUsersMeGenresQueryKey() })
		} catch {
			setSubmitError('Não foi possível salvar as preferências. Tente novamente.')
		}
	})

	return {
		methods,
		onSubmit,
		isDirty: methods.formState.isDirty,
		isLoading: prefsQuery.isLoading || genresQuery.isLoading,
		isLoadError: prefsQuery.isError || genresQuery.isError,
		isSaving: savePrefs.isPending || saveGenres.isPending,
		success,
		submitError,
		dismissSuccess: () => setSuccess(false),
	}
}
