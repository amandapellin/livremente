<!--
Documento de apoio à redação do artigo (seção de Metodologia/Desenvolvimento).
Escopo: subtópico "3.1 Tecnologias Utilizadas", parte FRONT-END. A parte de
back-end é descrita no documento equivalente do repositório livremente_backend
(docs/desenvolvimento.md); no artigo, ambos compõem um único tópico 3.1.
Documento VIVO: a cada issue implementada, atualizar a subseção correspondente
e registrar a evolução no apêndice ao final.
-->

# 3. DESENVOLVIMENTO

Esta seção apresenta o aplicativo desenvolvido, sua interface e as tecnologias
empregadas. O presente documento detalha as tecnologias de **front-end** do
subtópico **3.1 Tecnologias Utilizadas**; a interface do aplicativo e o
repositório são descritos em material próprio, e as tecnologias de back-end no
documento correspondente do repositório do servidor.

## 3.1 Tecnologias Utilizadas (front-end)

O front-end do LivreMente é uma **aplicação de página única (SPA)** responsável
pela interface com que o usuário se cadastra, informa preferências, navega pelo
acervo (livros do Project Gutenberg e artigos do arXiv) e realiza a leitura. A
aplicação comunica-se com a API REST do projeto por meio de um contrato
**OpenAPI**, a partir do qual o cliente de acesso é gerado automaticamente. As
subseções descrevem cada tecnologia adotada e o modo como foi empregada.

### 3.1.1 Biblioteca de interface, linguagem e empacotador

A interface foi construída com a biblioteca **React** (versão 19), utilizando a
linguagem **TypeScript** para tipagem estática, o que reduz erros em tempo de
desenvolvimento. O empacotamento e o servidor de desenvolvimento são providos
pelo **Vite**, escolhido pela rapidez de recarga e pela simplicidade de
configuração. A organização do código segue uma separação por responsabilidade:
páginas (`pages/`), componentes reutilizáveis (`components/`), *hooks*
customizados (`hooks/`), esquemas de validação (`schemas/`) e utilitários
(`utils/`).

### 3.1.2 Sistema de componentes e tema visual

A composição visual utiliza a biblioteca de componentes **Material UI (MUI)**,
apoiada no motor de estilização **Emotion**. Um **tema** centraliza cores,
tipografia e *tokens* de design, garantindo consistência entre as telas; as
fontes são carregadas localmente via **Fontsource**. Componentes recorrentes —
como o *stepper* do cadastro e os grupos de seleção de preferências — foram
encapsulados como componentes próprios, priorizando reuso e acessibilidade.

### 3.1.3 Roteamento e navegação

A navegação entre telas (landing, cadastro, login, catálogo, detalhes, leitura,
estante, recomendações e perfil) é gerenciada pelo **React Router**, com
carregamento **sob demanda** das páginas (*lazy loading*), o que reduz o tamanho
inicial da aplicação.

### 3.1.4 Formulários e validação

O tratamento de formulários emprega o **React Hook Form**, e as regras de
validação são declaradas com a biblioteca **Zod**, integradas por um *resolver*.
Essa combinação permite validação por etapa (por exemplo, no cadastro em
múltiplas etapas), mensagens de erro por campo e verificação antes do envio,
mantendo a lógica de validação separada da apresentação.

### 3.1.5 Comunicação com a API e estado de servidor

As requisições à API e o gerenciamento do estado assíncrono (carregamento, erro,
cache) são feitos com o **TanStack Query**. Adotou-se a abordagem
*contract-first*: a partir do contrato **OpenAPI** publicado pelo back-end, a
ferramenta **orval** gera automaticamente os tipos, os *hooks* de requisição e os
esquemas de validação correspondentes, mantendo front-end e back-end alinhados e
reduzindo divergências de contrato. Sobre o cliente gerado há um *fetcher*
próprio, que centraliza o tratamento de respostas, a injeção do token de
autenticação e o tratamento uniforme de erros HTTP.

### 3.1.6 Autenticação no cliente

O fluxo de autenticação no navegador prevê o armazenamento do token de acesso e a
sua injeção automática nas requisições, além da renovação transparente por meio
de *refresh token* quando o token expira. Casos específicos de erro são tratados
de forma amigável — por exemplo, a sinalização de e-mail já cadastrado no
cadastro e a exibição do resultado da confirmação de e-mail na tela de login.

### 3.1.7 Qualidade de código e ferramentas de apoio

A padronização e a análise estática do código são asseguradas pelo **ESLint**
(com regras específicas para React e *hooks*) e pela verificação de tipos do
**TypeScript**. O gerenciador de pacotes é o **pnpm**. O versionamento utiliza
**Git** com hospedagem no **GitHub**, e o trabalho é acompanhado por *issues*
vinculadas a um quadro de projeto.

---

## Apêndice — Registro de evolução por issue

*Tabela de controle interno (não necessariamente parte do texto final do
artigo). A cada issue concluída, adicionar uma linha relacionando o requisito às
tecnologias empregadas.*

| Issue | Requisito | Tecnologias e aspectos de implementação |
|---|---|---|
| Setup | — | React 19, TypeScript, Vite, MUI, React Router, ESLint |
| Landing page | — | Componentização, tema/tokens, MUI |
| #5 | RF01 — Tela de cadastro | Cadastro em etapas (*stepper*), React Hook Form + Zod, cliente orval (`usePostApiAuthRegister`), tratamento de 409 |
| #6 | RF02 — Login | React Hook Form + Zod; *fetcher* com injeção do token de acesso |
| #6 (integração) | RN01 — Confirmação | Leitura de `?confirmed=` no `/login` e exibição de *toast* (MUI Snackbar) |
| #7 | RF02 — Persistência de sessão | *Refresh token* (armazenamento em local/sessionStorage) e renovação transparente no 401, centralizados no *fetcher* |
| #8 | RF03 — Edição de perfil | `GET`/`PUT /api/users/me`; pré-preenchimento via `values` do React Hook Form; TanStack Query; *toast* de sucesso e validação por campo. Estende-se à troca de senha (`PATCH /api/users/me/password`, com tratamento de 422) e ao avatar (`PUT`/`DELETE /api/users/me/avatar`, upload *multipart* com *preview*), num único salvar |
| #9 | RF04 — Preferências de leitura | Componente compartilhado (`PreferencesFields`) reusado no cadastro e no perfil; *chips* de multi-seleção; `GET`/`PUT /api/users/me/preferences` (contrato proposto pelo front) com conversão do array `categories` ⇄ livros/áreas |
| #10 | RF29 — Logout | Estado de sessão reativo (`useSyncExternalStore` + eventos no *storage*); *popover* de conta com "Editar perfil" e "Sair"; `POST /api/auth/logout` (contrato proposto pelo front, *best-effort*) com limpeza de sessão e redirecionamento à landing (RF28) |
| #11 | RF10 — Tela de busca/catálogo | Lista de publicações (`PublicationCard`), ordenação e **paginação numerada** (TanStack Query com `keepPreviousData`); estados de carregando/vazio/erro. `GET /api/catalog` proposto pelo front, com **mock trocável** (`USE_CATALOG_MOCK`) até o back-end existir |
| #12 | RF11 — Busca por palavra-chave | Campo de texto com busca **ao digitar (debounce via `useDebouncedValue`) e ao submeter**; resultados reativos ao termo |
| #13 | RF12 — Componentes de filtro | Filtros de tipo, idioma e gênero/área em componentes próprios, com **visibilidade condicional por tipo** (idioma/gênero só p/ livro; área só p/ artigo) combinando com a busca (o filtro de ano saiu do critério) |
| #14 | RF13 — Detalhes da obra/artigo | Metadados completos em `/obra/:id` (`GET /api/catalog/{id}`, contrato proposto pelo front + mock trocável); componentes decompostos (cabeçalho, sinopse, aside); ações "Ler agora" (→ Leitura) e "Adicionar à estante" como *dropdown* do enum `ReadingStatus` (→ Estante); estados carregando/404/erro |
| #16 | RF15 — Leitor de EPUB | Integração **epub.js** (`useEpubReader`) em `/leitura/:id`: render paginado do `epubFileUrl`, navegação página/capítulo (botões + teclado), **reflow** responsivo (RNF15) e capítulo/progresso; **modal de Configurações** (fonte incl. **OpenDyslexic**, tamanho, entrelinha, alinhamento, cor de página e tipo de página dupla/única/rolagem); rota sem header nem footer globais; UI decomposta em componentes (`reader-settings` e campos, `ReaderButton`) com tipos/constantes em `src/types` e `src/constants` |
| #17 | RF16 — Leitor de PDF | **Visualizador nativo do navegador** via `<iframe src={pdfFileUrl}>` no mesmo `/leitura/:id`, que vira **dispatcher** (PDF vs EPUB pelo arquivo disponível, leitor keyado por obra); scroll, zoom, navegação, miniaturas, busca e impressão vêm prontos do browser (RF16); topbar enxuta (voltar, título, “Abrir no {source}”). A tentativa com `pdfjs-dist` foi descartada por ficar aquém do nativo; contrato `pdfFileUrl` + `public/sample.pdf` para dev |
| — | LGPD — Dados e privacidade (perfil) | Bloco "Dados e privacidade" funcional: **exportar** dados (JSON compondo perfil+preferências+gêneros dos endpoints reais; portabilidade), **rever consentimento** (termos + data + alternar o opcional via `PUT /api/users/me/consent`) e **excluir conta** (`DELETE /api/users/me`, confirmação digitando o e-mail; limpa sessão e volta à landing); contrato proposto pelo front + mock trocável (`USE_PRIVACY_MOCK`) |
| #18 | RF26 — Seletor de tema do leitor | Seletor (claro/sépia/escuro) e aplicação imediata já vinham do #16 (campo "Cor de página" no modal); esta issue adiciona a **persistência** — o `useEpubReader` lê/grava o tema em `localStorage` (`reader:theme`, lazy initializer), então ao reabrir a leitura o tema é mantido sem flash |
| #19 | RF18 — Retomada automática de leitura | O `useEpubReader` salva a posição a cada `relocated` como **CFI** do epub.js e, ao abrir, retoma com `rendition.display(cfi)` (fallback para o início se inválido); respeita o toggle "retomar na última página" (`resumeAuto`); persistência por obra em `localStorage` (`reader:position:<id>`). Cross-device via endpoint de progresso proposto no back-end |
| #20 | RF19 — Indicador de percentual lido | O `useEpubReader` calcula o percentual via `book.locations.percentageFromCfi` tanto no `relocated` quanto assim que as *locations* são geradas (evita 0% travado no load) e o persiste por obra (`reader:percent:<id>`, EPUB only — PDF não exibe); a topbar mostra o percentual em **todas as larguras** (barra de `md`+). Junto: **responsividade da topbar** do leitor (gap/padding reduzidos, "Grifos e Anotações" oculto abaixo de `md`, "Configurações" só-ícone no mobile). Cross-device via o mesmo endpoint de progresso do back-end (CFI + percent) |
| #21 | RF20 — Contador de tempo de sessão | Hook compartilhado `useReadingSession` (EPUB e PDF) mede o **tempo de tela ativa** por *timestamps*, contando **só com a aba visível e focada**; *tick* de 1s **auto-reconciliável** (robusto a eventos de foco perdidos) + listeners `visibilitychange`/`blur`/`focus`/`pagehide`. *Flush* do **delta** a cada 30s, ao perder foco, no `pagehide` e ao sair da tela; acumula por obra em `localStorage` (`reader:time:<id>`) e envia ao back-end (`sendReadingTime`, *best-effort* com `keepalive`, atrás de flag até a rota existir). `SessionTimer` (relógio + `m:ss`) exibe a **sessão atual** na topbar, oculto no mobile. Contrato proposto: `POST /api/users/me/reading-progress/{id}/session` |
