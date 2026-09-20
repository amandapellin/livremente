# Contexto do Projeto — LivreMente (front-end) — para agentes de IA

> Arquivo de contexto para qualquer agente de IA continuar a implementação do
> **front-end sem precisar de contexto adicional**. Documento **vivo**: atualize a
> seção "Status por issue" a cada issue concluída. Não contém segredos.

## 1. O que é o projeto

LivreMente é uma **plataforma web de leitura** que reúne livros de domínio público
(Project Gutenberg, via API Gutendex) e artigos científicos de acesso aberto
(arXiv). O usuário se cadastra, informa preferências e recebe recomendações; lê
obras e registra grifos, anotações e progresso.

Este repositório é o **front-end (SPA)**. A API REST fica em outro repositório,
integrada por contrato OpenAPI.

| Parte | Repositório | Caminho local | Branch padrão |
|---|---|---|---|
| Front-end (SPA) | `amandapellin/livremente` | `/home/amanda/WebstormProjects/livremente` | `develop` |
| Back-end (API REST) | `amandapellin/livremente_backend` | `/home/amanda/Documentos/livremente_backend` | `main` (integração em `develop`) |

Requisitos referenciados por código: **RFxx** (funcional), **RNxx** (regra de negócio).

## 2. Stack

React 19 · TypeScript · Vite 8 · Material UI (MUI 9) + Emotion · React Router 8 ·
React Hook Form 7 + Zod 4 (validação) · TanStack Query 5 (requisições/estado de
servidor) · **orval 8** (gera o cliente HTTP a partir do OpenAPI) · ESLint ·
**pnpm**.

## 3. Estrutura e convenções

- `src/pages/<nome>/index.tsx` — páginas (kebab-case), carregadas *lazy* pelo
  roteador (`src/routes/router.tsx`).
- `src/components/<area>/<componente>/index.tsx` — componentes reutilizáveis.
- `src/hooks/use*.ts` — lógica de tela (ex.: `useRegisterForm`, `useLoginForm`).
- `src/schemas/*.ts` — esquemas Zod e opções (ex.: `register-schemas`,
  `category-schemas`, `login-schemas`).
- `src/api/` — camada de acesso à API (ver seção 4).
- `src/theme/` — tema e *tokens* de design. `src/utils/` — utilitários.
- **Alias de import:** `@` → `/src` (ex.: `import X from '@/components/...'`).
- Formulários: **React Hook Form**; validação: **Zod** (via `@hookform/resolvers`).

## 4. Integração com a API (contract-first) — IMPORTANTE

- O cliente HTTP é **gerado** por orval em **`src/api/generated/`**
  (`endpoints.ts`, `endpoints.zod.ts`, `model/`). **Não edite arquivos gerados à
  mão.**
- Fonte da geração: o *snapshot* do contrato em **`src/api/openapi.json`**.
  Fluxo ao mudar o contrato do back-end: atualizar `src/api/openapi.json` →
  rodar **`pnpm gen:api`** (config em `orval.config.ts`) → o cliente é regerado.
- **`src/api/fetcher.ts`** (`customFetch`) envolve o cliente gerado: injeta o
  token JWT, intercepta **401 → refresh** automático, e lança **`HttpError`**
  (com `status` e `data`) para a UI tratar casos específicos (ex.: 409 no cadastro).
- **Base URL:** `import.meta.env.VITE_API_URL ?? ''`. Em dev, usa-se o **proxy do
  Vite**: `/api` → `http://localhost:5091` (configurado em `vite.config.ts`), então
  a base fica vazia (mesma origem, sem CORS). Alternativa: definir `VITE_API_URL`
  num `.env.local` para chamar o back-end diretamente.

## 5. Contrato front ↔ back (pontos que já causaram atrito)

- Cadastro: **`POST /api/auth/register`**. Campo de tipo de obra nas preferências:
  **`publications`** (não "materials"), valores **`book` / `scientific_article`**.
- Erros da API: `{ message, code }` (ex.: `code: "EMAIL_ALREADY_EXISTS"`).
- Confirmação de e-mail: o back-end **redireciona** para
  `/login?confirmed=1|invalid` — a tela de login lê esse parâmetro e exibe um
  *toast*.
- *Slugs* de categorias/gêneros/idiomas em `src/schemas/category-schemas.ts` são o
  contrato de vocabulário: **devem casar com as chaves do `PreferenceCatalog`** do
  back-end.

## 6. Execução e verificação

- Instalar: `pnpm install`. Rodar: **`pnpm dev`** (Vite em `http://localhost:5173`).
- Back-end em dev (para o proxy funcionar): rodar a API em
  `http://localhost:5091` (`dotnet run --urls http://localhost:5091` no repo do back).
- Verificações estáticas: **`pnpm lint`** e
  **`pnpm exec tsc -p tsconfig.app.json --noEmit`** (checagem de tipos).
- Build de produção: `pnpm build`. Em produção, definir `VITE_API_URL` para a URL
  pública da API.

## 7. Convenções de contribuição

- **Commits:** Conventional Commits em português, no imperativo (ex.:
  `feat(auth): implementa tela de login`).
- **Branches:** `feat/<n>-descricao` (n = número da issue).
- **PRs:** referenciam a issue (`Closes #n`).
- **Sem segredos** no versionamento; `.env.local` é ignorado pelo git.

## 8. Status por issue (ATUALIZAR A CADA ISSUE)

**Concluído (mergeado):**
- Landing page.
- **#5 (RF01) Tela de cadastro:** *wizard* de 3 etapas (Dados, Preferências, LGPD)
  com stepper, React Hook Form + Zod, envio via cliente orval, tratamento amigável
  de 409, tela de sucesso.
- **#6 (RN01, integração):** *toast* no `/login` lendo `?confirmed=1|invalid`.
- Tela de login (RF02) — base.

**Em andamento / próximas:**
- **#7 (RF02) Persistência de sessão** ("manter-se conectado" / refresh token) —
  branch atual `feat/7-persistencia-de-sessao`.
- Telas de catálogo, detalhes, leitura (reader), estante, recomendações, perfil.
- Perfil (RF03) consome `/api/users/me/...`; preferências (RF04).

## 9. Documentos relacionados

- `docs/desenvolvimento.md` — texto de metodologia do artigo (3.1, parte front), vivo.
- Contexto do back-end: `AGENTS.md` no repositório `livremente_backend`.
