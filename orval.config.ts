import { defineConfig } from 'orval'

export default defineConfig({
  // Hooks do TanStack Query + tipos, usando fetch com baseURL do env (via mutator)
  livremente: {
    input: './src/api/openapi.json',
    output: {
      mode: 'single',
      target: './src/api/generated/endpoints.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        mutator: { path: './src/api/fetcher.ts', name: 'customFetch' },
      },
    },
  },
  // Schemas Zod para validação em runtime, gerados do mesmo contrato
  livrementeZod: {
    input: './src/api/openapi.json',
    output: {
      mode: 'single',
      target: './src/api/generated/endpoints.zod.ts',
      client: 'zod',
    },
  },
})
