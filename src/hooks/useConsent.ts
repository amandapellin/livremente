import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiUsersMeConsent, putApiUsersMeConsent } from '@/api/generated/endpoints'
import type { UserConsent } from '@/api/generated/model'
import { HttpError } from '@/api/fetcher'
import { USE_PRIVACY_MOCK, getConsentMock, updateConsentMock } from '@/api/privacy-mock'

const CONSENT_KEY = ['users', 'me', 'consent']

async function fetchConsent(): Promise<UserConsent> {
	if (USE_PRIVACY_MOCK) return getConsentMock()
	const res = await getApiUsersMeConsent()
	if (res.status !== 200) throw new HttpError(res.status, res.data, '/api/users/me/consent')
	return res.data
}

/**
 * Consentimento LGPD do usuário (RF-privacidade). Lê o estado atual e permite
 * alterar o consentimento **opcional** (avisos). O obrigatório vale enquanto a
 * conta existir — para retirá-lo, exclui-se a conta.
 */
export function useConsent() {
	const queryClient = useQueryClient()
	const query = useQuery({ queryKey: CONSENT_KEY, queryFn: fetchConsent })

	const update = useMutation({
		mutationFn: async (marketingConsent: boolean): Promise<UserConsent> => {
			if (USE_PRIVACY_MOCK) return updateConsentMock(marketingConsent)
			const res = await putApiUsersMeConsent({ marketingConsent })
			if (res.status !== 200) throw new HttpError(res.status, res.data, '/api/users/me/consent')
			return res.data
		},
		onSuccess: (data) => queryClient.setQueryData(CONSENT_KEY, data),
	})

	return { consent: query.data, isLoading: query.isLoading, isError: query.isError, update }
}
