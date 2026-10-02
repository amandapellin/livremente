import type { PublicationDetails } from '@/api/generated/model'
import { genreLabel } from '@/schemas/catalog-schemas'
import { publicationMocks } from './catalog-mock'

// Campos extras por id (o backend fornecerá isso; aqui é só para exercitar a tela).
const extras: Record<string, Partial<PublicationDetails>> = {
	'1342': {
		synopsis:
			'Elizabeth Bennet e o Sr. Darcy medem orgulho, classe e afeto na Inglaterra rural.\n\nPublicado em 1813, entrou em domínio público e foi digitalizado pelo Project Gutenberg.',
		contributors: [{ role: 'author', name: 'Jane Austen', lifespan: '1775–1817' }],
		subjects: ['Romance', 'Literatura inglesa', 'Costumes', 'Famílias', 'Casamento', 'Sátira social'],
		pages: 279, rights: 'Domínio público', publicDomain: true,
		downloadUrl: 'https://www.gutenberg.org/ebooks/1342.epub.noimages',
		epubFileUrl: '/sample.epub',
		readingStatus: 'reading',
		readingProgress: {
			percent: 34,
			currentPage: 96,
			totalPages: 282,
			lastSession: 'ontem',
			readingTimeMinutes: 252,
			highlights: 17,
			notes: 6,
			bookmarks: 3,
		},
	},
	'arxiv-1706.03762': {
		synopsis:
			'Introduz a arquitetura Transformer, baseada inteiramente em mecanismos de atenção, dispensando recorrência e convoluções.',
		contributors: [{ role: 'author', name: 'Vaswani et al.', lifespan: null }],
		subjects: ['Aprendizado de máquina', 'Processamento de linguagem natural'],
		pages: 15, rights: 'arXiv (acesso aberto)', publicDomain: false,
		downloadUrl: 'https://arxiv.org/abs/1706.03762', // botão "Abrir no arXiv"
		pdfFileUrl: '/sample.pdf', // dev; em prod, o pdf_file_url real do material
	},
	// … adicione mais conforme necessário
}

/** Detalhes de uma publicação; `undefined` quando o id não existe (→ 404). */
export function publicationDetailsMock(id: string): PublicationDetails | undefined {
	const base = publicationMocks.find((p) => p.id === id)
	if (!base) return undefined
	return {
		...base,
		synopsis: base.description ?? null,
		contributors: [{ role: 'author', name: base.author, lifespan: null }],
		subjects: base.genre ? [genreLabel(base.genre)] : [],
		pages: null, rights: 'Domínio público', publicDomain: true, downloadUrl: null, readingStatus: null,
		...extras[id],
	}
}