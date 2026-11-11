# `src/pages` — páginas (rotas)

Componentes de página (`export default function XPage()`), carregados *lazy* pelo
roteador (ver `docs/routes.md`). A lógica fica nos hooks correspondentes; a página
cuida de layout e estados de carregando/erro/vazio.

- **`landing/` → `LandingPage`** — `/`. Hero + três `FeatureCard` (acervo, leitura
  ativa, sincronização).
- **`login/` → `LoginPage`** — `/login`. `LoginHero` + `LoginForm` (via
  `useLoginForm`). Lê `?confirmed=1|invalid` do redirect de confirmação de e-mail e
  exibe um *toast* (`confirmedFeedback`); o efeito só limpa o parâmetro da URL (o
  feedback é derivado na montagem, por *lazy initializer*).
- **`register/` → `CadastroPage`** — `/cadastro`. *Wizard* (`Stepper` + 3 etapas) via
  `useRegisterForm`; ao concluir (`createdEmail`), mostra a tela de sucesso.
- **`profile/` → `PerfilPage`** — `/perfil`. Coluna esquerda: formulário único
  (`IdentitySection` + `PasswordSection` + "Salvar alterações" + `PrivacySection`),
  via `useProfileForm`. Coluna direita: `ReaderSection` e `ReadingPreferencesSection`
  (self-contained). *Toast* de sucesso.
- **`catalog/` → `CatalogoPage`** — `/catalogo`. Busca (campo com **debounce** via
  `useDebouncedValue` + submit), `CatalogFilters`, ordenação, alternância **lista ⇄
  grade** (`readStoredView`/localStorage, chave `livremente.catalog.view`), paginação
  e estados carregando/vazio/erro. `patch()` reseta a página ao mudar filtro.
- **`details/` → `DetalhesObraPage`** — `/obra/:id`. `PublicationHeader` +
  `SynopsisSection` + `MetadataAside` (via `usePublicationDetails`); 404 quando não
  existe. *(TODO: persistir estado na estante quando o épico existir.)*
- **`reader/` → `LeitorPage`** — `/leitura/:id`. **Dispatcher**: escolhe `PdfReader`
  (se `pdfFileUrl`) ou `EpubReader` (se `epubFileUrl`), cada um **keyado por obra**
  (`key={data.id}`, remonta ao trocar).
- **`shelf/` → `EstantePage`** — `/estante`. Placeholder (#27, RF05).
- **`recomendations/` → `RecomendacoesPage`** — `/recomendacoes`. Placeholder (#31,
  RF27).
- **`not-found/` → `NotFoundPage`** — `*`. 404 com link para o início.
