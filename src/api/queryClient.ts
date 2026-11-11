import { QueryClient } from '@tanstack/react-query'
import { HttpError } from './fetcher'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Não re-tentar erros do cliente (4xx): 404 não existe, 401/403 não
			// mudam com retry. Para falhas transitórias (rede/5xx) mantém 3 tentativas.
			retry: (failureCount, error) => {
				if (error instanceof HttpError && error.status >= 400 && error.status < 500) return false
				return failureCount < 3
			},
		},
	},
})
