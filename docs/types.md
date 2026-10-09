# `src/types` — tipos compartilhados

## `reader-types.ts` — tipos do leitor

Uniões de string e interfaces usadas pelo leitor de EPUB, pelo modal de
Configurações e pela seção "Leitor e interface" do perfil.

- **`ReaderTheme`** — `'light' | 'sepia' | 'dark'` (cor de página / tema).
- **`ReaderFont`** — `'editor' | 'sans' | 'dyslexic'` (família de fonte).
- **`ReaderAlign`** — `'justify' | 'left' | 'center' | 'right'` (alinhamento).
- **`ReaderPageType`** — `'single' | 'double' | 'scroll'` (tipo de página).
- **`ReaderSurface`** — `{ background, text, border }`: cores de uma superfície do
  leitor (conteúdo + chrome da tela).
- **`ReaderOption<T>`** — `{ value: T; label: string }`: opção de seleção genérica
  de um campo do leitor.
- **`ReaderIconOption<T>`** — `ReaderOption<T>` + `{ Icon: SvgIconComponent }`:
  opção com ícone (alinhamento, tipo de página).
- **`Bookmark`** — `{ id, label, cfi, createdAt }`: marcador de página do EPUB (RF21;
  `id = cfi`). Ver `reader-bookmarks`/`useBookmarks`.
- **`Highlight`** — `{ id, cfiRange, text, chapter, createdAt }`: grifo do EPUB (RF22;
  `id = cfiRange` do epub.js). Ver `reader-highlights`/`useHighlights`.
