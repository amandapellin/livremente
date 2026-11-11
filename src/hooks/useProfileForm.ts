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

const AVATAR_MAX_BYTES = 2 * 1024 * 1024
const AVATAR_TYPES = ['image/png', 'image/jpeg']

const messageOf = (error: unknown): string | undefined => {
	return error instanceof HttpError ? (error.data as { message?: string } | undefined)?.message : undefined
}

export const useProfileForm = () => {
	const queryClient = useQueryClient()
	const profileQuery = useGetApiUsersMe()
	const profile = profileQuery.data?.status === 200 ? profileQuery.data.data : undefined

	const [success, setSuccess] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [avatarRemoved, setAvatarRemoved] = useState(false)
	const [avatarError, setAvatarError] = useState<string | null>(null)
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
		values: profile
			? { name: profile.name, currentPassword: '', newPassword: '', confirmNewPassword: '' }
			: undefined,
	})

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
		setAvatarRemoved(Boolean(profile?.avatarUrl))
	}

	const resetAvatarState = () => {
		if (avatarPreview) URL.revokeObjectURL(avatarPreview)
		setAvatarFile(null)
		setAvatarPreview(null)
		setAvatarRemoved(false)
	}

	const avatarSrc =
		avatarPreview ??
		(!avatarRemoved && profile?.avatarUrl ? `${profile.avatarUrl}?v=${avatarCacheBust}` : undefined)

	const avatarChanged = avatarFile !== null || avatarRemoved

	const onSubmit = handleSubmit(async (values) => {
		setSubmitError(null)
		setAvatarError(null)
		let ok = true
		let avatarTouched = false

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
			setValue('currentPassword', '')
			setValue('newPassword', '')
			setValue('confirmNewPassword', '')
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
