# `src/components/layout` — casca da aplicação (header/footer)

Cabeçalho, rodapé e menu de conta, montados pelo `App` em volta das rotas (o
header e o footer são ocultados em `/leitura/:id`, ver `docs/pages.md`).

- **`header/` → `Header`** — barra fixa: logo, navegação (`navItems`), busca,
  notificações, alternador de tema e, à direita, **conta ⇄ "Entrar"** conforme
  `useIsAuthenticated` (RF29). No mobile, um `Drawer` com os mesmos itens + perfil/
  sair. Internos:
  - `NavItemLink` — link de navegação do cabeçalho; o estado ativo usa a classe
    `.active` que o `NavLink` injeta na rota atual (azul de ação + borda inferior).
  - `NavDrawerItem` — equivalente para o `Drawer` mobile. O *cast*
    `as typeof ListItemButton` preserva a tipagem polimórfica (prop `component`) que
    o `styled()` perde, permitindo `component={NavLink}` com `to`/`end`.
  - `ColorModeToggle` — alterna claro/escuro via `useColorScheme` do MUI.
- **`account-menu/` → `AccountMenu`** — botão de conta (autenticado) com *popover*:
  identidade (avatar/nome/e-mail de `GET /api/users/me`), "Editar perfil" e "Sair"
  (`useLogout`). O perfil só é buscado quando o componente monta, ou seja, quando
  autenticado. Helper de módulo: `initialsFromName`.
- **`footer/` → `Footer`** — rodapé com marca, links institucionais
  (`footerLinks`) e assinatura.
