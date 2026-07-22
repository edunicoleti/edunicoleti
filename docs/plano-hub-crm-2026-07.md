# Análise do Hub edunicoleti.com.br + Plano de Implementação do CRM

> Documento de trabalho — jul/2026. Diagnóstico da plataforma como hub do negócio
> e plano de execução para (1) corrigir dívidas estruturais e (2) implementar um CRM
> conectado ao sistema de propostas.

---

## 0. Mapa atual do hub

Uma única SPA React (Vite), buildada no GitHub Actions e publicada por rsync na
Hostinger. Tudo mora no mesmo repositório e no mesmo bundle.

| Rota | O que é | Auth | Indexável | Dados |
|------|---------|------|-----------|-------|
| `/` | Site público / portfólio | — | sim | estático (JSX) |
| `/mentoria` | LP de venda da mentoria | — | sim | estático (JSX) |
| `/proposta/:slug` | Proposta do cliente | **nenhuma** | **sim** | `src/data/propostas.ts` (bundle) |
| `/proposta/:slug/pdf` | Versão PDF | **nenhuma** | sim | idem |
| `/propostas` | Painel de propostas | **nenhuma** | **sim** | idem |
| `/financeiro` | Painel financeiro pessoal | Supabase Auth | não (noindex) | Supabase (nuvem) |

**Canais de lead hoje:** exclusivamente WhatsApp (`wa.me/5549999531382`) e e-mail.
Não existe formulário, captura, nem registro de lead em lugar nenhum. Cada lead é
uma conversa manual que não deixa rastro — **este é o buraco que o CRM preenche.**

**Fato técnico importante:** o financeiro já provou o caminho de dados na nuvem —
Supabase com um `StorageAdapter` limpo (`src/financeiro/storage.ts`), Auth de conta
única e RLS. O CRM deve **reusar o mesmo projeto Supabase e o mesmo padrão**, não
reinventar.

---

## PARTE 1 — Diagnóstico do hub (o que falta / o que arrumar)

Cada item tem prioridade: **P0** (fazer já — risco real), **P1** (importante),
**P2** (melhoria). Esforço em T (tamanho): P = pequeno, M = médio, G = grande.

### A. Segurança & Privacidade

**A1 · [P0 · T:M] Propostas de clientes são públicas e vazam entre si.**
`todasPropostas` é um array estático importado tanto por `Proposta.tsx` quanto por
`PropostaDashboard.tsx`. Consequências:
- Qualquer pessoa que abra **uma** proposta (`/proposta/preamar`) baixa no navegador
  os dados de **todos** os clientes — nome, empresa, escopo e **valores** — porque
  todos estão no mesmo módulo JS. Um cliente consegue ver a proposta e o preço do
  outro só abrindo o DevTools.
- `/propostas` lista tudo isso numa tela sem senha nenhuma. É "segurança por
  obscuridade" (URL não linkada), o que não é segurança.
- As rotas são indexáveis: o Google pode listar `/proposta/qualquer-coisa`.

Correção definitiva vem junto da migração para banco (Parte 2, Fase 0): cada slug
passa a buscar **só os próprios dados** via função no servidor. Correção imediata
(paliativa, enquanto não migra): mover `/propostas` para trás da mesma Auth do
financeiro e adicionar `noindex` nas rotas de proposta.

**A2 · [P1 · T:P] Sem `noindex`/`X-Robots` nas rotas de proposta.** Só o
`/financeiro` seta `noindex`. Propostas e o painel deveriam sair do índice do Google.

**A3 · [P1 · T:P] Sem cabeçalhos de segurança.** O `.htaccess` só tem regras de
rewrite. Faltam headers básicos servidos pela Hostinger: `X-Content-Type-Options`,
`X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Strict-Transport-Security`
e, idealmente, um `Content-Security-Policy` (hoje as fontes vêm do Google via `<link>`,
o CSP precisa contemplar isso). Baixo esforço, bom ganho.

**A4 · [P2 · T:P] `deploy-edunicoleti.zip` (472 KB) versionado no git.** Artefato de
build no repositório — provável resquício, incha o clone e é um vetor de vazamento
acidental. Remover do histórico e adicionar ao `.gitignore`.

**A5 · [P1 · T:P] RLS do financeiro é `authenticated_all`.** Correto para conta
única. Mas quando o CRM compartilhar o mesmo projeto Supabase, cada tabela nova
precisa de RLS própria — e a leitura pública de proposta exige um caminho separado
e controlado (ver Fase 0). Anotar como pré-requisito, não é bug hoje.

### B. SEO

**B1 · [P1 · T:P] Não existe `robots.txt` nem `sitemap.xml`.** Nenhum dos dois no
repo. Falta o básico para o Google rastrear bem e para você bloquear o que é privado.

**B2 · [P1 · T:M] Meta tags não mudam por rota.** É uma SPA client-side: `Home` e
`/mentoria` compartilham o **mesmo** `<title>`, `description` e `canonical` do
`index.html`. Efeitos:
- O preview de compartilhamento (WhatsApp, LinkedIn) da mentoria é idêntico ao da home.
- Crawlers sociais **não executam JS** — qualquer meta setada via React (como o
  financeiro faz) é invisível pra eles. Sem `og:image` definida, o card fica vazio.

**B3 · [P1 · T:M] Sem pré-renderização das rotas públicas.** Home e `/mentoria`
dependem de JS para renderizar conteúdo. O Google até processa JS, mas é mais lento
e frágil; e para social/WhatsApp o HTML servido precisa já conter as metas. Solução:
pré-render estático das rotas públicas no build (ex.: `vite-plugin-ssg`/prerender, ou
gerar um HTML por rota com as metas certas).

**B4 · [P2 · T:M] Sem dados estruturados (JSON-LD).** Faltam schemas
`Person`/`ProfessionalService` (com localização Chapecó/SC, ótimo para SEO local) e,
na mentoria, `Service` + `FAQPage`. Ajuda o Google a entender o negócio e habilita
rich results.

### C. Técnico / Confiabilidade / DX

**C1 · [P0 · T:M] Propostas hardcoded = fricção operacional e gargalo do CRM.**
Criar uma proposta hoje exige editar `propostas.ts`, commitar e esperar o deploy.
Isso não escala e impede qualquer fluxo de CRM. É a mesma raiz do A1. Resolver com
migração para banco + editor no navegador (Fase 0/2).

**C2 · [P1 · T:P] Sem rota catch-all (404).** `App.tsx` não tem `<Route path="*">`.
Uma URL desconhecida (ou um slug de proposta digitado errado) cai numa tela em branco.

**C3 · [P1 · T:P] CI só faz deploy, sem porta de qualidade.** O workflow builda e
publica direto no push pra `main`. Não roda `lint` nem `tsc --noEmit` como gate.
Além disso usa `npm install` em vez de `npm ci` (build não determinístico).
Adicionar um job de checagem antes do deploy.

**C4 · [P1 · T:P] Sem analytics / medição de conversão.** Não há GA4, Plausible nem
nada. Você não sabe quantas pessoas visitam a `/mentoria`, de onde vêm, nem o que
converte. Sem isso, otimizar a LP é chute. Sugiro algo leve e privacy-first
(Plausible/Umami) ou GA4.

**C5 · [P2 · T:M] Sem testes.** Nenhuma cobertura. Não é urgente para um portfólio,
mas quando o CRM guardar dados reais de leads, ao menos os utilitários de dados
(datas, dinheiro, transições de funil) merecem teste.

**C6 · [P2 · T:P] Fontes carregadas do Google externamente.** `index.html` puxa
Inter/Fraunces/JetBrains do `fonts.googleapis.com`. Custa uma conexão externa e um
pouco de privacidade; self-host melhora performance e fecha o CSP. Opcional.

### D. Resumo de prioridades da Parte 1

| # | Item | Prio | T |
|---|------|------|---|
| A1 | Vazamento de propostas entre clientes | P0 | M |
| C1 | Propostas hardcoded (gargalo do CRM) | P0 | M |
| A2 | noindex nas propostas | P1 | P |
| A3 | Cabeçalhos de segurança | P1 | P |
| A5 | RLS por tabela ao compartilhar Supabase | P1 | P |
| B1 | robots.txt + sitemap.xml | P1 | P |
| B2 | Meta por rota | P1 | M |
| B3 | Pré-render das rotas públicas | P1 | M |
| C2 | Rota 404 | P1 | P |
| C3 | Gate de qualidade no CI + `npm ci` | P1 | P |
| C4 | Analytics | P1 | P |
| A4 | Remover zip do git | P2 | P |
| B4 | JSON-LD | P2 | M |
| C5 | Testes dos utilitários de dados | P2 | M |
| C6 | Self-host de fontes | P2 | P |

---

## PARTE 2 — CRM conectado às propostas

### Objetivo

Sair do "leads soltos no WhatsApp" para um funil organizado: registrar cada lead,
saber em que etapa está, agendar follow-up, e **gerar a proposta a partir do lead**
com um clique — reaproveitando o sistema de propostas que já funciona.

### Princípios de design

1. **Reusar, não reinventar.** Mesmo projeto Supabase do financeiro, mesma Auth de
   conta única, mesmo padrão `StorageAdapter`, mesmo design system (tokens em
   `src/index.css`, Fraunces/Inter, azul).
2. **O banco vira a fonte da verdade das propostas** (resolve A1 e C1 de uma vez).
3. **Conta única, dados privados.** `/crm` protegido e `noindex`, como o financeiro.
4. **Leitura pública de proposta é um caminho controlado** — nunca RLS aberta na
   tabela.

### Modelo de dados (novas tabelas Supabase `crm_*`)

```
crm_leads
  id            uuid pk
  nome          text
  empresa       text
  email         text
  telefone      text
  origem        text        -- 'whatsapp' | 'site' | 'mentoria' | 'indicacao' | ...
  valor_est     bigint      -- estimativa em centavos
  stage         text        -- FK lógica para o funil (ver abaixo)
  notas         text
  created_at    timestamptz default now()
  updated_at    timestamptz

crm_activities              -- timeline do lead (follow-ups, notas, eventos)
  id            uuid pk
  lead_id       uuid fk -> crm_leads
  tipo          text        -- 'nota' | 'ligacao' | 'whatsapp' | 'reuniao' | 'proposta_enviada' | 'proposta_vista'
  descricao     text
  due_at        timestamptz -- p/ follow-up agendado (opcional)
  done          boolean default false
  created_at    timestamptz default now()

crm_proposals              -- migração das propostas estáticas para o banco
  id            uuid pk
  lead_id       uuid fk -> crm_leads (nullable p/ propostas avulsas)
  slug          text unique
  token         text unique -- aleatório, não sequencial (privacidade do link)
  status        text        -- 'rascunho' | 'enviada' | 'vista' | 'aceita' | 'recusada'
  data          jsonb       -- o PropostaData atual, serializado
  first_seen_at timestamptz -- 1º acesso do cliente ao link
  created_at    timestamptz default now()
  updated_at    timestamptz
```

**Funil (stages) sugerido** — começar com estágios fixos (enum), evoluir para
configurável só se precisar:

`Novo → Contato feito → Briefing → Proposta enviada → Negociação → Ganho / Perdido`

Cada card carrega `valor_est`; o board soma por coluna (valor em cada etapa do funil).

### Segurança do modelo (o ponto técnico central)

- **Tabelas `crm_leads`/`crm_activities`/`crm_proposals`**: RLS `authenticated_all`
  (só você logado lê/escreve) — igual ao financeiro.
- **Leitura pública da proposta pelo cliente** (sem login): NÃO abrir SELECT anon na
  tabela (repetiria o vazamento do A1, só que no servidor). Em vez disso, uma
  **função `security definer` / RPC** `get_proposta(slug, token)` que devolve **uma
  única** proposta quando o token bate, com a tabela negada ao papel `anon`. O
  backlog do financeiro já prevê Edge Functions, então a infra encaixa.
- **Captura de lead por formulário público** (Fase 3): política RLS de **INSERT-only**
  para `anon` em `crm_leads` (o site cria o lead, mas ninguém anônimo consegue LER a
  base). Padrão clássico de formulário de contato no Supabase.

### Telas / UX

- **`/crm`** — board Kanban do funil (colunas = stages, cards = leads, arrastar entre
  colunas muda o `stage`). Cabeçalho com total por coluna. Alternância lista/board.
- **Detalhe do lead** (drawer/painel) — dados de contato, timeline de `crm_activities`,
  botão **"Gerar proposta"**, agendar follow-up, mudar estágio.
- **Editor de proposta no navegador** — formulário que escreve em `crm_proposals`
  (substitui editar `propostas.ts` na mão). Botões: salvar rascunho, publicar (gera
  slug+token), copiar link.
- **Fila de follow-ups** — lista das `crm_activities` com `due_at` vencendo (reusa a
  lógica de "atrasado" que o financeiro já tem em `alerts.ts`).

### Integração proposta ↔ lead (o que amarra tudo)

1. No card do lead, **"Gerar proposta"** cria um `crm_proposals` **pré-preenchido**
   com nome/empresa/contato do lead.
2. Publicar gera `slug` + `token`; o link vira `/proposta/:slug?t=:token`.
3. `Proposta.tsx` passa a buscar via `get_proposta(slug, token)` em vez do array
   estático.
4. O 1º acesso do cliente grava `first_seen_at` e dispara uma `crm_activity`
   `proposta_vista` → opcionalmente **move o lead** de "Proposta enviada" para
   "Negociação" automaticamente. Você passa a saber se o cliente **abriu** a proposta.

---

## PARTE 3 — Sequenciamento (fases de execução)

Ordenado por dependência e valor. Cada fase é entregável sozinha.

### Fase 0 — Fundação de dados + tapar o vazamento  *(resolve A1, C1, A2)*
Pré-requisito de tudo e já entrega segurança.
- Criar `crm_proposals` no Supabase + RPC `get_proposta(slug, token)`.
- Migrar as 3 propostas de `propostas.ts` para o banco.
- `Proposta.tsx`/`PropostaPDF.tsx` leem do banco por slug+token.
- `/propostas` e `/proposta/*` ganham `noindex`; `/propostas` vai para trás da Auth.
- **Resultado:** cliente nunca mais vê dados de outro; criar proposta deixa de exigir
  deploy.

### Fase 1 — CRM core  *(o funil)*
- Tabelas `crm_leads` + `crm_activities` com RLS.
- Rota `/crm` protegida (mesma Auth), board Kanban, CRUD manual de lead, timeline,
  follow-ups.
- **Resultado:** todo lead do WhatsApp passa a ser registrado e acompanhado num funil.

### Fase 2 — Amarração proposta ↔ lead
- Botão "Gerar proposta" no lead → editor no navegador → publica.
- Status da proposta (rascunho/enviada/vista/aceita/recusada) reflete no card do lead.
- Rastreio de "proposta vista" movendo o lead no funil.
- **Resultado:** do primeiro contato ao envio da proposta, tudo num lugar só.

### Fase 3 — Captura automática de leads
- Formulário no site (e na `/mentoria`) grava direto em `crm_leads` (RLS insert-only),
  com `origem` marcada — o lead cai no funil sem digitação manual.
- Botões de WhatsApp podem apontar para um passo que também registre a origem.
- Ligar o analytics (C4) para cruzar origem × conversão.
- **Resultado:** o hub deixa de perder lead e você mede o que converte.

### Fase 4 — Higiene do hub (paralela, encaixa quando der)
Itens da Parte 1 que não bloqueiam o CRM: `robots.txt`+`sitemap` (B1), meta por rota
+ pré-render (B2/B3), JSON-LD (B4), headers de segurança (A3), 404 (C2), gate de CI +
`npm ci` (C3), remover o zip (A4), self-host de fontes (C6).

### Fase 5 (opcional) — Automação / IA
Compartilha a mesma Edge Function + conta Anthropic já prevista no backlog do
financeiro: resumo automático do lead, sugestão de follow-up, rascunho de proposta a
partir de notas do briefing, alertas de lead parado.

---

## Ciclo 1 — escopo definido (jul/2026)

Decisão do Eduardo: **Fase 0 + Fase 1 + quick wins da Fase 4**. Analytics (C4) fica
para um ciclo posterior.

### Tarefas do Ciclo 1 (ordenadas)

**Bloco A — Quick wins de higiene (seguros, sem Supabase, começar por aqui)**
- [ ] `public/robots.txt` (permitir Home/mentoria, bloquear `/financeiro`, `/crm`, `/proposta*`) + `sitemap.xml` das rotas públicas.  *(B1)*
- [ ] `noindex` client-side nas rotas `/proposta/*` e `/propostas` (mesmo padrão do `Financeiro.tsx`).  *(A2)*
- [ ] Rota catch-all `<Route path="*">` com página 404.  *(C2)*
- [ ] Cabeçalhos de segurança no `.htaccess` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS; CSP contemplando fontes do Google).  *(A3)*
- [ ] CI: job de `lint` + `tsc --noEmit` como gate antes do deploy; trocar `npm install` por `npm ci`.  *(C3)*
- [ ] Remover `deploy-edunicoleti.zip` do repo + `.gitignore` (limpeza de histórico é destrutiva — combinar antes).  *(A4)*

**Bloco B — Fase 0: fundação de dados (precisa de ação no Supabase)**
- [ ] **[ação do Eduardo]** Rodar no Supabase o SQL de criação da tabela `crm_proposals`, RLS negando `anon`, e a RPC `security definer` `get_proposta(slug, token)`. Eu entrego o SQL pronto.
- [ ] Adaptador de propostas (cloud/local) no mesmo molde do `financeiro/storage.ts`.
- [ ] Script/rotina de migração das 3 propostas de `propostas.ts` para `crm_proposals` (com `token` gerado).
- [ ] `Proposta.tsx` / `PropostaPDF.tsx` passam a ler via `get_proposta(slug, token)`; link vira `/proposta/:slug?t=:token`.
- [ ] `/propostas` (dashboard) atrás da Auth existente + lê do banco.

**Bloco C — Fase 1: CRM core (precisa de ação no Supabase)**
- [ ] **[ação do Eduardo]** SQL das tabelas `crm_leads` + `crm_activities` com RLS `authenticated_all`. Entrego pronto.
- [ ] Rota `/crm` protegida (reusa `supabase.ts`/LockScreen do financeiro) + `noindex`.
- [ ] Board Kanban do funil (Novo → … → Ganho/Perdido), soma de valor por coluna.
- [ ] CRUD de lead + timeline de atividades + follow-ups (reusa a lógica de "atrasado" de `alerts.ts`).

> **Nota de dependência:** os Blocos B e C só funcionam ponta a ponta depois que o
> Eduardo rodar o SQL correspondente no painel do Supabase (`agcfjutjukuaqomtmxhd`).
> O Bloco A é 100% local e pode ser feito e mergeado antes, sem depender de nada.

### Fora do Ciclo 1 (backlog)
Analytics (C4), pré-render + meta por rota (B2/B3), JSON-LD (B4), self-host de fontes
(C6), testes (C5), Fases 2/3/5 do CRM.

---

## Ciclo 1 — IMPLEMENTADO (jul/2026)

Todo o código do Ciclo 1 foi escrito, passou em `tsc`, `eslint` e `vite build`, e o
que dá para testar sem Supabase foi verificado no navegador (404, robots, CRM em modo
local: criar lead → mover no funil → drawer → atividade na timeline).

**Falta só 1 ação sua:** rodar `docs/ciclo1-supabase.sql` no SQL Editor do Supabase
(projeto `agcfjutjukuaqomtmxhd`). **Nenhum secret novo** — o CRM e as propostas reusam
o `financeiro/supabase.ts` e as mesmas `VITE_SUPABASE_*` que já estão no GitHub Actions.

### O que entrou
- **Bloco A (higiene):** `public/robots.txt`, `public/sitemap.xml`, `noindex` nas
  rotas privadas (hook `src/hooks/useNoindex.ts`), rota 404 (`src/pages/NotFound.tsx`),
  cabeçalhos de segurança + CSP + X-Robots no `public/.htaccess`, gate de `lint` +
  `tsc` no CI com `npm ci`, e remoção do `deploy-edunicoleti.zip`.
- **Bloco B (propostas no banco):** `src/data/propostaStore.ts` (leitura pública via
  RPC), `Proposta.tsx`/`PropostaPDF.tsx` assíncronos, `/propostas` atrás do novo
  `AuthGate` compartilhado, com criação (JSON) e exclusão. `propostas.ts` foi
  esvaziado — dados dos clientes saíram do bundle (o chunk caiu para 0,03 kB).
- **Bloco C (CRM):** `src/crm/` (types, storage local/nuvem, store) e `src/pages/Crm.tsx`
  — board Kanban dos 7 estágios, cards arrastáveis, drawer com contato/funil/timeline,
  follow-ups com destaque de vencido, e **"Gerar proposta"** que já cria a proposta a
  partir do lead (amarração mínima da Fase 2 antecipada).

### Decisões de implementação (divergências do plano acima)
- **Leitura pública por slug, não por token na URL.** O plano previa `?t=token`, mas os
  links já enviados aos clientes (`/proposta/preamar`) quebrariam. A RPC
  `get_proposta_publica(slug)` devolve UMA proposta por slug — já elimina o vazamento
  entre clientes (o bundle não carrega mais dado nenhum) e mantém os links vivos. A
  coluna `token` fica criada para endurecer o acesso no futuro, quando reenviar links.
- **CSP ativa com `'unsafe-inline'`** (o app usa estilos inline e um `onload` inline de
  fonte). Faça um smoke-test após o deploy: fontes carregando e `/financeiro`
  sincronizando. Se algo quebrar, remova a linha do CSP no `.htaccess` e redeploie.
- **Criar proposta via JSON** no `/propostas` (bridge até o editor visual da Fase 2).
```
