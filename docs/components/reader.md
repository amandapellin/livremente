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
- **`pdf-topbar/` → `PdfTopbar`** — topbar enxuta do PDF: voltar, título/subtítulo e
  link externo para a fonte. Controles de página/zoom ficam no visualizador nativo.
  `squareSx` estiliza o botão quadrado de voltar.

## Casca do leitor de EPUB

- **`reader-topbar/` → `ReaderTopbar`** — topo: voltar, título, capítulo atual,
  barra de progresso, botão de configurações (`ReaderSettings`) e "Grifos e
  Anotações" (em breve).
- **`reader-view/` → `ReaderView`** — área de renderização (o `containerRef` recebe
  a *rendition* do epub.js) + estados de carregando/erro.
- **`reader-nav/` → `ReaderNav`** — rodapé: "Anterior"/"Próxima" e "Marcar Página"
  (em breve).
- **`buttons/` → `ReaderButton`** — botão compacto compartilhado do leitor, com
  `tone` `'surface'` (contornado) ou `'gold'` (destaque). `BASE_SX` define o
  tamanho/tipografia compactos padrão (o padding pode ser sobrescrito por `sx`).

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
