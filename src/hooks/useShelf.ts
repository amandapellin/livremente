import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReadingStatus } from '@/api/generated/model'
import { fetchShelf, removeFromShelf, setShelfStatus } from '@/utils/shelf'
import { readingStatusOptions } from '@/schemas/reading-status-schemas'
import { useToast } from '@/providers/toast-context'

const SHELF_KEY = ['shelf'] as const

const statusLabel = (status: ReadingStatus): string =>
	readingStatusOptions.find((o) => o.value === status)?.label ?? status

// RF05 (#32): a estante do usuário (opcionalmente por estado) com cache do React Query.
export const useShelf = (status?: ReadingStatus) =>
	useQuery({
		queryKey: [...SHELF_KEY, status ?? 'all'],
		queryFn: () => fetchShelf(status),
	})

/**
 * RF06 (#28/#33): ações de estante (definir estado / remover). Invalidam a estante e,
 * se houver, os detalhes da obra (o selo "Na estante · {estado}" e a lista atualizam
 * sem recarregar) e disparam um **toast** de confirmação — mesma lógica na estante e
 * nos detalhes. As funções de fetch retornam `boolean` (ok); `false` = toast de erro.
 */
export const useShelfActions = (publicationId?: string) => {
	const qc = useQueryClient()
	const toast = useToast()
	const invalidate = () => {
		qc.invalidateQueries({ queryKey: SHELF_KEY })
		if (publicationId) qc.invalidateQueries({ queryKey: ['catalog', 'details', publicationId] })
	}

	const setStatus = useMutation({
		mutationFn: ({ id, status }: { id: string; status: ReadingStatus }) => setShelfStatus(id, status),
		onSuccess: (ok, { status }) => {
			if (!ok) {
				toast('Não foi possível atualizar a estante.', 'error')
				return
			}
			invalidate()
			toast(`Movido para "${statusLabel(status)}".`)
		},
		onError: () => toast('Não foi possível atualizar a estante.', 'error'),
	})

	const remove = useMutation({
		mutationFn: (id: string) => removeFromShelf(id),
		onSuccess: (ok) => {
			if (!ok) {
				toast('Não foi possível remover da estante.', 'error')
				return
			}
			invalidate()
			toast('Removido da estante.')
		},
		onError: () => toast('Não foi possível remover da estante.', 'error'),
	})

	return { setStatus, remove }
}
