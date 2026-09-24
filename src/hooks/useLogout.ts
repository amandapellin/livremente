import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { usePostApiAuthLogout } from '@/api/generated/endpoints'
import { clearAuthTokens, getAuthTokens } from '@/api/auth-storage'

/**
 * Fluxo de logout (RF29). Chama `POST /api/auth/logout` para revogar o refresh
 * token no servidor, mas é *best-effort*: em sucesso ou erro, limpa a sessão
 * local, descarta o cache de dados do usuário e redireciona para a landing
 * (RF28) — o usuário nunca fica "preso" logado se a API falhar.
 */
export function useLogout() {
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
