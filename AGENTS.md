# Contexto do Projeto — LivreMente (front-end) — para agentes de IA

> Arquivo de contexto para qualquer agente de IA continuar a implementação do
> **front-end sem precisar de contexto adicional**. Documento **vivo**: atualize a
> seção "Status por issue" a cada issue concluída. Não contém segredos.

## 1. O que é o projeto

LivreMente é uma **plataforma web de leitura** que reúne livros de domínio público
(Project Gutenberg, via API Gutendex) e artigos científicos de acesso aberto
(arXiv). O usuário se cadastra, informa preferências e recebe recomendações; lê
obras e registra grifos, anotações e progresso.

Este repositório é o **front-end (SPA)**. A API REST fica em outro repositório,
integrada por contrato OpenAPI.

| Parte | Repositório | Caminho local | Branch padrão |
|---|---|---|---|
| Front-end (SPA) | `amandapellin/livremente` | `/home/amanda/WebstormProjects/livremente` | `develop` |
| Back-end (API REST) | `amandapellin/livremente_backend` | `/home/amanda/Documentos/livremente_backend` | `main` (integração em `develop`) |

Requisitos referenciados por código: **RFxx** (funcional), **RNxx** (regra de negócio).

## 2. Stack

React 19 · TypeScript · Vite 8 · Material UI (MUI 9) + Emotion · React Router 8 ·
React Hook Form 7 + Zod 4 (validação) · TanStack Query 5 (requisições/estado de
servidor) · **orval 8** (gera o cliente HTTP a partir do OpenAPI) · ESLint ·
**pnpm**.

## 3. Estrutura e convenções

- `src/pages/<nome>/index.tsx` — páginas (kebab-case), carregadas *lazy* pelo
  roteador (`src/routes/router.tsx`).
- `src/components/<area>/<componente>/index.tsx` — componentes reutilizáveis.
- `src/hooks/use*.ts` — lógica de tela (ex.: `useRegisterForm`, `useLoginForm`).
- `src/schemas/*.ts` — esquemas Zod e opções (ex.: `register-schemas`,
  `category-schemas`, `login-schemas`).
- `src/api/` — camada de acesso à API (ver seção 4).
- `src/theme/` — tema e *tokens* de design. `src/utils/` — utilitários.
- **Alias de import:** `@` → `/src` (ex.: `import X from '@/components/...'`).
- Formulários: **React Hook Form**; validação: **Zod** (via `@hookform/resolvers`).

## 4. Integração com a API (contract-first) — IMPORTANTE

- O cliente HTTP é **gerado** por orval em **`src/api/generated/`**
  (`endpoints.ts`, `endpoints.zod.ts`, `model/`). **Não edite arquivos gerados à
  mão.**
- Fonte da geração: o *snapshot* do contrato em **`src/api/openapi.json`**.
  Fluxo ao mudar o contrato do back-end: atualizar `src/api/openapi.json` →
  rodar **`pnpm gen:api`** (config em `orval.config.ts`) → o cliente é regerado.
- **`src/api/fetcher.ts`** (`customFetch`) envolve o cliente gerado: injeta o
  token JWT, intercepta **401 → refresh** automático, e lança **`HttpError`**
  (com `status` e `data`) para a UI tratar casos específicos (ex.: 409 no cadastro).
- **Base URL:** `import.meta.env.VITE_API_URL ?? ''`. Em dev, usa-se o **proxy do
  Vite**: `/api` → `http://localhost:5091` (configurado em `vite.config.ts`), então
  a base fica vazia (mesma origem, sem CORS). Alternativa: definir `VITE_API_URL`
  num `.env.local` para chamar o back-end diretamente.

## 5. Contrato front ↔ back (pontos que já causaram atrito)

- Cadastro: **`POST /api/auth/register`**. Campo de tipo de obra nas preferências:
  **`publications`** (não "materials"), valores **`book` / `scientific_article`**.
- Erros da API: `{ message, code }` (ex.: `code: "EMAIL_ALREADY_EXISTS"`).
- Confirmação de e-mail: o back-end **redireciona** para
  `/login?confirmed=1|invalid` — a tela de login lê esse parâmetro e exibe um
  *toast*.
- *Slugs* de categorias/gêneros/idiomas em `src/schemas/category-schemas.ts` são o
  contrato de vocabulário: **devem casar com as chaves do `PreferenceCatalog`** do
  back-end.
- Catálogo: **`GET /api/catalog`** (lista → `CatalogPage` com `Publication[]`) e
  **`GET /api/catalog/{id}`** (detalhes → `PublicationDetails`) são **propostos
  pelo front** e ainda não existem no back-end — a UI usa mocks trocáveis
  (`USE_CATALOG_MOCK` em `useCatalogSearch`/`usePublicationDetails`). Ao
  implementar, alinhar o *shape* e desligar o flag.
- **`ReadingStatus`** (estado na estante) espelha o enum do back-end
  (`read | reading | want_to_read | abandoned`) e trafega como **string** no JSON.
  O back-end já garante isso globalmente (`JsonStringEnumConverter` em
  `ConfigureHttpJsonOptions`); o cliente gerado já é *string union* — **nada a
  ajustar no front** (o mesmo vale para `Gender`, `PublicationType`, `ReadingLanguage`).

## 6. Execução e verificação

- Instalar: `pnpm install`. Rodar: **`pnpm dev`** (Vite em `http://localhost:5173`).
- Back-end em dev (para o proxy funcionar): rodar a API em
  `http://localhost:5091` (`dotnet run --urls http://localhost:5091` no repo do back).
- Verificações estáticas: **`pnpm lint`** e
  **`pnpm exec tsc -p tsconfig.app.json --noEmit`** (checagem de tipos).
- Build de produção: `pnpm build`. Em produção, definir `VITE_API_URL` para a URL
  pública da API.

## 7. Convenções de contribuição

- **Commits:** Conventional Commits em português, no imperativo (ex.:
  `feat(auth): implementa tela de login`).
- **Branches:** `feat/<n>-descricao` (n = número da issue).
- **PRs:** referenciam a issue (`Closes #n`).
- **Sem segredos** no versionamento; `.env.local` é ignorado pelo git.

## 8. Status por issue (ATUALIZAR A CADA ISSUE)

**Concluído (mergeado):**
- Landing page.
- **#5 (RF01) Tela de cadastro:** *wizard* de 3 etapas (Dados, Preferências, LGPD)
  com stepper, React Hook Form + Zod, envio via cliente orval, tratamento amigável
  de 409, tela de sucesso.
- **#6 (RF02) Tela de login:** e-mail/senha com React Hook Form + Zod; *toast* no
  `/login` lendo `?confirmed=1|invalid` (RN01, integração).
- **#7 (RF02) Persistência de sessão:** "manter-se conectado"
  (local/sessionStorage) e *refresh token* com renovação transparente no 401
  (centralizado no `fetcher`).
- **#8 (RF03) Tela de edição de perfil:** formulário pré-preenchido via
  `GET /api/users/me`, com **um único "Salvar alterações"** que orquestra três
  recursos (só chama o que mudou): **nome** (`PUT /api/users/me`), **senha**
  (`PATCH /api/users/me/password`, trata 422 "senha atual incorreta" por campo)
  e **avatar** (`PUT`/`DELETE /api/users/me/avatar`, upload *multipart* PNG/JPG
  ≤2 MB com *preview* e volta às iniciais). E-mail somente-leitura. Os blocos
  **Leitor e interface** e **Dados e privacidade** foram implementados (ver
  abaixo). Endpoints já implementados no back-end (o `DELETE` do avatar é o último
  pendente). O `customFetch` não força `Content-Type` em `FormData`.
- **#9 (RF04) Preferências de leitura:** idioma, tipo de conteúdo (livro/artigo),
  categorias/áreas de conhecimento e gênero literário via *chips* (multi-seleção),
  num componente compartilhado (`PreferencesFields`) usado **no cadastro e no
  perfil**. **Contrato alinhado ao back-end (#11 EAV + #12 gêneros):** no perfil,
  o `useProfilePreferences` orquestra **dois recursos** — EAV em
  `GET`/`PUT /api/users/me/preferences` (`{ languages, contentTypes, knowledgeAreas }`)
  e gêneros/categorias de livro em `GET`/`PUT /api/users/me/genres` (`{ genres }`,
  slugs). Carrega e salva os dois em paralelo (`Promise.all`), com *toast* próprio.
  A UI mantém o formato único `PreferencesValue`; o mapeamento de/para os dois
  contratos fica em `preferences-schemas` (`preferencesToEav`,
  `preferencesToGenres`, `apiToPreferences`). **O cadastro (`register`) NÃO mudou** —
  segue enviando o payload combinado (`{ languages, publications, categories,
  literaryGenres }`) que o back-end roteia pelo `PreferenceCatalog`. Há também
  `DELETE /api/users/me/genres/{genreId}` no contrato (remoção granular), não usado
  pela UI de chips (que usa o `PUT` de substituição).
- **#10 (RF29) Logout:** estado de sessão reativo (`useIsAuthenticated` via
  `useSyncExternalStore`, com eventos emitidos por `auth-storage`). O header
  alterna **conta ⇄ "Entrar"**; autenticado, o botão de conta abre um *popover*
  (`AccountMenu`) com identidade (avatar/nome/e-mail), "Editar perfil" e "Sair".
  O logout (`useLogout`) chama `POST /api/auth/logout` (contrato proposto pelo
  front) de forma *best-effort* — em erro ou sucesso limpa a sessão, descarta o
  cache e redireciona para a landing (RF28). Também no Drawer (mobile).
- **#11 (RF10) Tela de busca/catálogo** (com filhas **#12 RF11** e **#13 RF12**):
  lista de publicações (`PublicationCard`), busca por palavra-chave com
  **debounce ao digitar + submit** (`useDebouncedValue`), **filtros em sidebar**
  quebrados em componentes (`TypeFilter` com contagem, `LanguageFilter`,
  `GenreFilter`) com **visibilidade condicional por tipo** (idioma e gênero só
  para livro; área só para artigo), ordenação, **paginação numerada** e estados
  de carregando/vazio/erro. Contrato `GET /api/catalog` proposto pelo front
  (params `q/type/languages/genres/sort/page` → `CatalogPage` com `Publication[]`
  e `counts`), regenerado com orval. Enquanto o back-end não expõe o endpoint,
  os dados vêm de um **mock trocável** (`src/api/catalog-mock.ts` +
  `useCatalogSearch`, flag `USE_CATALOG_MOCK`). O filtro de **ano** foi removido
  do critério do #13. Entidade nomeada `Publication` (casa com `PublicationType`);
  `obra` fica só como rótulo de UI/rota (`/obra/:id`). Há alternância de
  visualização **lista ⇄ grade** (`PublicationGridCard`; preferência em
  `localStorage`).
- **#14 (RF13) Tela de detalhes da obra/artigo:** metadados completos da
  publicação em `/obra/:id` — `usePublicationDetails` via `GET /api/catalog/{id}`
  (contrato proposto pelo front + mock trocável `catalog-details-mock`).
  Componentes decompostos: `PublicationHeader` (capa, título, meta, ações),
  `SynopsisSection` e `MetadataAside` (responsáveis, gêneros/assuntos, publicação,
  estado na estante). Ações: **"Ler agora"** (→ `/leitura/:id`, épico Leitura),
  **"Baixar epub"** (`downloadUrl`) e **"Adicionar à estante"** como *dropdown* de
  estado usando o enum **`ReadingStatus`** do back-end
  (`read | reading | want_to_read | abandoned`; rótulos/cores em
  `reading-status-schemas`) — gancho para o épico Estante. Estados
  carregando/não-encontrada (404)/erro. Quando na estante em **lido/lendo/
  abandonado**, exibe um **card de progresso** (`ReadingProgressCard` + schema
  `ReadingProgress`): % lido, posição/última sessão, barra e métricas (tempo de
  leitura, grifos, anotações, páginas marcadas). **Atenção:** o back-end deve
  serializar `ReadingStatus` como *string* (`JsonStringEnumConverter`), não
  número; `readingStatus`/`readingProgress` são dados do usuário (épico
  Estante/Leitura), hoje no contrato de detalhes por praticidade do mock.

- **#16 (RF15) Leitor de EPUB (epub.js):** leitor em `/leitura/:id` que renderiza
  o `epubFileUrl` do material via **epub.js** (`useEpubReader`): render paginado,
  **navegação** página/capítulo (botões Anterior/Próxima + setas do teclado),
  **reflow** responsivo (RNF15, via `ResizeObserver` + rendition 100%), capítulo
  atual (TOC) e progresso (%). **Modal de Configurações** (inspirado na biblioteca
  Biblion): família de fonte (editor / sem serifa / **OpenDyslexic**, injetada no
  iframe via `rendition.hooks.content`), **tamanho do texto**, **entrelinha**,
  **alinhamento**, **cor de página** (claro/sépia/escuro — migrada para o modal;
  as pills da topbar foram removidas) e **tipo de página** (dupla/única/rolagem,
  via `rendition.flow`/`spread`). A rota **esconde o header e o footer globais**
  (o `App` oculta ambos em `/leitura/:id`); topbar e barra de navegação acompanham
  a cor do tema selecionado. Componentes em `components/reader/`: `reader-topbar`,
  `reader-view`, `reader-nav`, `buttons` (`ReaderButton` compartilhado) e
  `reader-settings` decomposto em primitivos (`settings-section`,
  `settings-option-card`, `settings-slider`) + campos (`font-field`, `align-field`,
  `page-color-field`, `page-type-field`). **Tipos e constantes do leitor** ficam em
  `src/types/reader-types.ts` e `src/constants/reader-const.ts`. Contrato:
  `epubFileUrl` em `PublicationDetails`; em dev, um `public/sample.epub` (domínio
  público) evita CORS — em produção usa-se o `epub_file_url` real. **Fora de escopo
  (issues próprias):** grifos/anotações, dicionário, marcar página e cronômetro de
  sessão.

- **#17 (RF16) Leitor de PDF (visualizador nativo):** leitor de artigos (PDF) no
  mesmo `/leitura/:id`, agora um **dispatcher** (`LeitorPage`) que escolhe o leitor
  pelo arquivo disponível — **`pdfFileUrl` → `PdfReader`**, senão **`epubFileUrl` →
  `EpubReader`** (o corpo EPUB da #16 foi extraído para `components/reader/
  epub-reader/`); cada leitor é **keyado por obra** (`key={data.id}`). O `PdfReader`
  **delega a renderização ao visualizador nativo do navegador** via `<iframe
  src={pdfFileUrl}>` — scroll, **zoom**, **navegação de página**, miniaturas, busca
  e impressão vêm prontos do browser (critérios do RF16). Decisão de produto: a
  tentativa inicial com `pdfjs-dist` (render em canvas) foi descartada por ficar
  aquém do visualizador nativo; **o `pdfjs-dist` foi removido** junto de
  `usePdfReader`/`pdf-view`/`pdf-aside`/`pdf-thumb`. Resta uma **topbar enxuta**
  (`pdf-topbar`): voltar, título/subtítulo e “Abrir no {source}” (`downloadUrl`).
  Moldura escura fixa (tokens `papel`). **Embed:** o PDF precisa ser servido inline e
  sem `X-Frame-Options`/CSP `frame-ancestors` restritivos — o arXiv atende
  (`content-disposition: inline`, `ACAO: *`, sem XFO) e o backend servirá os próprios
  arquivos. Em dev, `public/sample.pdf` (mesma origem). **Fora de escopo:**
  grifos/anotações, progresso de leitura (o visualizador nativo é caixa-preta para
  esses épicos — reavaliar PDF.js quando entrarem).

- **Dados e privacidade (LGPD) — perfil** (sem issue; definido com a usuária): o
  bloco "Dados e privacidade" do perfil deixou de ser placeholder.
  **Exportar meus dados** (`useDataExport`): compõe um JSON (perfil + preferências
  + gêneros, dos endpoints **reais já existentes**) e baixa no navegador
  (`livremente-meus-dados.json`) — portabilidade LGPD. **Rever consentimento**
  (`useConsent` + `ConsentDialog`): mostra os termos (texto compartilhado em
  `constants/lgpd.ts`, reusado no cadastro) e a data, o consentimento obrigatório
  como concedido (somente leitura) e permite alternar o **opcional** (avisos) via
  `PUT /api/users/me/consent`. **Excluir conta e dados** (`useDeleteAccount` +
  `DeleteAccountDialog`): ação destrutiva via `DELETE /api/users/me`, confirmada
  **digitando o e-mail** da conta; em sucesso limpa a sessão e volta à landing.
  **Contrato proposto pelo front** (`DELETE /api/users/me`,
  `GET`/`PUT /api/users/me/consent` + `UserConsent`/`UpdateConsentRequest`),
  regenerado com orval. O **back-end já expõe** consent/delete, então os três
  fluxos usam os **endpoints reais** (o mock `privacy-mock.ts` foi removido).
  Componentes em `components/profile/privacy-section/` (`consent-dialog`,
  `delete-account-dialog`).

- **#18 (RF26) Seletor de tema do leitor (claro/sépia/escuro):** o seletor e a
  aplicação imediata já vinham do #16 (campo **"Cor de página"** no modal de
  Configurações). Esta issue adiciona a **persistência** (critério 3) e corrige um
  bug. Decisão: o seletor **fica no modal** (não voltam pills para a topbar).
  **Correção de bug:** `rendition.themes.select()` não revertia ao voltar a um
  tema (as regras do tema anterior persistiam) — trocado por
  `themes.override('color'/'background', …, true)` numa função `applyTheme` no
  `useEpubReader` (como já era feito para fonte/alinhamento/entrelinha).
- **"Leitor e interface" — perfil + preferências do leitor (RF26):** a seção do
  perfil deixou de ser placeholder — **modo de leitura padrão** (pills) e dois
  toggles (**retomar na última página**, **salvar dicionário**). Persistência
  **cross-device no back-end**: o contrato `/api/users/me/preferences` foi
  **estendido** com `theme`/`resumeAuto`/`saveDictionary` (PUT com **merge
  parcial**, para o perfil-chips e a seção de leitor gravarem independentemente).
  O hook **`useReaderPreferences`** é a fonte da verdade (back-end) com **cache em
  `localStorage`** (`src/utils/reader-preferences.ts`, chave `reader:theme` +
  toggles) para o leitor ler **síncrono, sem flash**. A query **só roda
  autenticada** (`enabled`), **hidrata ao abrir perfil/leitor** e grava via
  `setQueryData` otimista + `PUT`. O `useEpubReader` lê o cache no mount; o
  `EpubReader` aplica o tema do servidor quando chega e grava as trocas do modal.
  Os toggles guardam a preferência para os épicos correspondentes (progresso,
  dicionário) a implementar.

- **#19 (RF18) Retomada automática de leitura (EPUB):** o `useEpubReader(url,
  bookId)` salva a posição a cada `relocated` como **CFI** do epub.js (posição
  robusta; nº de página é instável em *reflowable*) e, ao abrir, retoma com
  `rendition.display(cfi)` — com **fallback para o início** se o CFI for inválido.
  Respeita o toggle **"retomar na última página"** (`resumeAuto`): desligado,
  abre sempre do início. Persistência por obra em `localStorage`
  (`reader:position:<id>`, helpers em `utils/reader-preferences.ts`). **Cross-device
  fica para o back-end:** issue de progresso proposta no `livremente_backend`
  (`GET`/`PUT /api/users/me/reading-progress/{id}` guardando o CFI + percent);
  quando existir, troca-se o `localStorage` pelo endpoint, mantendo o cache como
  *fallback*.

- **#20 (RF19) Indicador de percentual lido (EPUB):** o `useEpubReader` calcula o
  percentual com `book.locations.percentageFromCfi(cfi)` **tanto no `relocated`
  quanto logo após `book.locations.generate()`** (helper `updateProgress`) — isso
  evita o 0% travado no load (as *locations* são geradas de forma assíncrona depois
  do `book.ready`). O percentual é **persistido por obra** em `localStorage`
  (`reader:percent:<id>`, helpers `get/setStoredPercentage`) e o estado inicial é
  hidratado dele (sem flash). A topbar exibe o percentual em **todas as larguras**
  (número sempre; barra de `md` pra cima) com `aria-label`. **Restrito a EPUB** — o
  `PdfReader`/`PdfTopbar` não mostram percentual (dicionário de dados: `read_percentage`
  só para EPUB). **Cross-device** via o mesmo endpoint de progresso do back-end
  (`reading-progress/{id}`, CFI + percent), com o cache como *fallback*.
  **Junto (responsividade da topbar do leitor):** `gap`/`px` reduzidos no mobile,
  **"Grifos e Anotações"** (placeholder "Em breve") **oculto abaixo de `md`** e
  **"Configurações" só-ícone** no mobile (rótulo responsivo + `aria-label`).

- **#21 (RF20) Contador de tempo de sessão:** hook compartilhado
  **`useReadingSession(bookId)`** usado pelos dois leitores (EPUB e PDF). Mede o
  **tempo de tela ativa** por *timestamps* (não por contador que atrasa em aba
  inativa) e **só conta com a aba visível e a janela focada**; um *tick* de 1s é
  **auto-reconciliável** (sincroniza ativo/pausado a cada segundo, robusto a eventos
  de foco perdidos), além dos listeners `visibilitychange`/`blur`/`focus`/`pagehide`.
  Faz *flush* do **delta** acumulado a cada 30s, ao perder o foco, no `pagehide` e ao
  desmontar (sair da tela). A exibição (`SessionTimer`: relógio + `m:ss`) mostra a
  **sessão atual** (zera ao reabrir) na topbar de cada leitor, **oculta no mobile**
  (`xs`) para não reapertar a barra. Utilitários em **`utils/reading-session.ts`**:
  acumulação por obra em `localStorage` (`reader:time:<id>`, segundos; alimenta o
  `ReadingProgress.readingTimeMinutes` da estante/detalhes), `formatDuration` e
  `sendReadingTime` (envio do delta, *best-effort* com `keepalive` para sobreviver ao
  `pagehide`). **Contrato proposto pelo front** (e atrás do flag
  `USE_READING_SESSION_API`, hoje `false`): `POST /api/users/me/reading-progress/{id}/session`
  (`{ seconds }`, incrementa o `read_time`). Ao implementar: `openapi.json` →
  `pnpm gen:api` → trocar o `fetch` manual pela função gerada.

**Em andamento / próximas:**
- Telas de estante e recomendações.

## 9. Documentos relacionados

- `docs/desenvolvimento.md` — texto de metodologia do artigo (3.1, parte front), vivo.
- Contexto do back-end: `AGENTS.md` no repositório `livremente_backend`.
