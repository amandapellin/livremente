import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { HttpError } from '@/api/fetcher'
import { getApiPublications } from '@/api/generated/endpoints'
import type { CatalogPage, Publication, PublicationCard, ReadingLanguage } from '@/api/generated/model'
import { toApiParams, type CatalogQuery } from '@/schemas/catalog-schemas'

/**
 * Adapta o card real do backend (`authors[]`/`genres[]`, `source` = gutendex|arxiv)
 * para o `Publication` do front (author/genre únicos), mantendo os componentes de
 * card inalterados. `format`/`description` não existem no card da listagem (são do
 * detalhe) e ficam ausentes.
 */
const toPublication = (c: PublicationCard): Publication => ({
	id: c.id,
	title: c.title,
	author: c.authors.join(', '),
	type: c.type,
	language: (c.language ?? '') as ReadingLanguage,
	genre: c.genres[0] ?? null,
	year: c.year ?? null,
	source: c.source === 'gutendex' ? 'Project Gutenberg' : c.source === 'arxiv' ? 'arXiv' : (c.source ?? null),
	coverUrl: c.coverUrl ?? null,
})

const fetchCatalog = async (query: CatalogQuery): Promise<CatalogPage> => {
	const res = await getApiPublications(toApiParams(query))
	if (res.status !== 200) throw new HttpError(res.status, res.data, '/api/publications')
	const page = res.data
	return {
		items: page.items.map(toPublication),
		page: page.page,
		pageSize: page.pageSize,
		total: page.total,
		totalPages: page.totalPages,
		counts: page.counts,
	}
}

export const useCatalogSearch = (query: CatalogQuery) => {
	return useQuery({
		queryKey: ['catalog', query],
		queryFn: () => fetchCatalog(query),
		placeholderData: keepPreviousData,
	})
}
