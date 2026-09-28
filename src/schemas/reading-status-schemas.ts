import type { ReadingStatus } from '@/api/generated/model'
import { colors } from '@/theme/tokens'

/**
 * Rótulos (PT) e cores para o enum `ReadingStatus` do back-end
 * (`read | reading | want_to_read | abandoned`). Reusado no dropdown de estante
 * e no indicador "Estado na estante", e futuramente na tela de Estante.
 */
export const readingStatusOptions: readonly { value: ReadingStatus; label: string; color: string }[] = [
	{ value: 'want_to_read', label: 'Quero ler', color: colors.acao[500] },
	{ value: 'reading', label: 'Lendo', color: colors.gold[500] },
	{ value: 'read', label: 'Lido', color: colors.acao[700] },
	{ value: 'abandoned', label: 'Abandonei', color: colors.papel[600] },
]

export const readingStatusMap = new Map(readingStatusOptions.map((o) => [o.value, o]))
