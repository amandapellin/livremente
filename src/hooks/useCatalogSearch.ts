import { searchCatalogMock } from "@/api/catalog-mock";
import { HttpError } from "@/api/fetcher";
import { getApiCatalog } from "@/api/generated/endpoints";
import type { CatalogPage } from "@/api/generated/model";
import { toApiParams, type CatalogQuery } from "@/schemas/catalog-schemas";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const USE_CATALOG_MOCK = true

async function fetchReal(query: CatalogQuery): Promise<CatalogPage> {
    const res = await getApiCatalog(toApiParams(query))
    if (res.status !== 200) throw new HttpError(res.status, res.data, '/api/catalog')
    return res.data
}

async function fetchMock(query: CatalogQuery): Promise<CatalogPage> {
    await new Promise((r) => setTimeout(r, 500))
    return searchCatalogMock(query)
}

export function useCatalogSearch(query: CatalogQuery) {
    return useQuery({
        queryKey: ['catalog', query],
        queryFn: () => (USE_CATALOG_MOCK ? fetchMock(query) : fetchReal(query)),
        placeholderData: keepPreviousData,
    })
}