# `src/utils` — utilitários

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

## `reading-session.ts` — tempo de leitura da sessão (RF20)

Acumula o **tempo de tela ativa** por obra e envia ao back-end. O envio fica atrás
de `USE_READING_SESSION_API` (hoje `false`): enquanto a rota não existe, só acumula
em `localStorage` (chave `reader:time:<bookId>`, em **segundos**). Ver
`useReadingSession`, que orquestra pausa/retomada e os *flushes*.

- **`getStoredReadingTime(bookId)` / `addStoredReadingTime(bookId, seconds)`** —
  total acumulado por obra (incrementa; alimenta o `ReadingProgress.readingTimeMinutes`
  da estante/detalhes). Protegido com `try/catch`.
- **`formatDuration(totalSeconds)`** — formata `m:ss` (ou `h:mm:ss` a partir de 1h).
- **`sendReadingTime(bookId, seconds)`** — envia o **delta** ao contrato proposto
  `POST /api/users/me/reading-progress/{id}/session` (`{ seconds }`). *Best-effort* e
  com `keepalive: true` para sobreviver ao fechamento da aba (*flush* em `pagehide`);
  por isso usa `fetch` + token manual em vez do cliente gerado. No-op com o flag
  desligado. Ao ligar: atualizar `openapi.json` → `pnpm gen:api`.

## `register-utils.ts`

- **`buildPayload(form)`** — monta o `RegisterRequest` a partir do formulário de
  cadastro (trim de nome/e-mail, casts de enums). **Nota de contrato:** a API recebe
  categorias de livro e áreas de artigo num **único array de slugs** (`categories`),
  então `bookCategories` e `articleAreas` são concatenados.
