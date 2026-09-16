import { useGetApiHealth } from '../api/generated/endpoints'
import { GetApiHealthResponse } from '../api/generated/endpoints.zod'

/**
 * TEMP: prova de fumaça do cliente HTTP gerado do OpenAPI (#2).
 * Chama GET /api/health via hook do React Query e valida a resposta com o
 * schema Zod gerado. Remover quando as telas reais consumirem os hooks.
 */
function HealthCheck() {
  const { data, isLoading, isError } = useGetApiHealth()

  if (isLoading) return <p>API: verificando…</p>
  if (isError) return <p>API: indisponível</p>

  // Validação em runtime com o schema gerado do contrato (Zod).
  const parsed = GetApiHealthResponse.safeParse(data?.data)
  return (
    <p>
      API: ok (HTTP {data?.status}){parsed.success ? '' : ' — resposta fora do contrato'}
    </p>
  )
}

export default function LandingPage() {
  return (
    <main>
      <h1>LivreMente</h1>
      <p>Placeholder — implementação em #4 (RF28).</p>
      <HealthCheck />
    </main>
  )
}
