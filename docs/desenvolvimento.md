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
| #6 (integração) | RN01 — Confirmação | Leitura de `?confirmed=` no `/login` e exibição de *toast* (MUI Snackbar) |
| #8 | RF02 — Login | React Hook Form; *fetcher* com token e *refresh*; persistência de sessão |
