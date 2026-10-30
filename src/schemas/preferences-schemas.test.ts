import { describe, it, expect } from 'vitest'
import { apiToPreferences, preferencesToEav, preferencesToGenres, emptyPreferences } from './preferences-schemas'

describe('preferences-schemas', () => {
	it('apiToPreferences separa os gêneros em categorias de livro e gêneros literários', () => {
		const v = apiToPreferences(
			{ languages: ['pt', 'en'], contentTypes: ['book'], knowledgeAreas: ['physics'] },
			['literature', 'adventure'], // literature = categoria de livro; adventure = gênero literário
		)
		expect(v.languages).toEqual(['pt', 'en'])
		expect(v.publications).toEqual(['book'])
		expect(v.articleAreas).toEqual(['physics'])
		expect(v.bookCategories).toEqual(['literature'])
		expect(v.literaryGenres).toEqual(['adventure'])
	})

	it('apiToPreferences com entradas indefinidas devolve tudo vazio', () => {
		expect(apiToPreferences(undefined, undefined)).toEqual(emptyPreferences)
	})

	it('preferencesToEav mapeia publications→contentTypes e articleAreas→knowledgeAreas', () => {
		const payload = preferencesToEav({
			...emptyPreferences,
			languages: ['pt'],
			publications: ['book'],
			articleAreas: ['physics'],
		})
		expect(payload).toEqual({ languages: ['pt'], contentTypes: ['book'], knowledgeAreas: ['physics'] })
	})

	it('preferencesToGenres junta categorias de livro e gêneros literários', () => {
		const payload = preferencesToGenres({
			...emptyPreferences,
			bookCategories: ['literature'],
			literaryGenres: ['adventure'],
		})
		expect(payload.genres).toEqual(['literature', 'adventure'])
	})

	it('round-trip api→pref→api preserva o EAV e os gêneros', () => {
		const v = apiToPreferences({ languages: ['pt'], contentTypes: ['book'], knowledgeAreas: ['physics'] }, ['literature', 'adventure'])
		expect(preferencesToEav(v)).toEqual({ languages: ['pt'], contentTypes: ['book'], knowledgeAreas: ['physics'] })
		expect(preferencesToGenres(v).genres.sort()).toEqual(['adventure', 'literature'])
	})
})
