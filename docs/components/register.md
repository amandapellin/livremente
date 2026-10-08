# `src/components/register` — etapas do cadastro

Etapas do *wizard* de cadastro (`/cadastro`, RF01), renderizadas pelo `Stepper`. A
orquestração (validação por etapa, payload, chamada à API) fica em
`useRegisterForm` (ver `docs/hooks.md`); cada etapa roda dentro do `FormProvider`
do cadastro.

- **`personal-data-step/` → `DadosStep`** — etapa 1: dados cadastrais exigidos pelo
  RF01 — nome, data de nascimento, gênero, e-mail e senha (com confirmação).
- **`preferences-step/` → `PreferenciasStep`** — etapa 2: preferências de leitura
  (RF04); o conteúdo é o componente compartilhado `PreferencesFields` (ver
  `docs/components/preferences.md`).
- **`lgpd-step/` → `LgpdStep`** — etapa 3: texto de consentimento (LGPD), aceite
  **obrigatório** do tratamento de dados (RN03), aceite **opcional** de avisos e o
  aviso de confirmação por e-mail.
