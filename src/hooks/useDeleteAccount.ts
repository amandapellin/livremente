import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { deleteApiUsersMe } from '@/api/generated/endpoints'
import { clearAuthTokens } from '@/api/auth-storage'

export const useDeleteAccount = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [isDeleting, setIsDeleting] = useState(false)
	const [error, setError] = useState(false)

	const deleteAccount = async (): Promise<boolean> => {
		setIsDeleting(true)
		setError(false)
		try {
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
