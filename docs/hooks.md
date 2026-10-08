# `src/hooks` — lógica de tela e estado de servidor

Hooks de UI (formulários via React Hook Form + Zod) e acesso a dados (TanStack
Query sobre o cliente gerado). Todas as funções são arrow (convenção do projeto).

> Padrão recorrente: o `customFetch` **só resolve em respostas ok**, então
> `res.status === 200` carrega o corpo tipado; status fora disso vira `HttpError`.

## Autenticação / sessão

- **`useAuth.ts` → `useIsAuthenticated()`** — estado reativo de autenticação via
  `useSyncExternalStore` (reflete login/logout na mesma aba e entre abas, sem
  recarregar). O header alterna visitante ⇄ autenticado a partir daqui.
- **`useLoginForm.ts` → `useLoginForm()`** — login (RF02): RHF+Zod, chama
  `POST /api/auth/login`, grava os tokens (`saveAuthTokens`, respeitando "manter
  conectado") e navega para `/estante`. Trata 401 ("e-mail ou senha inválidos").
- **`useLogout.ts` → `useLogout()`** — logout (RF29) *best-effort*: chama
  `POST /api/auth/logout` para revogar o refresh token; em sucesso **ou** erro,
  limpa a sessão, descarta o cache e vai para a landing (RF28).
- **`useRegisterForm.ts` → `useRegisterForm()`** — cadastro (RF01): *wizard* de 3
  etapas (`activeStep`), valida por etapa com `trigger(stepFields)`, monta o payload
  (`buildPayload`) e chama `POST /api/auth/register`. Trata 409 (e-mail já
  cadastrado) voltando à etapa 1; em 201 guarda `createdEmail` (tela de sucesso).

## Perfil

- **`useProfileForm.ts` → `useProfileForm()`** — edição de perfil (RF03). Um único
  "Salvar alterações" orquestra **três recursos independentes**, cada um só chamado
  quando muda: nome (`PUT /me`), senha (`PATCH /me/password`, trata 422 por campo) e
  avatar (`PUT`/`DELETE /me/avatar`, upload PNG/JPG ≤2 MB com preview e *cache-bust*).
  O avatar fica fora do RHF (arquivo binário). Sucesso só quando todas as chamadas
  necessárias completam.
- **`useProfilePreferences.ts` → `useProfilePreferences()`** — preferências (RF04):
  combina **dois recursos** — EAV (`/me/preferences`) e gêneros (`/me/genres`) —
  buscando ambos para pré-preencher e salvando em paralelo (`Promise.all`). Usa os
  mapeamentos de `preferences-schemas`.
- **`useReaderPreferences.ts` → `useReaderPreferences()`** — preferências de interface
  do leitor (RF26): tema, retomar, dicionário. **Fonte da verdade no back-end**
  (campos estendidos em `/me/preferences`, merge parcial) com **cache em
  `localStorage`** (para o leitor ler síncrono, sem flash). A query **só roda
  autenticada** (`enabled`), hidrata o cache ao abrir perfil/leitor, e grava com
  `setQueryData` otimista + `PUT`.

## Privacidade (LGPD)

- **`useConsent.ts` → `useConsent()`** — lê (`GET`) e altera o consentimento
  **opcional** (`PUT /me/consent`); o obrigatório vale enquanto a conta existir.
- **`useDataExport.ts` → `useDataExport()`** — portabilidade: compõe um JSON com
  perfil + preferências + gêneros (endpoints já existentes) e baixa
  `livremente-meus-dados.json`.
- **`useDeleteAccount.ts` → `useDeleteAccount()`** — exclusão de conta
  (`DELETE /me`), **irreversível**: em sucesso limpa a sessão, descarta o cache e vai
  para a landing.

## Catálogo / leitura

- **`useCatalogSearch.ts` → `useCatalogSearch(query)`** — busca do catálogo (RF10)
  via `useQuery` (`keepPreviousData` para não piscar entre páginas). **Mock trocável**
  (`USE_CATALOG_MOCK`) enquanto o back-end não expõe `GET /api/catalog`.
- **`usePublicationDetails.ts` → `usePublicationDetails(id)`** — detalhes da obra
  (RF13); 404 quando não existe. Também com mock trocável (mesmo flag).
- **`useDebouncedValue.ts` → `useDebouncedValue(value, delay=350)`** — valor com
  atraso; usado na busca por palavra-chave (RF11) para não requisitar a cada tecla.
- **`useEpubReader.ts` → `useEpubReader(url, bookId?)`** — ciclo de vida do epub.js
  (RF15): render, navegação (botões/teclado), **reflow** (`ResizeObserver`), capítulo
  (TOC) e progresso. Ajustes de leitura via `themes.override` (fonte, entrelinha,
  alinhamento, tipo de página) e **tema** (RF26, `applyTheme` — `override` em vez de
  `themes.select`, que não reverte de forma confiável). **Retomada** (RF18): salva a
  posição como CFI (`setStoredPosition`) e retoma no `display(cfi)` quando `resumeAuto`
  está ligado, com fallback para o início. Helpers de módulo: `findTocItem`,
  `applyTypography`, `applyPageType`, `applyTheme`.
