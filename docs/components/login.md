# `src/components/login` — tela de login

Componentes da tela de login (`/login`, RF02). A lógica (RHF+Zod, chamada à API,
tokens) fica em `useLoginForm` (ver `docs/hooks.md`).

- **`login-form/` → `LoginFormComponent`** — formulário controlado (e-mail, senha,
  "manter conectado"), erro de envio (`submitError`), botão "Entrar" e link para
  cadastro. O link "Esqueci a senha" ainda não tem fluxo (TODO: recuperação de
  senha, fora do escopo do RF02).
- **`login-hero/` → `LoginHero`** — painel de marca ao lado do formulário (só em
  telas médias ou maiores); reusa a imagem de fundo da landing (`heroBackground`)
  com estatísticas do acervo (`stats`).
