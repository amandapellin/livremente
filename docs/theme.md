# `src/theme` — tema e tokens de design

## `tokens.ts` — tokens do design system (Figma)

Escalas tonais e valores de marca, como `const` (tipados literalmente com
`as const`).

- **`colors`** — paletas em escala 50–900:
  - `primary` — azul institucional (marca).
  - `acao` — azul de ação (links / chips selecionados).
  - `gold` — accent dourado; `goldContrast` (`#171A22`) é o texto sobre dourado.
  - `papel` — neutros.
  - `white`, `divider`.
  - `leitura.surfaceEscuro` (`#14161C`) — único token escuro do DS (superfície de
    leitura).
  - `error`, `info` (semânticos; `info` usa o azul de ação).
- **`fontFamilies`** — `heading` (Lora) e `body` (Lexend).
- **`radii`** — raios fora da escala base: `section` (6px, cards "outlined" do
  perfil) e `card` (12px, cards/caixas de destaque — cadastro, landing, LGPD).
- **`heroBackground`** — overlay azul institucional (primary 900 a 78%) sobre
  `/hero-landing.jpg`. Reutilizado na landing e no login.

## `theme.ts` — tema MUI

`createTheme` com **CSS variables** (`colorSchemeSelector: 'class'`) e os esquemas
**light** e **dark** derivados dos `tokens`. Também declara aumentos de tipos MUI
(módulos `@mui/material/*`): paletas extras `contrast`/`brand`/`acao`, cores de
`IconButton` `contrast`/`brand` e a variante `section` de `Paper`.

- **`theme`** (exportado) — consumido pelo `ThemeProvider`. Pontos relevantes:
  - **Paletas** light/dark (primary, secondary=gold, info, error, text, background,
    divider) + `contrast` (busca/notif/toggle), `brand` e `acao` (azul de ação).
  - **Tipografia** — headings em Lora, corpo em Lexend; escala h1–overline alinhada
    ao Figma.
  - **Overrides de componentes**:
    - `MuiPaper` variante **`section`** — card "outlined" (borda + `radii.section`),
      reutilizado nas telas (ex.: perfil).
    - `MuiIconButton` cores **`contrast`**/**`brand`** (fundo + hover por `filter`).
    - `MuiButton` — sem elevação, **pill** (`borderRadius: 999`), sem uppercase,
      padding `24px`/`10px` (botões altos por padrão; alguns lugares reduzem via
      `sx`).
    - `MuiStepIcon`/`MuiStepLabel` — ativo/concluído em azul de ação (stepper do
      cadastro).
    - `MuiAvatar` — 72×72, dourado com texto escuro (iniciais).
    - `MuiMenuItem` — padding/tipografia do menu de conta.

## `fonts.ts`

Importa os CSS do Fontsource (Lora 500/600; Lexend 400/500/600/700) — carrega as
fontes usadas pelo tema.
