import { useQuery } from '@tanstack/react-query'
import { getApiPublicationsId } from '@/api/generated/endpoints'
import type { PublicationDetails, PublicationDetailsApi, ReadingLanguage } from '@/api/generated/model'
import { HttpError } from '@/api/fetcher'
import { genreLabel } from '@/schemas/catalog-schemas'

/**
 * Adapta os detalhes reais do back-end (`PublicationDetailsApi`: `authors[]`/
 * `genres[]` slugs) para o `PublicationDetails` do front consumido pela tela.
 * Campos de estante/leitura (`readingStatus`/`readingProgress`) não vêm deste
 * endpoint (outros épicos) e ficam nulos.
 */
const toDetails = (d: PublicationDetailsApi): PublicationDetails => ({
	id: d.id,
	title: d.title,
	author: d.authors.join(', '),
	type: d.type,
	language: (d.language ?? '') as ReadingLanguage,
	genre: d.genres[0] ?? null,
	year: d.year ?? null,
	format: d.epubFileUrl ? 'EPUB' : d.pdfFileUrl ? 'PDF' : undefined,
	source: d.source === 'gutendex' ? 'Project Gutenberg' : d.source === 'arxiv' ? 'arXiv' : (d.source ?? null),
	coverUrl: d.coverUrl ?? null,
	synopsis: d.synopsis ?? null,
	contributors: d.authors.map((name) => ({ name, role: 'author' })),
	subjects: d.genres.map(genreLabel),
	pages: null,
	rights: d.publicDomain ? 'Domínio público' : null,
	publicDomain: d.publicDomain,
	downloadUrl: d.downloadUrl ?? null,
	readingStatus: null,
	readingProgress: null,
	epubFileUrl: d.epubFileUrl ?? null,
	pdfFileUrl: d.pdfFileUrl ?? null,
})

const fetchDetails = async (id: string): Promise<PublicationDetails> => {
	const res = await getApiPublicationsId(Number(id))
	if (res.status !== 200) throw new HttpError(res.status, res.data, `/api/publications/${id}`)
	return toDetails(res.data)
}

export const usePublicationDetails = (id: string | undefined) => {
	return useQuery({
		queryKey: ['catalog', 'details', id],
		queryFn: () => fetchDetails(id!),
		enabled: !!id,
	})
}
