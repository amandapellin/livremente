import { areasArtigos, categoriasLivros } from './category-schemas'

/**
 * Preferências no formato da UI (RF04). As categorias ficam separadas em livros
 * e áreas de artigos porque são exibidas em seções distintas; a API usa um único
 * array `categories` (ver `preferencesToApi`/`apiToPreferences`).
 */
export interface PreferencesValue {
	languages: string[]
	publications: string[]
	bookCategories: string[]
	articleAreas: string[]
	literaryGenres: string[]
}

export const emptyPreferences: PreferencesValue = {
	languages: [],
	publications: [],
	bookCategories: [],
	articleAreas: [],
	literaryGenres: [],
}

/** Formato do contrato da API (categorias e áreas mescladas em `categories`). */
export interface PreferencesPayload {
	languages: string[]
	publications: string[]
	categories: string[]
	literaryGenres: string[]
}

const bookCategorySlugs = new Set(categoriasLivros.map((o) => o.value))
const articleAreaSlugs = new Set(areasArtigos.map((o) => o.value))

/** Converte as preferências vindas da API (categorias mescladas) para a UI. */
export function apiToPreferences(p: Partial<PreferencesPayload> | undefined): PreferencesValue {
	const categories = p?.categories ?? []
	return {
		languages: p?.languages ?? [],
		publications: p?.publications ?? [],
		bookCategories: categories.filter((c) => bookCategorySlugs.has(c)),
		articleAreas: categories.filter((c) => articleAreaSlugs.has(c)),
		literaryGenres: p?.literaryGenres ?? [],
	}
}

/** Converte as preferências da UI para o corpo da API (mescla categorias + áreas). */
export function preferencesToApi(v: PreferencesValue): PreferencesPayload {
	return {
		languages: v.languages,
		publications: v.publications,
		categories: [...v.bookCategories, ...v.articleAreas],
		literaryGenres: v.literaryGenres,
	}
}
