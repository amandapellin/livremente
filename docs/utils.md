# `src/utils` — utilitários

> **Acesso à API nos *utils*:** as chamadas autenticadas feitas à mão (estante,
> leitor, dicionário, recomendações) passam pela camada central
> **`src/api/authed-fetch.ts`** (ver `docs/api.md`), não por `fetch` + token
> duplicado. Regra: chamadas **aguardadas** (GET/mutação cujo resultado é lido)
> usam **`authedFetch`** (ganham o *refresh* no 401); disparos **fire-and-forget**
> com `keepalive` (salvar página/percentual, *heartbeat*) usam `fetch` +
> **`authHeaders`** direto (o `await` do refresh anularia o `keepalive`). A base da
> API é sempre **`API_BASE`** — não redeclarar `import.meta.env.VITE_API_URL`.

## `reader-preferences.ts` — preferências do leitor (localStorage)

Persistência **por dispositivo** (localStorage) das preferências do leitor. O tema
é compartilhado entre o leitor de EPUB e a seção "Leitor e interface" do perfil
(ver `useReaderPreferences`, que usa o back-end como fonte da verdade e este módulo
como cache). Todos os acessos são protegidos com `try/catch` (storage pode lançar em
aba anônima).

Chaves: `reader:theme`, `reader:resume-auto`, `reader:save-dictionary`,
`reader:position:<bookId>`, `reader:percent:<bookId>`.

- **`getStoredTheme()` / `setStoredTheme(value)`** — tema salvo (RF26); a leitura
  valida o valor e cai em `'light'`.
- **`getResumeAuto()` / `setResumeAuto(v)`** — toggle "retomar na última página"
  (padrão ligado).
- **`getSaveDictionary()` / `setSaveDictionary(v)`** — toggle "salvar dicionário"
  (padrão ligado). Lido pelos épicos correspondentes quando existirem.
- **`getStoredPosition(bookId)` / `setStoredPosition(bookId, cfi)`** — última posição
  lida por obra (RF18), como **CFI** do epub.js. Em obra *reflowable* o número de
  página é instável; o CFI é a posição robusta para retomar.
- **`getStoredPercentage(bookId)` / `setStoredPercentage(bookId, percent)`** —
  percentual lido por obra (RF19), inteiro 0–100. Hidrata o indicador do leitor sem
  flash de 0% e serve de *fallback* até o endpoint de progresso do back-end existir.

## `reader-bookmarks.ts` — páginas marcadas (RF21, EPUB)

Persistência **por obra** dos marcadores de página em `localStorage` (chave
`reader:bookmarks:<bookId>`, lista de `Bookmark` serializada como JSON). O `Bookmark`
(`types/reader-types.ts`) guarda `id` (= CFI, único por página), `label` e `createdAt`.
Restrito a EPUB (o viewer nativo de PDF não expõe a página atual). Ver `useBookmarks`
(estado reativo) e `BookmarksMenu` (UI).

- **`getBookmarks(bookId)`** — lista salva (sempre um array; tolera JSON inválido).
- **`addBookmark(bookId, bookmark)`** — adiciona se o `id` ainda não existe.
- **`removeBookmark(bookId, id)`** — remove pelo `id`.

## `reader-highlights.ts` — grifos (RF22, EPUB)

Persistência **por obra** dos grifos em `localStorage` (`reader:highlights:<bookId>`,
lista de `Highlight` em JSON; `id = cfiRange` do epub.js). **Criação e listagem**
são integradas ao back-end (`/api/reading/{id}/highlights`, #27) atrás de
`USE_HIGHLIGHTS_API` (hoje `true`); **recolorir/nota/excluir** seguem **locais**
atrás de `USE_HIGHLIGHT_MUTATIONS_API` (hoje `false`, sem rota no back). Ver
`useHighlights` (estado reativo) e, no leitor, `useEpubReader` (seleção/overlay via
`annotations`).

- **`getHighlights(bookId)`** / **`saveHighlight(bookId, h)`** / **`deleteHighlight(bookId, id)`**
  / **`updateHighlightColor(bookId, id, color)`** / **`updateHighlightNote(bookId, id, note)`**
  — leitura, inserção idempotente (por `id`), remoção, troca de cor e de **nota**
  (RF23; `note` vazio volta a `undefined`) no `localStorage`.
- **`sendHighlight(bookId, h)`** — `POST /api/reading/{id}/highlights`
  (`{ excerpt, epubPosition, color }`, onde `epubPosition = cfiRange`); integrado
  (atrás de `USE_HIGHLIGHTS_API`). *Fire-and-forget*.
- **`updateHighlightRemote(bookId, id, color)`** / **`updateHighlightNoteRemote(bookId, id, note)`**
  — `PATCH /api/reading/{id}/highlights/{id}` (`{ color }` ou `{ note }`); **proposto**,
  no-op até existir a rota (atrás de `USE_HIGHLIGHT_MUTATIONS_API`).
- **`removeHighlightRemote(bookId, id)`** — `DELETE /api/reading/{id}/highlights/{id}`;
  idem (proposto, atrás de `USE_HIGHLIGHT_MUTATIONS_API`).

## `reader-progress.ts` — progresso de leitura no back-end (RF17/RF18/RF19)

Sincroniza a última página e o percentual com o back-end (*cross-device*),
**autenticado** e integrado (sem flag). As **escritas** são *fire-and-forget* com
`keepalive: true` (sobrevivem ao fechamento da aba — *flush* em `pagehide`); por
isso usam `fetch` + `authHeaders` (de `authed-fetch`), não `authedFetch` (o `await`
do refresh anularia o keepalive). Chamadas pelo `useEpubReader` durante a leitura e
no *flush* ao sair; o back-end restringe a EPUB (422 fora disso). O `localStorage`
dos *reader-preferences* (`reader:position:<id>`, `reader:percent:<id>`) segue como
cache/fallback local.

- **`saveLastPage(bookId, lastPageRead)`** — `PUT /api/reading/{id}/last-page`
  (`{ lastPageRead }`). `lastPageRead` é o **índice de *location*** do epub.js
  (inteiro ≥ 0), **não** CFI. No-op sem sessão ou com valor negativo (RF17/RN08).
- **`savePercentage(bookId, readPercentage)`** — `PUT /api/reading/{id}/percentage`
  (`{ readPercentage }`, 0–100). No-op sem sessão ou fora da faixa (RF19).
- **`fetchLastPage(bookId)`** — `GET /api/reading/{id}/last-page` (via `authedFetch`,
  ganha o *refresh* no 401) → `number | null` (lê `lastPageRead`; null se nunca leu /
  anônimo / erro). Base da retomada (RF18).

## `reading-session.ts` — sessão e tempo de leitura (RF20)

Mede o **tempo de tela ativa** por obra: acumula em `localStorage`
(`reader:time:<bookId>`, em **segundos**) e registra a sessão no back-end
(**autenticado** e integrado — sem flag; EPUB e PDF). Ver `useReadingSession`, que
orquestra pausa/retomada e os *flushes*.

- **`getStoredReadingTime(bookId)` / `addStoredReadingTime(bookId, seconds)`** —
  total acumulado por obra (incrementa; alimenta o `readingTimeMinutes` da
  estante/detalhes). Protegido com `try/catch`.
- **`formatDuration(totalSeconds)`** — formata `m:ss` (ou `h:mm:ss` a partir de 1h).
- **`startSession(bookId)`** — `POST /api/reading/{id}/session` (via `authedFetch`,
  ganha o *refresh* no 401) → `sessionId | null` (null sem sessão / erro). Abre a
  sessão ao entrar no leitor.
- **`updateSession(sessionId, activeSeconds)`** — `PUT /api/reading/sessions/{sessionId}`
  (`{ activeSeconds }`, total de segundos da sessão): *heartbeat*/encerramento.
  *Fire-and-forget* com `keepalive`; por isso usa `fetch` + `authHeaders` (de
  `authed-fetch`), não `authedFetch`. No-op sem sessão ou com `activeSeconds < 0`.

## `register-utils.ts`

- **`buildPayload(form)`** — monta o `RegisterRequest` a partir do formulário de
  cadastro (trim de nome/e-mail, casts de enums). **Nota de contrato:** a API recebe
  categorias de livro e áreas de artigo num **único array de slugs** (`categories`),
  então `bookCategories` e `articleAreas` são concatenados.
