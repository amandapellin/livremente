# `src/constants` — constantes compartilhadas

## `lgpd.ts`

- **`LGPD_CONSENT_PARAGRAPHS`** — texto de consentimento (LGPD) exibido no cadastro
  (etapa 3) e na revisão de consentimento do perfil. **Fonte única** para manter os
  dois lugares em sincronia.

## `reader-const.ts` — constantes do leitor

- **`readerThemeColors`** — `Record<ReaderTheme, ReaderSurface>`: cores de cada tema
  (claro/sépia/escuro). Fonte única usada tanto no conteúdo do EPUB quanto no chrome
  da tela (topbar/nav).
- **`FONT_FAMILIES`** — `Record<ReaderFont, string>`: `font-family` de cada opção
  (editor serif / sem serifa / OpenDyslexic).
- **`FONT_SIZE`** — `{ min: 80, max: 180, step: 10, default: 100 }` (tamanho do texto
  em %).
- **`LINE_SPACING`** — `{ min: 1.2, max: 2.4, step: 0.1, default: 1.6 }` (entrelinha,
  multiplicador).
- **`PAGE_COLORS`** — `ReaderOption<ReaderTheme>[]`: opções de cor de página
  (Clara/Sépia/Escura).
- **`FONT_OPTIONS`** — `ReaderOption<ReaderFont>[]`: opções de fonte.
- **`ALIGN_OPTIONS`** — `ReaderIconOption<ReaderAlign>[]`: opções de alinhamento (com
  ícones MUI).
- **`PAGE_TYPES`** — `ReaderIconOption<ReaderPageType>[]`: opções de tipo de página
  (dupla/única/rolagem, com ícones).
