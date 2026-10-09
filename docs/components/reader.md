# `src/components/reader` — leitor (EPUB e PDF)

Componentes da tela de leitura (`/leitura/:id`, RF15/RF16/RF18/RF26). A página é um
*dispatcher* (ver `docs/pages.md`) que escolhe o leitor pelo arquivo disponível. O
ciclo de vida do EPUB fica em `useEpubReader`; o tema/preferências em
`useReaderPreferences` (ver `docs/hooks.md`).

## Leitores

- **`epub-reader/` → `EpubReader`** — leitor de EPUB via epub.js. O fundo acompanha
  o tema do leitor (cobre as margens da renderização); topbar e navegação seguem a
  mesma cor. Sincroniza o tema com o back-end (RF26): aplica o tema do servidor
  quando ele chega (efeito gatilhado só por `prefs.serverTheme`, por isso o
  `eslint-disable` de `exhaustive-deps` — não deve brigar com o usuário durante a
  sessão) e, em `changeTheme`, aplica no epub e persiste (cache + back-end).
- **`pdf-reader/` → `PdfReader`** — leitor de PDF (RF16): delega a renderização ao
  **visualizador nativo do navegador** via `<iframe>` (scroll, zoom, miniaturas,
  busca e impressão vêm prontos). Mantém só a topbar da marca.
- **`pdf-topbar/` → `PdfTopbar`** — topbar enxuta do PDF: voltar, título/subtítulo,
  `SessionTimer` e link externo para a fonte. Controles de página/zoom ficam no
  visualizador nativo. `squareSx` estiliza o botão quadrado de voltar. (Sem marcação
  de página — o viewer nativo não expõe a página atual; RF21 é só EPUB.)

## Casca do leitor de EPUB

- **`reader-topbar/` → `ReaderTopbar`** — topo: voltar, título, capítulo atual,
  barra de progresso, `SessionTimer`, botão de configurações (`ReaderSettings`) e
  **"Grifos e Anotações"** — toggle do painel lateral (RF22; `highlightsOpen` +
  `onToggleHighlights`, fica gold quando aberto). Responsivo: no mobile reduz
  `gap`/`px`, oculta "Grifos e Anotações" e o timer, e `ReaderSettings` fica só-ícone.
- **`reader-view/` → `ReaderView`** — área de renderização (o `containerRef` recebe
  a *rendition* do epub.js) + estados de carregando/erro. `minWidth: 0` para encolher
  ao lado do painel de grifos (flex item não encolhe abaixo do conteúdo sem isso).
- **`highlight-toolbar/` → `HighlightToolbar`** — toolbar flutuante (RF22/RF23) ancorada
  na seleção/no grifo clicado: **paleta de cores** (`HIGHLIGHT_COLORS`) para grifar +
  ação **"Anotar"** (`onAnnotate`); no grifo existente destaca a `activeColor`
  (recolorir) e mostra a lixeira (`onRemove`). Fecha no `ClickAway`; posição `fixed` a
  partir das coordenadas de `useEpubReader`.
- **`note-dialog/` → `NoteDialog`** — editor da anotação (RF23): `TextField` multiline
  com Salvar/Cancelar. Remontado por `key` (o `EpubReader` o keya pelo `cfiRange`-alvo)
  para o valor inicial refletir a nota atual.
- **`highlights-panel/` → `HighlightsPanel`** — painel lateral (RF22/RF23) aberto pelo
  botão "Grifos e Anotações": **abas Todos/Grifos/Anotações** (Grifos = sem nota,
  Anotações = com nota), lista os cards (overline do capítulo + trecho com borda **na
  cor do grifo**, `highlightFill`, + a **nota** quando houver), com ir (`display`),
  **editar nota** (`onEditNote`) e remover; segue a cor do tema (`surface`); estado
  vazio por aba.
- **`reader-nav/` → `ReaderNav`** — rodapé: "Anterior"/"Próxima" e a marcação de
  página (RF21) — botão **toggle** ("Marcar Página" ⇄ "Página marcada", ícone
  contornado/cheio conforme `marked`) + `BookmarksMenu` para revisitar/remover.
- **`buttons/` → `ReaderButton`** — botão compacto compartilhado do leitor, com
  `tone` `'surface'` (contornado) ou `'gold'` (destaque). `BASE_SX` define o
  tamanho/tipografia compactos padrão (o padding pode ser sobrescrito por `sx`).
- **`session-timer/` → `SessionTimer`** — indicador compacto (ícone de relógio +
  rótulo) do tempo da sessão de leitura (RF20), usado por ambas as topbars; recebe
  `label` (de `useReadingSession`) e `color`/`sx` para casar com o tema de cada leitor.
- **`bookmarks-menu/` → `BookmarksMenu`** — menu das páginas marcadas (RF21): lista os
  `Bookmark` (rótulo), com ação de ir (`onSelect`) e remover (`onRemove`); usado pelo
  EPUB (`ReaderNav`).

## Modal de configurações (`reader-settings/`)

- **`reader-settings/` → `ReaderSettings`** — modal de ajustes (inspirado no
  Biblion), dividido em duas colunas. Orquestra os campos abaixo.
  - **`font-field/` → `FontField`** — família de fonte (editor / sem serifa /
    OpenDyslexic).
  - **`align-field/` → `AlignField`** — alinhamento do texto.
  - **`page-color-field/` → `PageColorField`** — cor de página (claro/sépia/escuro),
    como amostras circulares.
  - **`page-type-field/` → `PageTypeField`** — tipo de página (dupla/única/rolagem).
  - **`settings-section/` → `SettingsSection`** — moldura de uma seção (título +
    conteúdo).
  - **`settings-option-card/` → `SettingsOptionCard`** — cartão-botão selecionável
    (fonte/alinhamento/tipo de página).
  - **`settings-slider/` → `SettingsSlider`** — slider com rótulo de valor (tamanho
    do texto, entrelinha).
