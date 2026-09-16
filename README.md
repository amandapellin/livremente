# LivreMente — Frontend

Interface web do LivreMente, plataforma de leitura que integra livros em domínio público (Project Gutenberg, via Gutendex) e artigos científicos de acesso aberto (arXiv). Este repositório contém o frontend, em React + TypeScript.

Repositório do backend: [livremente_backend](https://github.com/amandapellin/livremente_backend)

## Tecnologias

- React + TypeScript
- [Vite](https://vitejs.dev/) como ferramenta de build e servidor de desenvolvimento
- [React Router](https://reactrouter.com/) — Data Mode (`createBrowserRouter`, `RouterProvider`)
- [Material UI (MUI)](https://mui.com/) como biblioteca de componentes
- [TanStack Query](https://tanstack.com/query) para data-fetching, com cliente HTTP gerado do OpenAPI via [orval](https://orval.dev/) + validação [Zod](https://zod.dev/)
- [pnpm](https://pnpm.io/) como gerenciador de pacotes

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [pnpm](https://pnpm.io/installation) instalado globalmente (`npm i -g pnpm`)
- O backend ([livremente_backend](https://github.com/amandapellin/livremente_backend)) rodando localmente, para que as chamadas à API funcionem

## Instalação

```bash
pnpm install
```

## Configuração da API

O frontend consome a API do backend através de uma variável de ambiente, em vez de uma URL fixa no código.

1. Crie um arquivo `.env` na raiz do projeto (esse arquivo não é versionado — veja o `.gitignore`): VITE_API_URL=http://localhost:5091

2. No código, o valor é acessado via `import.meta.env.VITE_API_URL`, nunca digitado diretamente numa chamada `fetch`.

Ajuste o valor caso a porta do backend local seja diferente, ou para a URL de produção quando o backend estiver hospedado no Azure. Use `.env.example` como referência.

### Cliente HTTP gerado a partir do OpenAPI

O cliente é **gerado** com [orval](https://orval.dev/) a partir do contrato OpenAPI do backend, produzindo de uma vez: tipos TypeScript, schemas [Zod](https://zod.dev/) (validação em runtime) e hooks do [TanStack Query](https://tanstack.com/query). A configuração está em `orval.config.ts`.

- **Contrato:** um snapshot versionado em `src/api/openapi.json` (fonte da geração).
- **Gerar:** `pnpm gen:api` — escreve em `src/api/generated/` (código gerado, commitado; não editar à mão).
- **Cliente:** as chamadas usam `fetch` através de `src/api/fetcher.ts`, que prefixa a `VITE_API_URL` e é o ponto único para, no futuro, injetar o token JWT.

Para **atualizar o contrato** quando o backend mudar, com o backend rodando (perfil `http`):

```bash
curl http://localhost:5091/swagger/v1/swagger.json -o src/api/openapi.json
pnpm gen:api
```

## Rodando o projeto localmente

```bash
pnpm run dev
```

Por padrão, o Vite sobe em `http://localhost:5173`. É essa porta que já está liberada no CORS do backend — se o Vite subir numa porta diferente (por exemplo, se a 5173 já estiver em uso), avisem para ajustarmos a configuração de CORS do lado do backend também.

## Estrutura de páginas e rotas

O roteamento usa o **Data Mode** do React Router: as rotas são declaradas num manifest central (`src/routes/router.tsx`, via `createBrowserRouter`) e injetadas em `src/main.tsx` com `<RouterProvider>`. A rota `/` usa `src/App.tsx` como layout raiz (renderiza um `<Outlet />`), e cada tela vive em `src/pages/` como uma rota filha.

| Caminho | Página | Descrição |
|---|---|---|
| `/` | `LandingPage` | Página inicial |
| `/login` | `LoginPage` | Login |
| `/cadastro` | `CadastroPage` | Cadastro de usuário |
| `/perfil` | `PerfilPage` | Edição de perfil |
| `/catalogo` | `CatalogoPage` | Busca/catálogo de obras |
| `/obra/:id` | `DetalhesObraPage` | Detalhes de uma obra/artigo |
| `/leitura/:id` | `LeitorPage` | Leitor (EPUB/PDF) |
| `/estante` | `EstantePage` | Minha Estante |
| `/recomendacoes` | `RecomendacoesPage` | Recomendações personalizadas |
| `*` | `NotFoundPage` | 404 — rota não encontrada |

> As telas são placeholders nesta fase; cada uma será implementada na issue correspondente. O header/navegação definitivo e a alternância de tema entram no layout base (issue #3).

## Design system

As definições de cores, tipografia, espaçamento e o mapeamento dos tokens para os componentes do MUI estão documentadas no figma. Antes de estilizar uma tela nova, conferir esse arquivo — em especial a regra de uso de cor por modo (claro/escuro), que já foi validada por contraste (WCAG AA).

## Fluxo de contribuição

- Branches: `feature/rfXX-descricao-curta` (código do requisito + descrição curta)
- Pull requests devem referenciar a issue correspondente (`Closes #N`) e passar por revisão da outra desenvolvedora antes do merge
- Board de acompanhamento: [Project "Livremente"](https://github.com/users/amandapellin/projects/1)

## Padrão de commits

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/), adaptado aos épicos já documentados no board do projeto.

### Formato

tipo(escopo): descrição curta no imperativo
Corpo opcional explicando o porquê, não o quê.


`Refs: RFxx, RNxx` e `Closes #N` são opcionais, incluídos apenas quando ajudam a rastrear a mudança até o requisito ou fechar a issue automaticamente.

### Tipos utilizados

| Tipo | Quando usar |
|---|---|
| `feat` | Implementação de uma nova funcionalidade |
| `fix` | Correção de um bug |
| `docs` | Mudança em documentação (README, comentários) |
| `refactor` | Reorganização de código sem mudar comportamento |
| `test` | Criação ou ajuste de testes |
| `chore` | Configuração, dependências, tarefas de manutenção |

### Escopo

O escopo reflete o épico ao qual a mudança pertence: `auth`, `catalog`, `reading`, `shelf`, `recommendation` ou `setup`.

### Regras práticas

- **Um commit, uma mudança lógica.** Evite misturar funcionalidades diferentes num único commit.
- **Imperativo, não passado.** Use `adiciona tela`, não `adicionado` ou `adicionei`.
- **Se usar `Closes #N`**, inclua apenas no commit que efetivamente fecha a issue — em branches com vários commits, evite repetir em todos.

### Exemplos

feat(auth): implementa tela de cadastro

fix(reading): corrige seletor de tema não persistindo entre sessões

chore(setup): configura estrutura inicial do projeto e roteamento


