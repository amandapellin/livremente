import { useQuery } from '@tanstack/react-query'
import { fetchReadingNotesRemote } from '@/utils/reader-highlights'
import { getBookmarks } from '@/utils/reader-bookmarks'

/**
 * Stats de leitura para o card dos detalhes (grifos/anotações/páginas marcadas).
 * Grifos e anotações vêm do back (`/api/reading/{id}/highlights-annotations`);
 * as páginas marcadas vêm dos marcadores locais do leitor (o back guarda só uma
 * marcação por obra — a contagem multi-página é um follow-up com tabela própria).
 * "Tempo de leitura" fica de fora até haver agregação no back-end.
 */
export const useReadingStats = (id: string | undefined, enabled: boolean) => {
	const { data } = useQuery({
		queryKey: ['reading-stats', id],
		queryFn: () => fetchReadingNotesRemote(id!),
		enabled: enabled && !!id,
	})
	return {
		highlights: data?.highlights.length ?? 0,
		notes: data?.notes.length ?? 0,
		bookmarks: id ? getBookmarks(id).length : 0,
	}
}
