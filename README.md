# LivreMente — Frontend

Interface web do LivreMente, plataforma de leitura que integra livros em domínio público (Project Gutenberg, via Gutendex) e artigos científicos de acesso aberto (arXiv). Este repositório contém o frontend, em React + TypeScript.

Repositório do backend: [livremente_backend](https://github.com/amandapellin/livremente_backend)

## Tecnologias

- React + TypeScript
- [Vite](https://vitejs.dev/) como ferramenta de build e servidor de desenvolvimento
- [React Router](https://reactrouter.com/) — Declarative Mode (`BrowserRouter`, `Routes`, `Route`)
- [Material UI (MUI)](https://mui.com/) como biblioteca de componentes
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

Ajuste o valor caso a porta do backend local seja diferente, ou para a URL de produção quando o backend estiver hospedado no Azure.

## Rodando o projeto localmente

```bash
pnpm run dev
```

Por padrão, o Vite sobe em `http://localhost:5173`. É essa porta que já está liberada no CORS do backend — se o Vite subir numa porta diferente (por exemplo, se a 5173 já estiver em uso), avisem para ajustarmos a configuração de CORS do lado do backend também.

## Estrutura de páginas e rotas

**inserir a descrição conforme implementar**

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


