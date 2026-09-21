import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { profileSchema, type ProfileForm } from '@/schemas/profile-schemas'
import {
	getGetApiUsersMeQueryKey,
	useGetApiUsersMe,
	usePutApiUsersMe,
} from '@/api/generated/endpoints'
import { HttpError } from '@/api/fetcher'

/**
 * Lógica da tela de edição de perfil (RF03): busca os dados atuais para
 * pré-preencher o formulário, valida e salva o nome. O e-mail é read-only.
 */
export function useProfileForm() {
	const queryClient = useQueryClient()
	const profileQuery = useGetApiUsersMe()
	// customFetch só resolve em respostas ok; o 200 carrega o UserProfile.
	const profile = profileQuery.data?.status === 200 ? profileQuery.data.data : undefined

	const [success, setSuccess] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	const save = usePutApiUsersMe()

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isDirty },
	} = useForm<ProfileForm>({
		resolver: zodResolver(profileSchema),
		defaultValues: { name: '' },
		// Prefill: quando a query resolve, o RHF sincroniza os valores do form.
		values: profile ? { name: profile.name } : undefined,
	})

	const onSubmit = (values: ProfileForm) => {
		setSubmitError(null)
		save.mutate(
			{ data: { name: values.name.trim() } },
			{
				onSuccess: (response) => {
					if (response.status !== 200) return
					setSuccess(true)
					// Reflete o novo nome em quem consome o perfil.
					queryClient.invalidateQueries({ queryKey: getGetApiUsersMeQueryKey() })
				},
				onError: (error) => {
					const message =
						error instanceof HttpError ? (error.data as { message?: string } | undefined)?.message : undefined
					if (error instanceof HttpError && error.status === 400) {
						setError('name', { message: message ?? 'Verifique os dados informados.' })
						return
					}
					setSubmitError(message ?? 'Não foi possível salvar as alterações. Tente novamente.')
				},
			},
		)
	}

	return {
		control,
		errors,
		isDirty,
		profile,
		isLoading: profileQuery.isLoading,
		isLoadError: profileQuery.isError,
		isSaving: save.isPending,
		success,
		submitError,
		dismissSuccess: () => setSuccess(false),
		onSubmit: handleSubmit(onSubmit),
	}
}
