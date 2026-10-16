import type { Publication } from '@/api/generated/model'

// Mocks de publicações usados pelo mock de DETALHE (`catalog-details-mock`, #20).
// A busca/listagem agora usa o endpoint real (GET /api/publications); o antigo
// `searchCatalogMock` foi removido.

const cover = (id: number) => `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`

export const publicationMocks: Publication[] = [
	{ id: '1342', title: 'Orgulho e Preconceito', author: 'Jane Austen', type: 'book', language: 'en', genre: 'romance', year: 1813, format: 'EPUB', source: 'Project Gutenberg', description: 'Elizabeth Bennet e o Sr. Darcy entre orgulho, classe e afeto na Inglaterra rural.', coverUrl: cover(1342) },
	{ id: '84', title: 'Frankenstein', author: 'Mary Shelley', type: 'book', language: 'en', genre: 'science_fiction_fantasy', year: 1818, format: 'EPUB', source: 'Project Gutenberg', description: 'Victor Frankenstein cria vida — e enfrenta as consequências morais de sua ambição.', coverUrl: cover(84) },
	{ id: '55752', title: 'Dom Casmurro', author: 'Machado de Assis', type: 'book', language: 'pt', genre: 'classics', year: 1899, format: 'EPUB', source: 'Project Gutenberg', description: 'Bento Santiago narra o ciúme e a dúvida sobre Capitu.', coverUrl: cover(55752) },
	{ id: 'arxiv-1706.03762', title: 'Attention Is All You Need', author: 'Vaswani et al.', type: 'scientific_article', language: 'en', genre: 'computer_science', year: 2017, format: 'PDF', source: 'arXiv', description: 'Introduz a arquitetura Transformer baseada em mecanismos de atenção.', coverUrl: null },
	{ id: 'arxiv-2010.11929', title: 'An Image is Worth 16x16 Words', author: 'Dosovitskiy et al.', type: 'scientific_article', language: 'en', genre: 'computer_science', year: 2020, format: 'PDF', source: 'arXiv', description: 'Aplica Transformers diretamente a patches de imagem (Vision Transformer).', coverUrl: null },
]
