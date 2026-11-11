# `src/components/catalog` — busca e listagem do catálogo

Componentes da tela de catálogo (RF10–RF12). A lógica de busca/estado fica em
`useCatalogSearch` (ver `docs/hooks.md`); aqui ficam a apresentação dos
resultados e a sidebar de filtros.

## Cards de publicação

- **`publication-card/` → `PublicationCard`** — card horizontal (modo lista): capa
  (`PublicationCover`), selo de tipo (`TypeBadge`), título, *meta* (autor · ano ·
  idioma · gênero, só os preenchidos), descrição com *clamp* de 2 linhas e ações
  (`PublicationActions`). `onAddToShelf` é opcional (gancho do épico Estante).
  - **`publication-cover/` → `PublicationCover`** — capa da obra; sem `coverUrl`
    mostra um *placeholder* com o título. A prop `variant` controla o formato:
    `'thumb'` = miniatura fixa (lista); `'full'` = largura total, proporção 2/3
    (grade).
  - **`type-badge/` → `TypeBadge`** — *chip* "Livro"/"Artigo" (+ formato) com as
    cores `gold` do DS.
  - **`publication-actions/` → `PublicationActions`** — coluna com "Detalhes"
    (→ `/obra/:id`) e "Estante".
- **`publication-grid-card/` → `PublicationGridCard`** — card compacto do modo
  **grade**: capa (largura total), selo, título e autor, empilhados. Reusa
  `PublicationCover`/`TypeBadge` do `publication-card`.

## Filtros (sidebar)

- **`catalog-filters/` → `CatalogFilters`** — painel "Filtros" com botão "Limpar".
  Decompõe-se por tipo de controle; a **visibilidade é condicional pelo tipo**
  escolhido: idioma só para livro, e gênero/área só quando há um tipo definido
  (`query.type !== ''`). Ao trocar o tipo, reseta gêneros e limpa idioma se não for
  livro.
  - **`filter-section/` → `FilterSection`** — moldura comum (rótulo + *helper*
    opcional) de cada bloco de filtro.
  - **`type-filter/` → `TypeFilter`** — tipo de publicação como "chips" clicáveis
    (acessíveis por teclado) com **contagem** por tipo (`CatalogCounts`).
  - **`language-filter/` → `LanguageFilter`** — idiomas por *checkbox* (só livro).
  - **`genre-filter/` → `GenreFilter`** — `Select` múltiplo de gêneros (livro) ou
    áreas de conhecimento (artigo); o rótulo e as opções vêm de
    `genreLabelFor`/`genreOptionsFor` (ver `docs/schemas.md`), e o *helper* explica
    o escopo de cada tipo.
