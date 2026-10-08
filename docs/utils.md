# `src/utils` — utilitários

## `reader-preferences.ts` — preferências do leitor (localStorage)

Persistência **por dispositivo** (localStorage) das preferências do leitor. O tema
é compartilhado entre o leitor de EPUB e a seção "Leitor e interface" do perfil
(ver `useReaderPreferences`, que usa o back-end como fonte da verdade e este módulo
como cache). Todos os acessos são protegidos com `try/catch` (storage pode lançar em
aba anônima).

Chaves: `reader:theme`, `reader:resume-auto`, `reader:save-dictionary`,
`reader:position:<bookId>`.

- **`getStoredTheme()` / `setStoredTheme(value)`** — tema salvo (RF26); a leitura
  valida o valor e cai em `'light'`.
- **`getResumeAuto()` / `setResumeAuto(v)`** — toggle "retomar na última página"
  (padrão ligado).
- **`getSaveDictionary()` / `setSaveDictionary(v)`** — toggle "salvar dicionário"
  (padrão ligado). Lido pelos épicos correspondentes quando existirem.
- **`getStoredPosition(bookId)` / `setStoredPosition(bookId, cfi)`** — última posição
  lida por obra (RF18), como **CFI** do epub.js. Em obra *reflowable* o número de
  página é instável; o CFI é a posição robusta para retomar.

## `register-utils.ts`

- **`buildPayload(form)`** — monta o `RegisterRequest` a partir do formulário de
  cadastro (trim de nome/e-mail, casts de enums). **Nota de contrato:** a API recebe
  categorias de livro e áreas de artigo num **único array de slugs** (`categories`),
  então `bookCategories` e `articleAreas` são concatenados.
