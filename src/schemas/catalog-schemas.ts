import type { PublicationType, ReadingLanguage } from "@/api/generated/model"
import { areasArtigos, generosLiterarios, idiomaOptions, publicationOptions, type Opcao } from "./category-schemas"

export type CatalogSort = 'relevance' | 'recent' | 'title' | 'popularity'

export interface CatalogQuery {
    q: string
    type: PublicationType | ''
    languages: ReadingLanguage[]
    genres: string[]
    sort: CatalogSort
    page: number
}

export const CATALOG_PAGE_SIZE = 10

export const emptyCatalogQuery: CatalogQuery = {
    q: '',
    type: '',
    languages: [],
    genres: [],
    sort: 'relevance',
    page: 1,
}

export const sortOptions: readonly { value: CatalogSort; label: string }[] = [
    { value: 'relevance', label: 'Relevância' },
    { value: 'recent', label: 'Mais recentes' },
    { value: 'title', label: 'Título (A-Z)' },
    { value: 'popularity', label: 'Mais populares' },
]

export const typeChips = [
    { value: '' as const, label: 'Todos' },
    { value: 'book' as const, label: 'Livros' },
    { value: 'scientific_article' as const, label: 'Artigos científicos' },
]

export const genreOptionsFor = (type: CatalogQuery['type']): readonly Opcao[] => {
    return type === 'scientific_article' ? areasArtigos: generosLiterarios
}

export const genreLabelFor = (type: CatalogQuery['type']): string => {
    return type === 'scientific_article' ? 'Área de conhecimento' : 'Gênero literário'
}

const langLabels = new Map(idiomaOptions.map((o)=> [o.value, o.label]))
const genreLabels = new Map([...generosLiterarios, ...areasArtigos].map((o)=> [o.value, o.label]))
export const languageLabel = (v: string) => langLabels.get(v) ?? v
export const genreLabel = (v: string) => genreLabels.get(v) ?? v

export const toApiParams = (query: CatalogQuery) => {
    return {
        q: query.q.trim() || undefined,
        type: query.type || undefined,
        languages: query.languages.length ? query.languages : undefined,
        genres: query.genres.length ? query.genres : undefined,
        sort: query.sort,
        page: query.page,
        pageSize: CATALOG_PAGE_SIZE,
    }
}
export { idiomaOptions, publicationOptions}