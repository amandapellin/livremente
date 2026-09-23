import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import {
	apiToPreferences,
	emptyPreferences,
	preferencesToApi,
	type PreferencesValue,
} from '@/schemas/preferences-schemas'
import {
	getGetApiUsersMePreferencesQueryKey,
	useGetApiUsersMePreferences,
	usePutApiUsersMePreferences,
} from '@/api/generated/endpoints'
import type { PublicationType, ReadingLanguage } from '@/api/generated/model'

/**
 * Lógica das preferências de leitura no perfil (RF04): busca as preferências
 * atuais para pré-preencher e salva as alterações. Reaproveita o mesmo formato
 * de UI do cadastro (`PreferencesValue`), convertendo de/para o array único
 * `categories` do contrato.
 */
export function useProfilePreferences() {
	const queryClient = useQueryClient()
	const prefsQuery = useGetApiUsersMePreferences()
	// customFetch só resolve em respostas ok; o 200 carrega o UserPreferences.
	const loaded = prefsQuery.data?.status === 200 ? prefsQuery.data.data : undefined

	const [success, setSuccess] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	const save = usePutApiUsersMePreferences()

	const methods = useForm<PreferencesValue>({
		defaultValues: emptyPreferences,
		// Prefill: quando a query resolve, o RHF sincroniza os valores do form.
		values: loaded ? apiToPreferences(loaded) : undefined,
	})

	const onSubmit = methods.handleSubmit((values) => {
		setSubmitError(null)
		const payload = preferencesToApi(values)
		save.mutate(
			{
				data: {
					languages: payload.languages as ReadingLanguage[],
					publications: payload.publications as PublicationType[],
					categories: payload.categories,
					literaryGenres: payload.literaryGenres,
				},
			},
			{
				onSuccess: (response) => {
					if (response.status !== 200) return
					setSuccess(true)
					queryClient.invalidateQueries({ queryKey: getGetApiUsersMePreferencesQueryKey() })
				},
				onError: () => setSubmitError('Não foi possível salvar as preferências. Tente novamente.'),
			},
		)
	})

	return {
		methods,
		onSubmit,
		isDirty: methods.formState.isDirty,
		isLoading: prefsQuery.isLoading,
		isLoadError: prefsQuery.isError,
		isSaving: save.isPending,
		success,
		submitError,
		dismissSuccess: () => setSuccess(false),
	}
}
