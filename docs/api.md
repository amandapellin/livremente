# `src/api` — camada de acesso à API

Documentação dos arquivos **não gerados** de `src/api`. O diretório
`src/api/generated/` é produzido pelo **orval** a partir de `src/api/openapi.json`
(`pnpm gen:api`) e **não** é documentado aqui — não editar à mão.

> Convenção: as explicações do código desta pasta vivem neste arquivo (o código
> fica enxuto). Ao mudar o comportamento, atualize aqui também.

---

## `fetcher.ts` — `customFetch` e `HttpError`

Envolve o cliente gerado (orval, `httpClient: 'fetch'`), centralizando
autenticação e tratamento de resposta.

- **`baseURL`** — `import.meta.env.VITE_API_URL ?? ''`. Em dev fica vazia (mesma
  origem, via proxy do Vite); em produção, a URL pública da API.
- **`HttpError`** (classe exportada) — lançado quando o backend responde com
  status não-ok. Carrega `status` e `data` (corpo já desserializado, quando
  houver) para a UI reagir a casos específicos — ex.: tratar um **409** no
  cadastro como "e-mail já cadastrado".
- **`performTokenRefresh()`** (interna) — tenta renovar o token chamando
  `POST /api/auth/refresh`. Em falha, limpa a sessão. Deduplicada por
  `refreshPromise` (um refresh em andamento por vez).
- **`customFetch<T>(url, options)`** (exportada) — o fetch usado pelo cliente
  gerado. Comportamento:
  - Define `Content-Type: application/json` **só quando há corpo** (evita
    preflight CORS desnecessário em GETs) e **nunca** em `FormData` (o navegador
    define o `multipart` boundary — upload de avatar).
  - Injeta o **JWT** (`Authorization: Bearer`) quando há sessão — ponto único de
    autenticação.
  - Intercepta **401** (fora das rotas de login/refresh), dispara um refresh e
    **reexecuta** a requisição; se o 401 persistir, limpa a sessão e redireciona
    para `/login` (RF02).

## `auth-storage.ts` — persistência e reatividade de sessão (RF02)

Tokens guardados em `localStorage` ("manter conectado") ou `sessionStorage`
(só enquanto a aba existir). **Todos** os acessos são protegidos com `try/catch`
porque o storage pode lançar (janela anônima, cookies bloqueados).

- **`AUTH_EVENT`** (`'livremente:auth-changed'`) — evento disparado na **mesma
  aba** quando a sessão muda (login/logout).
- **`emitAuthChanged()`** (interna) — dispara o `AUTH_EVENT`; ignora ambientes
  sem `window` (testes/SSR).
- **`isAuthenticated()`** — há sessão ativa? (token de acesso presente).
- **`subscribeAuthChange(callback)`** — assina mudanças de sessão para UI
  reativa: cobre a mesma aba (`AUTH_EVENT`) e outras abas (evento nativo
  `storage`). Retorna a função de cancelamento. (Usado pelo `useIsAuthenticated`.)
- **`saveAuthTokens(token, refreshToken, remember)`** — grava no storage primário
  (local se `remember`, senão session) e **limpa o outro** storage, evitando
  token "órfão" ao alternar a opção entre logins. Emite `AUTH_EVENT`.
- **`getAuthTokens()`** — lê os tokens atuais (local tem prioridade sobre
  session) + o tipo de storage em uso (`'local' | 'session' | null`).
- **`getAuthToken()`** — atalho que retorna só o token de acesso.
- **`clearAuthTokens()`** — remove ambos os tokens de **ambos** os storages
  (logout). Emite `AUTH_EVENT`.

## `catalog-mock.ts` — mock do catálogo (RF10)

Dados e busca do catálogo enquanto o backend não expõe `GET /api/catalog`
(flag `USE_CATALOG_MOCK` em `useCatalogSearch`).

- **`cover(id)`** — monta a URL da capa no Project Gutenberg.
- **`publicationMocks`** — lista de `Publication` de exemplo (livros + artigos);
  acrescente itens para exercitar paginação/contagens.
- **`matches(query, it, ignoreType?)`** (interna) — predicado de filtro
  (tipo, idioma, gênero/área e busca por título/autor). `ignoreType` serve para
  calcular as **contagens por tipo** independentes do filtro de tipo atual.
- **`searchCatalogMock(query)`** — aplica filtros, ordenação (`recent`/`title`)
  e paginação (`CATALOG_PAGE_SIZE`), devolvendo uma `CatalogPage` com `items`,
  metadados de página e `counts`.

## `catalog-details-mock.ts` — mock de detalhes da obra (RF13)

Detalhes por id enquanto o backend não expõe `GET /api/catalog/{id}`
(mock trocável em `usePublicationDetails`).

- **`extras`** — campos extras por id (sinopse, responsáveis, `epubFileUrl`/
  `pdfFileUrl`, estado/progresso na estante) que o backend fornecerá; aqui só
  para exercitar a tela. O `downloadUrl`/`pdfFileUrl` do artigo apontam para o
  arXiv / `public/sample.pdf` em dev.
- **`publicationDetailsMock(id)`** — compõe `PublicationDetails` a partir do item
  do catálogo + os `extras[id]`; retorna `undefined` quando o id não existe
  (→ 404 na UI).

## `queryClient.ts`

- **`queryClient`** — instância única do `QueryClient` (TanStack Query) usada pelo
  `QueryClientProvider` da aplicação.
