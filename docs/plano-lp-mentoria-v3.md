# Plano LP Mentoria v3 — "Claude Code como sistema operacional da empresa"

> Documento de execução para nova sessão. Contém reposicionamento, copy completa nova,
> direção visual, plano de motion e fases de desenvolvimento com critérios de aceite.
> Página alvo: `/mentoria` ([src/pages/Mentoria.tsx](../src/pages/Mentoria.tsx) + Mentoria.css).

---

## 1. Contexto e diagnóstico da versão atual (v2)

A v2 (tema claro editorial, terminal animado, diff antes/depois) acertou na identidade visual,
mas a copy tem dois problemas apontados pelo Eduardo:

1. **Repetição do apelo "quem já usa Claude Code"** em hero, dores, FAQ e CTA. Vira muleta
   e soa como gatekeeping. O filtro de público deve acontecer UMA vez (no FAQ), não ser o tema da página.
2. **Genérica demais / sem autoridade pessoal.** O público real são pessoas que JÁ conhecem
   o Eduardo como profissional (grupos de negócio, JCI, Associações Comerciais, clientes e
   indicações da região). A página será compartilhada com mensagem tipo **"Agenda aberta"**.
   Quem clica não precisa ser convencido de que Eduardo existe; precisa entender a OFERTA
   e sentir que ela é maior do que o que já conhecem dele ("o cara dos sites" → "o cara que
   automatiza a gestão da empresa").

## 2. Reposicionamento de marca

### Big idea (o conceito único da página)

> **Claude Code como sistema operacional da empresa.**
> Eduardo analisa o contexto do negócio e implanta automações que assumem a gestão:
> relatórios, propostas, financeiro, follow-up. O empresário decide; o sistema roda.

Tudo na página serve a essa ideia. Nenhuma seção fala de "aprender ferramenta";
todas falam de **operação assumida pelo sistema**.

### Mudanças de posicionamento (v2 → v3)

| Dimensão | v2 | v3 |
|---|---|---|
| Premissa | "Você já usa Claude Code, vá além" | "Sua empresa pode rodar em Claude Code. Eu implanto." |
| Papel do Eduardo | Mentor que acelera | **Consultor que analisa, desenha e implanta** (mentoria é o método, consultoria é a entrega) |
| Filtro de público | Repetido na copy toda | Uma única resposta de FAQ ("Preciso já usar Claude Code? Não.") |
| Gatilho de conversão | "Diagnóstico gratuito" | **"Agenda aberta"** + escassez honesta (poucas vagas/mês, atendimento 1:1) |
| Prova | Stats genéricos (10+ anos, 50+ projetos) | **Projetos nomeados da região** + caso real: o sistema de propostas deste próprio site |
| Tom | Direto, punchy | Direto, punchy, **com voz de dono** ("eu analiso", "eu implanto", "eu te mostro") |

### Técnicas de posicionamento aplicadas

- **Category design**: não competir em "mentoria de IA" (commodity); criar a categoria
  "implantação de Claude Code como SO da empresa". O nome da categoria aparece no hero e no OG.
- **Autoridade demonstrada, não declarada**: o terminal animado e o diff mostram o produto;
  a seção do mentor mostra OBRAS (projetos nomeados), não adjetivos.
- **Prova de proximidade**: clientes da região (Preamar, Cristal Poços, Clínica Fonoaudiologia
  Avançada, Cardápios Um Livro Vivo) valem mais para esse público do que logos famosos:
  "ele atende gente como eu, aqui".
- **Dogfooding como prova máxima**: "o sistema de propostas que uso com meus clientes roda
  neste site e foi construído com Claude Code". Impossível de copiar, 100% verdadeiro.
- **Escassez estrutural (não artificial)**: atendimento 1:1 tem teto natural. "Agenda aberta"
  + "X vagas neste mês" é verdade operacional, não countdown fake.

## 3. Copy nova — completa, seção a seção

Regras de voz: primeira pessoa ("eu implanto"), frases curtas, zero jargão de IA na headline,
jargão técnico só como TEMPERO de credibilidade (mono, pequeno), sem travessões, sem
"quem já usa" fora do FAQ. Português direto de dono de negócio.

### 3.1 Nav
- Logo `edunicoleti.`
- Tag mono: `consultoria · claude code`
- Botão: `Reservar horário`

### 3.2 Hero
- **Eyebrow mono**: `AGENDA ABERTA · MENTORIA E CONSULTORIA 1:1`
- **Badge**: `● poucas vagas por mês` (verde, pulsando)
- **H1** (3 linhas, mesma estrutura cinética da v2):
  - Linha 1 (sans bold): `Sua empresa`
  - Linha 2 (sans bold): `rodando sozinha.`
  - Linha 3 (serif itálico terracota): `Claude Code como sistema operacional do negócio.`
  - *Alternativa se a linha 3 ficar longa no mobile:* `O sistema operacional da sua empresa.`
- **Sub**: `Eu entro no contexto do seu negócio, desenho a operação e implanto as automações: relatórios, propostas, financeiro e follow-ups rodando sem depender de você.`
- **CTA primário**: `Reservar horário na agenda →`
- **Nota mono**: `diagnóstico de 30 min · gratuito · via meet`
- **Terminal** (mantém, cenários levemente ajustados para gestão):
  1. `Feche o caixa de hoje e me mande o resumo` → `Conciliando extrato com contas a receber` / `2 pendências sinalizadas` / `Resumo enviado no WhatsApp`
  2. `Gere o relatório da semana pra reunião de segunda` → `Lendo planilha de vendas` / `Montando indicadores` / `PDF pronto no seu e-mail`
  3. `Prepare a proposta do cliente novo no nosso padrão` → `Buscando dados no CRM` / `Aplicando template da empresa` / `Proposta gerada em 4 min`

### 3.3 Barra de prova (NOVA, logo após o hero, no lugar da marquee ou junto dela)
Linha mono discreta com contagem + nomes reais:
`10+ anos em produtos digitais · projetos: Preamar Serviços Marítimos · Cristal Poços · Clínica Fonoaudiologia Avançada · Cardápios Um Livro Vivo`
(implementar como marquee lenta OU linha estática com scroll horizontal no mobile;
confirmar com Eduardo QUAIS projetos citar e se pode nomear publicamente)

### 3.4 Seção 01 — A tese: "o segundo turno"
- Kicker: `01 — o problema`
- H2: `Toda empresa tem um segundo turno invisível.`
- Corpo (curto, 2 parágrafos):
  `Depois do expediente, alguém ainda monta relatório, confere planilha, cobra retorno, formata proposta. Quase sempre esse alguém é o dono.`
  `Esse turno não aparece no organograma, mas consome as melhores horas de quem decide. É ele que eu elimino.`
- Lista editorial numerada (estilo v2, 4 itens, sem citar Claude Code):
  - 01 `O relatório de segunda que rouba o domingo.`
  - 02 `A proposta que só sai se você montar.`
  - 03 `O financeiro conferido linha por linha.`
  - 04 `O follow-up que depende da sua memória.`
- Fechamento serif: `Nada disso precisa mais de você.`

### 3.5 Seção 02 — O sistema (o que eu implanto)
- Kicker: `02 — o sistema`
- H2: `Um sistema operacional pra gestão inteira.`
- Sub: `Cada módulo é desenhado no seu contexto e implantado comigo, um a um.`
- Grid de 6 módulos (cards claros, ícone + título + 1 linha):
  1. **Relatórios e indicadores** — `Chegam prontos, no horário, sem ninguém pedir.`
  2. **Propostas e orçamentos** — `Geradas no padrão da empresa, em minutos.`
  3. **Financeiro** — `Conciliação automática, pendências sinalizadas.`
  4. **Atendimento e follow-up** — `Nenhum cliente esquecido na fila.`
  5. **Integrações** — `CRM, planilhas e ERP conversando entre si.`
  6. **Rotinas agendadas** — `O que é recorrente roda sozinho, todo dia.`

### 3.6 Seção 03 — O diff (mantém o formato, copy nova de gestão)
- Kicker: `03 — antes e depois`
- H2: `Da rotina manual à operação.`
- Card `sua-empresa.diff`:
  - `− Relatório montado à mão toda segunda` / `+ Chega pronto no e-mail, 07h00`
  - `− Proposta refeita a cada cliente` / `+ Gerada no padrão, em minutos`
  - `− Financeiro conferido planilha por planilha` / `+ Conciliação automática com alertas`
  - `− A operação depende de você` / `+ A operação roda. Você decide.`

### 3.7 Seção 04 — O método (mentoria + consultoria, sem escolher rótulo)
- Kicker: `04 — o método`
- H2: `Consultoria completa. Mentoria no processo.`
- Sub: `Eu não entrego um curso nem um sistema fechado. Analiso seu contexto, implanto com você e te deixo no comando.`
- 3 movimentos (mantém formato serif da v2):
  1. **Análise** — `Mergulho no seu negócio: processos, sistemas, gargalos. Saio com o mapa do que automatizar primeiro.`
  2. **Implantação** — `Construímos juntos, módulo a módulo, dentro da sua operação real. Cada sessão termina com algo rodando.`
  3. **Comando** — `Você aprende a operar e evoluir o sistema. A empresa fica com o ativo, não com a dependência.`

### 3.8 Seção 05 — Autoridade (reescrita, com obras)
- Kicker: `05 — quem implanta`
- Pull-quote serif grande: `“Eu não vendo a ferramenta. Eu construo a operação em cima dela.”`
- Bio (3 frases, com obras):
  `Sou Eduardo Nicoleti. Há mais de 10 anos desenho e desenvolvo produtos digitais para empresas da região, como Preamar, Cristal Poços, Clínica Fonoaudiologia Avançada e o Cardápios Um Livro Vivo.`
  `Minha própria operação roda em Claude Code: o sistema de propostas que meus clientes recebem foi construído com ele e está neste site, em produção.`
  `Sou empresário, membro da JCI e de Associações Comerciais. Conheço a rotina de quem decide porque vivo ela.`
- Meta mono: `10+ anos · 50+ projetos · operação própria em claude code`
- Link: `Ver LinkedIn ↗`
- **Slot para foto real** (substituir memoji quando Eduardo enviar; memoji é fallback)
- **Slot para 1–2 depoimentos** (coletar na Fase 0; se não houver, seção sai sem placeholder)

### 3.9 Seção 06 — Como funciona (passos, copy nova)
- Kicker: `06 — como funciona`
- H2: `Do primeiro papo à empresa rodando.`
- 4 passos:
  1. **Diagnóstico** — `30 min no Meet. Você me mostra a operação, eu já aponto onde o sistema entra.`
  2. **Mapa** — `Proposta com módulos priorizados, prazo e investimento. Preto no branco.`
  3. **Implantação 1:1** — `Sessões de trabalho na sua operação real. Nada de aula gravada.`
  4. **Acompanhamento** — `Canal direto comigo enquanto o sistema ganha corpo.`
- Nota: `Individual, online, agenda limitada.`

### 3.10 FAQ (reescrito; é AQUI que o filtro de público mora, uma vez só)
1. `Preciso já usar Claude Code?` — `Não. Se você já usa, eu profissionalizo o que começou. Se nunca abriu, eu implanto do zero. O ponto de partida muda, o destino não.`
2. `Serve pro meu ramo?` — `Se a sua gestão tem rotina repetitiva (relatório, proposta, cobrança, planilha), serve. O sistema é desenhado no seu contexto, não é pacote pronto.`
3. `Você faz por mim ou me ensina?` — `Os dois, nessa ordem. Implanto com você e te deixo operando sozinho. O ativo fica na empresa.`
4. `Em quanto tempo vejo resultado?` — `A primeira automação entra em produção nas primeiras sessões. O diagnóstico já sai com destravamento.`
5. `Quanto custa?` — `Depende do escopo do mapa. Apresento o investimento no diagnóstico, sem compromisso. O diagnóstico é gratuito.`
6. `O que preciso ter?` — `Uma assinatura do Claude com acesso ao Claude Code e acesso aos sistemas da sua empresa. Eu te oriento na configuração.`

### 3.11 CTA final (cartão escuro, mantém)
- Kicker: `agenda aberta`
- H2: `Poucas vagas. Atendimento é 1:1.` — *alternativa:* `Me conta como sua empresa roda hoje.`
- Sub: `Diagnóstico gratuito de 30 minutos. Se eu não enxergar ganho real, eu te falo na call.`
- Botões: `Reservar horário →` + `ou chama no WhatsApp ↗`
- Mensagem do WhatsApp atualizada: `Olá, Eduardo! Vi que a agenda está aberta e quero reservar um diagnóstico.`

### 3.12 SEO / OG
- Title: `Consultoria e Mentoria de Claude Code para Empresas | Eduardo Nicoleti`
- Description: `Claude Code como sistema operacional da sua empresa: eu analiso o contexto do negócio e implanto automações de gestão. Agenda aberta, diagnóstico gratuito.`

## 4. Direção visual v3 (evolução, não recomeço)

Manter a base v2 aprovada (papel `#F8F4EA`, tinta `#1C1913`, terracota `#9C4A22`,
Fraunces itálico, JetBrains Mono, cartões escuros pontuais). Elevar com:

1. **Escala tipográfica mais dramática**: H1 até `clamp(3rem, 10vw, 8.5rem)`; kickers menores;
   mais respiro entre seções (12rem desktop).
2. **Prova social como elemento gráfico**: nomes de clientes em mono correndo em marquee lenta
   OU fila estática com separadores ✦.
3. **Números que contam**: stats (10+, 50+) animando de 0 ao entrar no viewport.
4. **Progress bar de leitura** fina no topo (terracota), amarrada ao scroll.
5. **Fotografia real** do Eduardo na seção autoridade (pedir na Fase 0). Tratamento: P&B ou
   levemente quente, recorte editorial, nada de foto de banco.

## 5. Motion & microanimações de scroll

**Stack**: a lib `motion` (v12) JÁ está em package.json e não é usada. Usar `motion/react`:
`useScroll`, `useTransform`, `whileInView`, `useSpring`. Manter IntersectionObserver
só onde for mais simples. **Todas as animações com fallback `prefers-reduced-motion`**
(usar `useReducedMotion` do motion).

Mapa de motion por seção:

| Onde | Efeito | Técnica |
|---|---|---|
| Página toda | Progress bar de leitura no topo | `useScroll` + `scaleX` com `useSpring` |
| Hero | Stagger de entrada (já existe) + parallax sutil do terminal (desloca -40px no scroll) | `useTransform(scrollY)` |
| Marquee/prova | Velocidade constante, pausa em hover | CSS (manter) |
| Lista "segundo turno" | Itens entram com stagger + número muda de cor quando o item cruza o centro da viewport | `whileInView` + `useInView` margin `-45%` |
| Grid módulos | Cards sobem em stagger 60ms, ícone com micro-scale no hover | `whileInView` |
| Diff | Linhas `−`/`+` entram alternadas como se o diff estivesse sendo aplicado; sinal `+` pisca 1x | `whileInView` sequencial |
| Movimentos (método) | Números 01→03 com linha conectora que desenha (scaleY) conforme scroll | `useScroll` target na seção |
| Stats mentor | Count-up 0→10+, 0→50+ | `useMotionValue` + `animate` on view |
| Pull-quote | Máscara de revelação por linha (clip-path) | `whileInView` |
| FAQ | Abertura anima altura suave | CSS grid-template-rows 0fr→1fr |
| CTA final | Cartão escuro entra com scale 0.96→1 + glow que respira | `whileInView` + CSS |

**Orçamento de performance**: só `transform`/`opacity`/`clip-path`; nada de animar layout;
`will-change` pontual; testar em CPU 4x throttle.

## 6. Mobile dedicado (não é "desktop espremido")

1. **Sticky CTA bar** no rodapé do viewport mobile (aparece após o hero sair de tela,
   some quando o CTA final está visível): botão `Reservar horário` + ícone WhatsApp.
   É a mudança de maior impacto em conversão mobile.
2. **Hero mobile próprio**: H1 em 2 quebras no máximo, terminal full-bleed (sem borda lateral,
   cantos retos nas laterais), eyebrow em 1 linha só.
3. **Lista do segundo turno**: números à esquerda menores, texto maior; o efeito de
   "item ativo no centro" vira o principal charme mobile.
4. **Grid módulos**: 1 coluna com cards horizontais compactos (ícone à esquerda).
5. **Diff**: fonte mono reduz para 0.75rem, sem scroll horizontal NUNCA.
6. **Passos**: vira lista vertical com linha conectora à esquerda.
7. **Tap targets ≥ 44px**, FAQ com área de toque generosa.
8. **QA obrigatório em 360, 375 e 414px** + teste de LCP do hero (fonte display preload).

## 7. Fases de desenvolvimento (executar em nova sessão)

### Fase 0 — Conteúdo (bloqueia a Fase 2; pedir ao Eduardo logo no início)
- [ ] Confirmar quais clientes podem ser NOMEADOS publicamente (Preamar, Cristal Poços, Clínica Fonoaudiologia Avançada, Cardápios Um Livro Vivo)
- [ ] Foto profissional real (ou confirmar memoji por ora)
- [ ] Link da agenda (Google Calendar appointment schedule) → `SCHEDULING_URL`
- [ ] Nº honesto de vagas/mês para o badge de escassez
- [ ] 1–2 depoimentos, se existirem
- **Aceite**: lista de assets respondida (a página não pode ir ao ar com placeholder de cliente)

### Fase 1 — Copy nova no código (~1 sessão curta)
- Substituir todos os textos conforme seção 3 deste doc (arrays no topo de Mentoria.tsx)
- Novos cenários do terminal, nova msg WhatsApp, novo SEO/meta
- **Aceite**: zero ocorrência de "já usa Claude Code" fora do FAQ; leitura em voz alta soa "voz de dono"

### Fase 2 — Estrutura e identidade (~1 sessão)
- Nova seção "barra de prova" com clientes; nova seção "módulos" (grid 6); reordenar seções
- Escala tipográfica ampliada; espaçamentos; slot de foto real
- **Aceite**: desktop 1280/1440 pixel-perfect nos screenshots; build+lint verdes

### Fase 3 — Motion (~1 sessão)
- Implementar tabela da seção 5 com `motion/react`
- `useReducedMotion` em tudo; validar 60fps com throttle
- **Aceite**: todas as animações da tabela funcionando; com reduced-motion a página é 100% estática e completa

### Fase 4 — Mobile dedicado (~1 sessão)
- Sticky CTA bar; hero mobile; variantes de seção da seção 6
- **Aceite**: screenshots aprovados em 360/375/414; nenhum scroll horizontal; tap targets ok

### Fase 5 — QA e lançamento
- Lighthouse mobile ≥ 90 (perf e a11y); OG/title; contraste AA nas cores novas
- Commit por fase; branch atual `claude/angry-solomon-9774b6`
- **Aceite**: build de produção testado com `npm run preview`

### Prompt sugerido para abrir a nova sessão
> "Execute o plano em docs/plano-lp-mentoria-v3.md, começando pela Fase 0 (me pergunte os
> assets) e seguindo fase a fase com commit ao final de cada uma."

## 8. Referências técnicas
- Página atual: `src/pages/Mentoria.tsx` (+ `Mentoria.css`), rota em `src/App.tsx`
- Lib de animação: `motion@12` (instalada, não usada ainda) → importar de `motion/react`
- Fontes já carregadas em `index.html`: Inter, Fraunces (itálico 400/700), JetBrains Mono
- `SCHEDULING_URL` no topo de Mentoria.tsx (vazio = fallback WhatsApp)
- Callout da Home (`src/components/MentoriaCallout.tsx`): atualizar copy na Fase 1 para
  refletir o novo posicionamento (`Claude Code como sistema operacional da sua empresa`)
