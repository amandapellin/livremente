import type { CatalogPage, Publication } from '@/api/generated/model'
import { CATALOG_PAGE_SIZE, type CatalogQuery } from '@/schemas/catalog-schemas'

const cover = (id: number) => `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`

export const publicationMocks: Publication[] = [
	{ id: '1342', title: 'Orgulho e Preconceito', author: 'Jane Austen', type: 'book', language: 'en', genre: 'romance', year: 1813, format: 'EPUB', source: 'Project Gutenberg', description: 'Elizabeth Bennet e o Sr. Darcy entre orgulho, classe e afeto na Inglaterra rural.', coverUrl: cover(1342) },
	{ id: '84', title: 'Frankenstein', author: 'Mary Shelley', type: 'book', language: 'en', genre: 'science_fiction_fantasy', year: 1818, format: 'EPUB', source: 'Project Gutenberg', description: 'Victor Frankenstein cria vida — e enfrenta as consequências morais de sua ambição.', coverUrl: cover(84) },
	{ id: '55752', title: 'Dom Casmurro', author: 'Machado de Assis', type: 'book', language: 'pt', genre: 'classics', year: 1899, format: 'EPUB', source: 'Project Gutenberg', description: 'Bento Santiago narra o ciúme e a dúvida sobre Capitu.', coverUrl: cover(55752) },
	{ id: 'arxiv-1706.03762', title: 'Attention Is All You Need', author: 'Vaswani et al.', type: 'scientific_article', language: 'en', genre: 'computer_science', year: 2017, format: 'PDF', source: 'arXiv', description: 'Introduz a arquitetura Transformer baseada em mecanismos de atenção.', coverUrl: null },
	{ id: 'arxiv-2010.11929', title: 'An Image is Worth 16x16 Words', author: 'Dosovitskiy et al.', type: 'scientific_article', language: 'en', genre: 'computer_science', year: 2020, format: 'PDF', source: 'arXiv', description: 'Aplica Transformers diretamente a patches de imagem (Vision Transformer).', coverUrl: null },
	// … acrescente mais itens para exercitar paginação/contagens
]

function matches(query: CatalogQuery, it: Publication, ignoreType = false) {
	if (!ignoreType && query.type && it.type !== query.type) return false
	if (query.languages.length && !query.languages.includes(it.language)) return false
	if (query.genres.length && !(it.genre && query.genres.includes(it.genre))) return false
	const q = query.q.trim().toLowerCase()
	if (q && !`${it.title} ${it.author}`.toLowerCase().includes(q)) return false
	return true
}

export function searchCatalogMock(query: CatalogQuery): CatalogPage {
	const base = publicationMocks.filter((it) => matches(query, it, true))
	const counts = {
		all: base.length,
		book: base.filter((i) => i.type === 'book').length,
		scientific_article: base.filter((i) => i.type === 'scientific_article').length,
	}

	const filtered = publicationMocks.filter((it) => matches(query, it))
	if (query.sort === 'recent') filtered.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
	else if (query.sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title))

	const total = filtered.length
	const totalPages = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE))
	const page = Math.min(Math.max(query.page, 1), totalPages)
	const start = (page - 1) * CATALOG_PAGE_SIZE
	return { items: filtered.slice(start, start + CATALOG_PAGE_SIZE), page, pageSize: CATALOG_PAGE_SIZE, total, totalPages, counts }
}