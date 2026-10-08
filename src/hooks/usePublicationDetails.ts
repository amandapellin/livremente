import { useQuery } from '@tanstack/react-query'
import { getApiCatalogId } from '@/api/generated/endpoints'
import type { PublicationDetails } from '@/api/generated/model'
import { HttpError } from '@/api/fetcher'
import { publicationDetailsMock } from '@/api/catalog-details-mock'

const USE_CATALOG_MOCK = true

async function fetchReal(id: string): Promise<PublicationDetails> {
	const res = await getApiCatalogId(id)
	if (res.status !== 200) throw new HttpError(res.status, res.data, `/api/catalog/${id}`)
	return res.data
}
async function fetchMock(id: string): Promise<PublicationDetails> {
	await new Promise((r) => setTimeout(r, 300))
	const details = publicationDetailsMock(id)
	if (!details) throw new HttpError(404, { message: 'Publicação não encontrada.' }, `/api/catalog/${id}`)
	return details
}

export const usePublicationDetails = (id: string | undefined) => {
	return useQuery({
		queryKey: ['catalog', 'details', id],
		queryFn: () => (USE_CATALOG_MOCK ? fetchMock(id!) : fetchReal(id!)),
		enabled: !!id,
	})
}