import { describe, it, expect } from 'vitest'
import {
	toApiParams,
	genreLabel,
	languageLabel,
	genreOptionsFor,
	emptyCatalogQuery,
	type CatalogQuery,
} from './catalog-schemas'
import { generosLiterarios, areasArtigos } from './category-schemas'

describe('catalog-schemas', () => {
	it('toApiParams limpa q em branco e omite filtros vazios', () => {
		const p = toApiParams({ ...emptyCatalogQuery, q: '   ' })
		expect(p.q).toBeUndefined()
		expect(p.type).toBeUndefined()
		expect(p.languages).toBeUndefined()
		expect(p.genres).toBeUndefined()
		expect(p.page).toBe(1)
		expect(p.pageSize).toBeGreaterThan(0)
	})

	it('toApiParams repassa q (sem espaços nas pontas), tipo e listas preenchidas', () => {
		const query: CatalogQuery = {
			...emptyCatalogQuery,
			q: '  moby  ',
			type: 'book',
			languages: ['en'] as CatalogQuery['languages'],
			genres: ['adventure'],
			page: 2,
		}
		const p = toApiParams(query)
		expect(p.q).toBe('moby')
		expect(p.type).toBe('book')
		expect(p.languages).toEqual(['en'])
		expect(p.genres).toEqual(['adventure'])
		expect(p.page).toBe(2)
	})

	it('genreLabel e languageLabel traduzem slugs conhecidos', () => {
		expect(genreLabel('adventure')).toBe('Aventura')
		expect(languageLabel('en')).toBe('Inglês')
	})

	it('genreLabel devolve o próprio slug quando desconhecido', () => {
		expect(genreLabel('__inexistente__')).toBe('__inexistente__')
	})

	it('genreOptionsFor usa gêneros literários para livro e áreas para artigo', () => {
		expect(genreOptionsFor('book')).toBe(generosLiterarios)
		expect(genreOptionsFor('scientific_article')).toBe(areasArtigos)
	})
})
