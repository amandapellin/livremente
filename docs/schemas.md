# `src/schemas` — esquemas Zod, vocabulário e mapeamentos

Validação de formulários (Zod + React Hook Form), listas de opções (vocabulário)
e conversões UI ↔ contrato da API.

## `category-schemas.ts` — vocabulário (contrato)

Listas de opções `Opcao` (`{ value, label }`). Os **slugs (`value`) são o contrato
de vocabulário** e devem casar com as chaves do `PreferenceCatalog` do back-end.

- **`Opcao`** — interface `{ value: string; label: string }`.
- **`generoOptions`** — gêneros do usuário (cadastro).
- **`idiomaOptions`** — idiomas (pt/en/es/fr/ru).
- **`publicationOptions`** — tipo de conteúdo (livro/artigo).
- **`categoriasLivros`** — categorias de livro.
- **`generosLiterarios`** — gêneros literários.
- **`areasArtigos`** — áreas de conhecimento (artigos).

## `catalog-schemas.ts` — busca do catálogo (RF10)

- **`CatalogSort`** — `'relevance' | 'recent' | 'title' | 'popularity'`.
- **`CatalogQuery`** — estado da busca (`q`, `type`, `languages`, `genres`, `sort`,
  `page`).
- **`CATALOG_PAGE_SIZE`** (10), **`emptyCatalogQuery`**, **`sortOptions`**,
  **`typeChips`** — defaults e opções de UI.
- **`genreOptionsFor(type)`** / **`genreLabelFor(type)`** — opções e rótulo do filtro
  de gênero conforme o tipo (artigo → áreas; senão → gêneros literários).
- **`languageLabel(v)`** / **`genreLabel(v)`** — slug → rótulo (via `Map`).
- **`toApiParams(query)`** — converte o `CatalogQuery` nos params da API (omite
  vazios).

## `login-schemas.ts` — login (RF02)

- **`loginSchema`** (Zod) — e-mail válido, senha não vazia, `rememberMe` ("manter
  conectado" — persiste a sessão entre aberturas do navegador).
- **`LoginForm`**, **`initialLoginForm`**.

## `register-schemas.ts` — cadastro (RF01)

- **`cadastroSchema`** (Zod) — schema único do *wizard*. Etapa 1 (dados cadastrais,
  com validação de data e senha), etapa 2 (preferências, **opcionais**), etapa 3
  (consentimento LGPD **obrigatório**, RN03). `refine` confirma a senha.
- **`CadastroForm`**, **`initialCadastroForm`**.
- **`stepFields`** — campos validados por etapa, na ordem do stepper (etapa 2 livre);
  usado no `trigger([...])` ao avançar.

## `profile-schemas.ts` — edição de perfil (RF03)

- **`profileSchema`** (Zod) — nome obrigatório; e-mail é read-only (troca exige
  confirmação, fluxo à parte). O **bloco de senha é opcional**: via `superRefine`, só
  valida (senha atual, nova ≥8/≤128, confirmação) quando algum campo de senha é
  preenchido.
- **`ProfileForm`**.

## `preferences-schemas.ts` — preferências (RF04) e mapeamentos

A UI mantém um formato único (`PreferencesValue`), mas o back-end usa **dois
recursos**: EAV (`/me/preferences`) e gêneros (`/me/genres`).

- **`PreferencesValue`** — formato da UI (categorias de livro e áreas de artigo
  separadas, pois aparecem em seções distintas).
- **`emptyPreferences`**.
- **`EavPreferencesPayload`** — corpo de `/me/preferences` (`languages`,
  `contentTypes`, `knowledgeAreas`).
- **`GenresPayload`** — corpo de `/me/genres` (`genres`, slugs).
- **`apiToPreferences(eav, genres)`** — mescla as duas respostas no formato da UI;
  separa os slugs de `genres` em categorias de livro e gêneros literários pelos
  conjuntos de vocabulário do front.
- **`preferencesToEav(v)`** / **`preferencesToGenres(v)`** — extraem cada corpo do
  formato da UI (gêneros = categorias de livro + gêneros literários).

## `reading-status-schemas.ts` — estado na estante

- **`readingStatusOptions`** — rótulos (PT) e cores para o enum `ReadingStatus`
  (`want_to_read | reading | read | abandoned`). Reusado no dropdown de estante e no
  indicador "Estado na estante".
- **`readingStatusMap`** — `Map` por `value` para acesso direto.
