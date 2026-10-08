import { categoriasLivros, generosLiterarios } from './category-schemas'

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

export interface EavPreferencesPayload {
	languages: string[]
	contentTypes: string[]
	knowledgeAreas: string[]
}

export interface GenresPayload {
	genres: string[]
}

const bookCategorySlugs = new Set(categoriasLivros.map((o) => o.value))
const literaryGenreSlugs = new Set(generosLiterarios.map((o) => o.value))

export const apiToPreferences = (
	eav: Partial<EavPreferencesPayload> | undefined,
	genres: readonly string[] | undefined,
): PreferencesValue => {
	const genreSlugs = genres ?? []
	return {
		languages: eav?.languages ?? [],
		publications: eav?.contentTypes ?? [],
		bookCategories: genreSlugs.filter((g) => bookCategorySlugs.has(g)),
		articleAreas: eav?.knowledgeAreas ?? [],
		literaryGenres: genreSlugs.filter((g) => literaryGenreSlugs.has(g)),
	}
}

export const preferencesToEav = (v: PreferencesValue): EavPreferencesPayload => {
	return {
		languages: v.languages,
		contentTypes: v.publications,
		knowledgeAreas: v.articleAreas,
	}
}

export const preferencesToGenres = (v: PreferencesValue): GenresPayload => {
	return {
		genres: [...v.bookCategories, ...v.literaryGenres],
	}
}
