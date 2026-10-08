import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { usePostApiAuthLogout } from '@/api/generated/endpoints'
import { clearAuthTokens, getAuthTokens } from '@/api/auth-storage'

export const useLogout = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const logout = usePostApiAuthLogout()

	const doLogout = () => {
		const { refreshToken } = getAuthTokens()

		const finish = () => {
			clearAuthTokens()
			queryClient.clear()
			navigate('/')
		}

		if (!refreshToken) {
			finish()
			return
		}

		logout.mutate({ data: { refreshToken } }, { onSuccess: finish, onError: finish })
	}

	return { logout: doLogout, isPending: logout.isPending }
}
