# `src/components/preferences` — campos de preferências de leitura

Componentes compartilhados de preferências (RF04), usados tanto no **cadastro**
quanto no **perfil** via `FormProvider` do React Hook Form.

- **`preferences-fields/` → `PreferencesFields`** — campos de preferência: idioma,
  publicações (livro/artigo), categorias e gênero literário. Lê/grava via
  `useFormContext`; as seções de categorias e gênero aparecem conforme a publicação
  escolhida (`showBooks`/`showArticles`). Deve rodar dentro de um `FormProvider`
  cujo form satisfaça `PreferencesFormShape` — a interface que descreve os campos
  exigidos do form hospedeiro; tanto `CadastroForm` quanto `PreferencesValue` a
  satisfazem, o que permite reusar o componente. `Section` é a moldura interna
  (rótulo + conteúdo).
- **`chip-group/` → `ChipGroup`** — grupo de *chips* de múltipla seleção; cada chip
  alterna sua presença na lista `value`. O estado "selecionado" não é nativo do MUI
  `Chip`, então usa `SelectionChip`, um componente estilizado com um prop transiente
  `selected` (não encaminhado ao DOM via `shouldForwardProp`) e o azul de ação do
  DS. O seletor `&&` dobra a especificidade para vencer o `background-color` do
  variant `outlined` do `Chip` (que, por ordem de inserção, sobrescreveria o fundo
  do estado selecionado).
