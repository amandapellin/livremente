# `src/components/details` — detalhes da obra/artigo

Componentes da tela de detalhes (`/obra/:id`, RF13). Os dados vêm de
`usePublicationDetails` (`PublicationDetails`, ver `docs/hooks.md`); aqui ficam o
cabeçalho, a sinopse e a coluna lateral de metadados.

- **`publication-header/` → `PublicationHeader`** — cabeçalho: capa, título, autor,
  *meta* (ano, fonte, selo "Domínio público"), ações (`DetailActions`) e, quando a
  obra está na estante em um estado com progresso, o `ReadingProgressCard`. A
  constante `PROGRESS_STATUSES` (`read | reading | abandoned`) define em quais
  estados faz sentido mostrar o progresso (ou seja, exclui "quero ler").
- **`detail-actions/` → `DetailActions`** — barra de ações: **"Ler agora"**
  (→ `/leitura/:id`), **"Baixar epub"** (`downloadUrl`) e **"Adicionar à estante"**
  como *dropdown* de estado (`ReadingStatus`). `onSelectStatus` é o gancho do épico
  Estante (chamado ao escolher um estado).
- **`reading-progress-card/` → `ReadingProgressCard`** — card de progresso exibido
  no cabeçalho quando a obra está na estante em leitura/lido/abandonado: "% lido",
  posição (página/última sessão), barra e métricas (tempo de leitura, grifos,
  anotações, páginas marcadas — só as presentes). Helper de módulo: `formatMinutes`
  (minutos → `"1h 20min"`/`"20min"`).
- **`synopsis-section/` → `SynopsisSection`** — "Sinopse" com os parágrafos
  (quebrados por `\n\n`); não renderiza nada sem texto.

## Coluna de metadados (`metadata-aside/`)

- **`metadata-aside/` → `MetadataAside`** — agrega as seções abaixo num `Paper`.
  Cada seção se auto-oculta quando não há dado.
  - **`meta-section/` → `MetaSection`** — moldura comum (rótulo + conteúdo).
  - **`contributor-list/` → `ContributorList`** — responsáveis por papel
    (`roleLabels`: autoria/tradução/edição/ilustração), com contagem de autores.
  - **`subject-tags/` → `SubjectTags`** — *chips* de gêneros/assuntos (até 4 +
    "`+N assuntos`").
  - **`publication-facts/` → `PublicationFacts`** — fatos (ano, idioma, formato,
    fonte, direitos), filtrando os vazios.
  - **`shelf-state/` → `ShelfState`** — estado atual na estante (ponto colorido +
    rótulo, de `readingStatusMap`).
