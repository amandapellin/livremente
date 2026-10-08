import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { deleteApiUsersMe } from '@/api/generated/endpoints'
import { clearAuthTokens } from '@/api/auth-storage'

/**
 * Exclusão de conta (LGPD, direito à eliminação). **Irreversível**: em sucesso,
 * limpa a sessão local, descarta o cache e redireciona para a landing.
 */
export function useDeleteAccount() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [isDeleting, setIsDeleting] = useState(false)
	const [error, setError] = useState(false)

	const deleteAccount = async (): Promise<boolean> => {
		setIsDeleting(true)
		setError(false)
		try {
			// `customFetch` lança em respostas não-ok, então resolver = sucesso (204).
			await deleteApiUsersMe()
			clearAuthTokens()
			queryClient.clear()
			navigate('/', { replace: true })
			return true
		} catch {
			setError(true)
			setIsDeleting(false)
			return false
		}
	}

	return { deleteAccount, isDeleting, error }
}
