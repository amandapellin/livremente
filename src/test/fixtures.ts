import type { Publication, ReadingLanguage } from '@/api/generated/model'

// Fábrica de publicação para os testes de componente. Preenche os obrigatórios e
// deixa o resto sobrescrevível por `overrides`.
export function makePublication(overrides: Partial<Publication> = {}): Publication {
	return {
		id: '1',
		title: 'Moby Dick; Or, The Whale',
		author: 'Melville, Herman',
		type: 'book',
		language: 'en' as ReadingLanguage,
		genre: 'classics',
		year: 1851,
		format: 'EPUB',
		source: 'Project Gutenberg',
		description: null,
		coverUrl: null,
		...overrides,
	}
}
