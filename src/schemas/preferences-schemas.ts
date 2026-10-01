import { categoriasLivros, generosLiterarios } from './category-schemas'

/**
 * Preferências no formato da UI (RF04). As categorias ficam separadas em livros
 * e áreas de artigos porque são exibidas em seções distintas. No back-end elas
 * viajam em DOIS recursos: as EAV (idioma, tipo, área) em `/me/preferences` e os
 * gêneros/categorias de livro em `/me/genres` (ver `preferencesToEav`,
 * `preferencesToGenres` e `apiToPreferences`).
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

/** Corpo do recurso EAV (`GET`/`PUT /api/users/me/preferences`). */
export interface EavPreferencesPayload {
	languages: string[]
	contentTypes: string[]
	knowledgeAreas: string[]
}

/** Corpo do recurso de gêneros (`GET`/`PUT /api/users/me/genres`). */
export interface GenresPayload {
	genres: string[]
}

const bookCategorySlugs = new Set(categoriasLivros.map((o) => o.value))
const literaryGenreSlugs = new Set(generosLiterarios.map((o) => o.value))

/**
 * Mescla as duas respostas da API (EAV + gêneros) no formato da UI. Os slugs de
 * `genres` são separados de volta em categorias de livro e gêneros literários
 * pelos conjuntos de vocabulário do front.
 */
export function apiToPreferences(
	eav: Partial<EavPreferencesPayload> | undefined,
	genres: readonly string[] | undefined,
): PreferencesValue {
	const genreSlugs = genres ?? []
	return {
		languages: eav?.languages ?? [],
		publications: eav?.contentTypes ?? [],
		bookCategories: genreSlugs.filter((g) => bookCategorySlugs.has(g)),
		articleAreas: eav?.knowledgeAreas ?? [],
		literaryGenres: genreSlugs.filter((g) => literaryGenreSlugs.has(g)),
	}
}

/** Extrai o corpo EAV (`/me/preferences`) do formato da UI. */
export function preferencesToEav(v: PreferencesValue): EavPreferencesPayload {
	return {
		languages: v.languages,
		contentTypes: v.publications,
		knowledgeAreas: v.articleAreas,
	}
}

/** Extrai o corpo de gêneros (`/me/genres`) do formato da UI (categorias de livro + gêneros). */
export function preferencesToGenres(v: PreferencesValue): GenresPayload {
	return {
		genres: [...v.bookCategories, ...v.literaryGenres],
	}
}
