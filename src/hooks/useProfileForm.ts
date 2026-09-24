import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { profileSchema, type ProfileForm } from '@/schemas/profile-schemas'
import {
	getGetApiUsersMeQueryKey,
	useDeleteApiUsersMeAvatar,
	useGetApiUsersMe,
	usePatchApiUsersMePassword,
	usePutApiUsersMe,
	usePutApiUsersMeAvatar,
} from '@/api/generated/endpoints'
import { HttpError } from '@/api/fetcher'

/** Limites do avatar, espelhando a validação do backend. */
const AVATAR_MAX_BYTES = 2 * 1024 * 1024
const AVATAR_TYPES = ['image/png', 'image/jpeg']

function messageOf(error: unknown): string | undefined {
	return error instanceof HttpError ? (error.data as { message?: string } | undefined)?.message : undefined
}

/**
 * Lógica da tela de edição de perfil (RF03). Um único "Salvar alterações"
 * orquestra três recursos independentes do backend, cada um só chamado quando há
 * mudança: nome (`PUT /me`), senha (`PATCH /me/password`) e avatar
 * (`PUT`/`DELETE /me/avatar`). Erros específicos voltam por campo; o sucesso só
 * é sinalizado quando todas as chamadas necessárias completam.
 */
export function useProfileForm() {
	const queryClient = useQueryClient()
	const profileQuery = useGetApiUsersMe()
	// customFetch só resolve em respostas ok; o 200 carrega o UserProfile.
	const profile = profileQuery.data?.status === 200 ? profileQuery.data.data : undefined

	const [success, setSuccess] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	// Estado do avatar (fora do RHF, pois é um arquivo binário). O envio/remoção
	// só acontece ao salvar, mantendo a coerência de "um botão para tudo".
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [avatarRemoved, setAvatarRemoved] = useState(false)
	const [avatarError, setAvatarError] = useState<string | null>(null)
	// Muda a cada operação de avatar bem-sucedida para furar o cache da <img>
	// (a URL do avatar é estável).
	const [avatarCacheBust, setAvatarCacheBust] = useState(0)

	const saveName = usePutApiUsersMe()
	const changePassword = usePatchApiUsersMePassword()
	const uploadAvatar = usePutApiUsersMeAvatar()
	const removeAvatar = useDeleteApiUsersMeAvatar()

	const {
		control,
		handleSubmit,
		setError,
		setValue,
		formState: { errors, isDirty },
	} = useForm<ProfileForm>({
		resolver: zodResolver(profileSchema),
		defaultValues: { name: '', currentPassword: '', newPassword: '', confirmNewPassword: '' },
		// Prefill do nome; os campos de senha voltam a vazio a cada carga do perfil
		// (inclusive após salvar, quando a query é invalidada).
		values: profile
			? { name: profile.name, currentPassword: '', newPassword: '', confirmNewPassword: '' }
			: undefined,
	})

	// Libera o object URL do preview ao trocá-lo/desmontar.
	useEffect(() => {
		return () => {
			if (avatarPreview) URL.revokeObjectURL(avatarPreview)
		}
	}, [avatarPreview])

	const pickAvatar = (file: File) => {
		setAvatarError(null)
		if (!AVATAR_TYPES.includes(file.type)) {
			setAvatarError('Formato inválido. Envie uma imagem PNG ou JPG.')
			return
		}
		if (file.size > AVATAR_MAX_BYTES) {
			setAvatarError('A imagem deve ter no máximo 2 MB.')
			return
		}
		if (avatarPreview) URL.revokeObjectURL(avatarPreview)
		setAvatarFile(file)
		setAvatarPreview(URL.createObjectURL(file))
		setAvatarRemoved(false)
	}

	const useInitials = () => {
		setAvatarError(null)
		if (avatarPreview) URL.revokeObjectURL(avatarPreview)
		setAvatarFile(null)
		setAvatarPreview(null)
		// Só marca remoção se há avatar no servidor para remover.
		setAvatarRemoved(Boolean(profile?.avatarUrl))
	}

	const resetAvatarState = () => {
		if (avatarPreview) URL.revokeObjectURL(avatarPreview)
		setAvatarFile(null)
		setAvatarPreview(null)
		setAvatarRemoved(false)
	}

	// Fonte da imagem exibida: preview do arquivo escolhido > avatar do servidor
	// (a menos que marcado para remover) > iniciais (undefined).
	const avatarSrc =
		avatarPreview ??
		(!avatarRemoved && profile?.avatarUrl ? `${profile.avatarUrl}?v=${avatarCacheBust}` : undefined)

	const avatarChanged = avatarFile !== null || avatarRemoved

	const onSubmit = handleSubmit(async (values) => {
		setSubmitError(null)
		setAvatarError(null)
		let ok = true
		let avatarTouched = false

		// 1) Avatar (enviar novo ou remover).
		try {
			if (avatarFile) {
				await uploadAvatar.mutateAsync({ data: { file: avatarFile } })
				avatarTouched = true
			} else if (avatarRemoved && profile?.avatarUrl) {
				await removeAvatar.mutateAsync()
				avatarTouched = true
			}
		} catch (error) {
			ok = false
			setAvatarError(messageOf(error) ?? 'Não foi possível atualizar a imagem.')
		}

		// 2) Nome (só se mudou).
		if (profile && values.name.trim() !== profile.name) {
			try {
				await saveName.mutateAsync({ data: { name: values.name.trim() } })
			} catch (error) {
				ok = false
				if (error instanceof HttpError && error.status === 400) {
					setError('name', { message: messageOf(error) ?? 'Verifique os dados informados.' })
				} else {
					setSubmitError(messageOf(error) ?? 'Não foi possível salvar as alterações. Tente novamente.')
				}
			}
		}

		// 3) Senha (só se o bloco foi preenchido).
		if (values.newPassword !== '') {
			try {
				await changePassword.mutateAsync({
					data: { currentPassword: values.currentPassword, newPassword: values.newPassword },
				})
			} catch (error) {
				ok = false
				if (error instanceof HttpError && error.status === 422) {
					setError('currentPassword', { message: messageOf(error) ?? 'Senha atual incorreta.' })
				} else if (error instanceof HttpError && error.status === 400) {
					setError('newPassword', { message: messageOf(error) ?? 'Verifique a nova senha.' })
				} else {
					setSubmitError(messageOf(error) ?? 'Não foi possível alterar a senha. Tente novamente.')
				}
			}
		}

		if (avatarTouched) setAvatarCacheBust((v) => v + 1)

		if (ok) {
			setSuccess(true)
			resetAvatarState()
			// Limpa os campos de senha (o prefill via `values` não os reseta quando o
			// nome do perfil não muda, pois o conteúdo de `values` fica idêntico).
			setValue('currentPassword', '')
			setValue('newPassword', '')
			setValue('confirmNewPassword', '')
			// Reflete o novo nome/avatar em quem consome o perfil.
			queryClient.invalidateQueries({ queryKey: getGetApiUsersMeQueryKey() })
		}
	})

	const isSaving =
		saveName.isPending || changePassword.isPending || uploadAvatar.isPending || removeAvatar.isPending

	return {
		control,
		errors,
		canSave: isDirty || avatarChanged,
		profile,
		avatar: {
			src: avatarSrc,
			displayName: profile?.name ?? '',
			error: avatarError,
			pick: pickAvatar,
			useInitials,
			canRemove: Boolean(profile?.avatarUrl) || avatarPreview !== null,
		},
		isLoading: profileQuery.isLoading,
		isLoadError: profileQuery.isError,
		isSaving,
		success,
		submitError,
		dismissSuccess: () => setSuccess(false),
		onSubmit,
	}
}
