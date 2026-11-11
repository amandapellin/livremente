# `src/routes` — roteamento

## `router.tsx`

`createBrowserRouter` (React Router 8, Data Mode) com todas as rotas da SPA,
aninhadas sob o `App` (layout com header/footer).

- **`page(load)`** — helper que adapta um `import()` *default* para o formato
  `lazy` do React Router (carregamento sob demanda de cada página). Retorna uma
  função que resolve `{ Component }`.
- **`router`** — a árvore de rotas. A landing (`/`) é importada de forma estática
  (primeira tela); as demais são **lazy**:

  | Caminho | Página |
  |---|---|
  | `/` | `landing` |
  | `/login` | `login` |
  | `/cadastro` | `register` |
  | `/perfil` | `profile` |
  | `/catalogo` | `catalog` |
  | `/obra/:id` | `details` |
  | `/leitura/:id` | `reader` |
  | `/estante` | `shelf` |
  | `/recomendacoes` | `recomendations` |
  | `*` | `not-found` (404) |
