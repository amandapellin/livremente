# `src/components/profile` — edição de perfil

Blocos da tela de perfil (`/perfil`, RF03/RF04/RF26 + LGPD). A coluna esquerda é um
formulário único (`useProfileForm`) com um só "Salvar alterações"; a direita traz
seções *self-contained* com seus próprios hooks.

## Formulário único (coluna esquerda)

- **`identity-section/` → `IdentitySection`** — "Identificação": nome editável,
  e-mail **somente leitura** (trocar e-mail exigiria confirmação) e avatar (enviar
  imagem PNG/JPG ≤2 MB ou voltar às iniciais). A validação de tipo/tamanho fica no
  hook; o `onFileChange` zera o `input` para permitir reescolher o mesmo arquivo.
  A interface `IdentitySectionAvatar` descreve o contrato do avatar
  (src/displayName/error/pick/useInitials/canRemove). Helper: `initialsFromName`.
- **`password-section/` → `PasswordSection`** — "Senha" (opcional: em branco,
  mantém a atual). Os três campos vêm de `fields`; a submissão é do botão único da
  página (`PATCH /api/users/me/password`).

## Dados e privacidade (LGPD) — `privacy-section/`

- **`privacy-section/` → `PrivacySection`** — "Dados e privacidade": exportar dados
  (`useDataExport`), rever consentimento e excluir conta, com *toast* de resultado.
  Helper: `formatDate`.
  - **`consent-dialog/` → `ConsentDialog`** — mostra os termos e permite alternar o
    consentimento **opcional** (avisos); o obrigatório aparece como concedido
    (somente leitura). Estado local `marketing` (`null` = segue o valor carregado;
    ao mexer, assume o valor local).
  - **`delete-account-dialog/` → `DeleteAccountDialog`** — exclusão **irreversível**
    (`useDeleteAccount`); exige digitar o próprio e-mail para habilitar a
    confirmação. `REMOVED_ITEMS` lista o que será apagado.

## Leitor e preferências (coluna direita)

- **`reader-section/` → `ReaderSection`** — "Leitor e interface" (RF26): tema padrão
  do leitor (`READING_MODES`) e dois toggles (retomar na última página, salvar
  dicionário). Persistido no back-end com cache local via `useReaderPreferences`,
  aplicado na hora (fora do "Salvar alterações"). `ToggleRow` é a linha de toggle
  (título + subtítulo) interna.
- **`reading-preferences-section/` → `ReadingPreferencesSection`** — "Preferências
  de leitura" (RF04): reusa `PreferencesFields` dentro do próprio `FormProvider` e
  salva com botão próprio (`useProfilePreferences`).
