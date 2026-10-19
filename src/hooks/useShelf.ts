import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReadingStatus } from '@/api/generated/model'
import { fetchShelf, removeFromShelf, setShelfStatus } from '@/utils/shelf'

const SHELF_KEY = ['shelf'] as const

// RF05 (#32): a estante do usuário (opcionalmente por estado) com cache do React Query.
export const useShelf = (status?: ReadingStatus) =>
	useQuery({
		queryKey: [...SHELF_KEY, status ?? 'all'],
		queryFn: () => fetchShelf(status),
	})

/**
 * RF06 (#33): ações de estante (definir estado / remover). Invalidam a estante e,
 * se houver, os detalhes da obra — para o selo "Na estante · {estado}" atualizar.
 */
export const useShelfActions = (publicationId?: string) => {
	const qc = useQueryClient()
	const invalidate = () => {
		qc.invalidateQueries({ queryKey: SHELF_KEY })
		if (publicationId) qc.invalidateQueries({ queryKey: ['catalog', 'details', publicationId] })
	}

	const setStatus = useMutation({
		mutationFn: ({ id, status }: { id: string; status: ReadingStatus }) => setShelfStatus(id, status),
		onSuccess: invalidate,
	})

	const remove = useMutation({
		mutationFn: (id: string) => removeFromShelf(id),
		onSuccess: invalidate,
	})

	return { setStatus, remove }
}
