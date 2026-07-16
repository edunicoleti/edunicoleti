# Plano LP Mentoria v4 — "Ecossistema de software com IA"

> Análise UX + nova proposta de comunicação e visual para `/mentoria`.
> Motivada pelo feedback do Eduardo sobre a v3 (não aprovou o discurso/argumentos)
> e pela visão de produto descrita por ele em julho/2026.
> Substitui a proposta de copy da v3; aproveita a infra técnica já construída
> (motion/react, sticky CTA mobile, code-splitting, QA de performance).

---

## 1. O que mudou: da v3 para a visão do Eduardo

### O discurso da v3 (rejeitado)
A v3 vendia **eliminação de dor**: "segundo turno invisível", "eu implanto",
"a operação roda sem você". Frame de eficiência/terceirização, voz de dono em
primeira pessoa, estética editorial de papel.

### A visão do Eduardo (nas palavras dele)
- "Te ajudo a desenvolver o teu **ecossistema de software** usando Claude Code."
- "Apoio de **agentes de IA 24h conectados no cérebro da sua empresa**, ajudando
  com soluções estratégicas e executando tarefas automatizadas."
- "**Mentoria individual personalizada.** Avaliamos sua realidade, quais projetos
  já tem em mente, e desenvolvemos uma estratégia personalizada."
- "Que você tenha **autonomia para escalar o seu negócio para a nova realidade
  do mercado**."
- "Conheça, gerencie e automatize seu negócio. **Sistema próprio de gestão**,
  personalizado para a sua realidade."
- "Conecte APIs diretamente no seu sistema de gestão. **Seu sistema conectado via
  MCP** com as maiores plataformas do mercado (Meta, Google, Analytics...)."
- "Seu **agente de IA personalizado**, conectado no seu sistema de gestão e
  executando tarefas 24h por dia."
- "**Escale sua operação com IA.**"

### Leitura estratégica da mudança

| Dimensão | v3 | Visão v4 |
|---|---|---|
| Frame emocional | Dor (cansaço, rotina roubada) | **Aspiração** (construir, escalar, futuro) |
| O que se compra | Automação de tarefas | **Um ativo: o ecossistema de software próprio** |
| Papel do Eduardo | Executor ("eu implanto") | **Guia + construtor** ("te ajudo a desenvolver", "avaliamos juntos") |
| Resultado prometido | Operação sem o dono | **Autonomia e escala** do negócio |
| Tecnologia na copy | Escondida (zero jargão) | **Protagonista com curadoria** (agentes, MCP, Claude Code como diferenciais) |
| Relação | Fornecedor de serviço | **Parceiro de longo prazo no ecossistema** |

A diferença central: **eficiência comoditiza, ecossistema valoriza**. Automação de
tarefas qualquer agência vende; "seu ecossistema próprio, com agentes conectados ao
cérebro da empresa, e você no comando" cria categoria e justifica ticket de
mentoria + desenvolvimento contínuo.

## 2. Análise UX da página atual vs a visão

1. **Hierarquia de mensagem invertida.** A v3 abre com o problema (segundo turno)
   e só revela a solução na seção 02. A visão do Eduardo é uma tese de futuro; teses
   de futuro abrem com a promessa ("Escale sua operação com IA") e usam o problema
   apenas como contraste pontual.
2. **A página não demonstra o produto.** Se o produto é "ecossistema de software
   sofisticado com agentes", a própria LP precisa parecer software sofisticado.
   A estética editorial de papel transmite confiança, mas não capacidade técnica.
   **A página interativa estilo designcode.io é a prova do produto** (meta-prova:
   "se ele constrói isso, imagina o meu sistema").
3. **Falta o mapa do ecossistema.** O conceito central (sistema de gestão no centro,
   agentes e integrações orbitando, conectado às plataformas via MCP) não existe
   visualmente na v3. É o elemento mais importante da v4: um diagrama vivo que se
   monta com o scroll.
4. **Proximidade local desperdiçada.** O maior diferencial para a rede de contatos
   (JCI, Associações Comerciais) não estava na página: **reunião presencial em
   Chapecó/SC, com o time da empresa**. Nenhum player nacional oferece isso.
   Vira seção própria e argumento de CTA.
5. **Jargão com função invertida.** Na v3 o jargão era proibido; na v4 termos como
   "agentes", "MCP" e "Claude Code" são **sinais de vanguarda** para um público que
   está ouvindo falar de IA em todo lugar e quer um guia local confiável. Regra:
   jargão sempre acompanhado de tradução em resultado ("MCP: seu sistema conversando
   com Meta, Google e Analytics sozinho").

## 3. Benchmark: como o mercado está se apresentando (jul/2026)

Pesquisado em 15/07/2026. Contexto de mercado: a Anthropic lançou em março/2026 a
**Claude Partner Network** (rede global de parceiros de adoção corporativa, com
US$ 100M de investimento inicial), e consultorias brasileiras como a **Corevalue**
já se posicionam como parceiras especializadas. Dados de adoção citáveis na LP:
mais de 80% das empresas planejam integrar agentes de IA em 1 a 3 anos (WEF/
Capgemini); mercado de agentes projetado de US$ 9B para US$ 139B até 2034.

### O que funciona nos players com boa aceitação

**especialistasclaudecode.com.br** (primeira agência BR de Claude Code):
- Demonstração prática no hero: terminal simulado criando uma API ao vivo
  (mesmo padrão que já temos; manter e evoluir)
- KPIs quantificados no topo (500+ projetos, 98% satisfação, 10x produtividade)
- Cases com métricas específicas (60% redução de tempo, 95% cobertura)
- Conversão consultiva via WhatsApp com mensagem pré-preenchida (igual ao nosso)
- Grid de 6 serviços; processo em 4 passos; FAQ

**Mentorias de nicho** (ex.: Claude para advocacia): segmentação por vertical +
autoridade nomeada. Lição: mentoria vende quando tem UM rosto e UM método claro.

**Consultorias corporativas (Corevalue etc.)**: linguagem de "infraestrutura de IA,
governança, arquitetura". Lição: para empresário maduro, "infraestrutura" e
"ecossistema" soam como investimento, não como gadget.

### Síntese do posicionamento assertivo para a rede local
> Enquanto os players nacionais vendem desenvolvimento à distância, o Eduardo é
> **o parceiro local de Chapecó que senta com o time da empresa**, constrói o
> ecossistema junto e deixa o cliente autônomo. Nacional na tecnologia
> (Claude Code, agentes, MCP), local na relação (presencial, indicação, JCI).

## 4. Nova arquitetura de comunicação (seção a seção)

Tom de voz: aspiracional e direto, primeira pessoa nas promessas ("te ajudo"),
plural na execução ("avaliamos", "desenvolvemos" = Eduardo + cliente juntos).
Sem travessões. Jargão sempre traduzido em resultado.

### 4.1 Hero
- Badge pill (glass): `claude code · agentes de ia · mcp`
- **H1**: `Escale sua operação com IA.`
- **Sub**: `Te ajudo a desenvolver o ecossistema de software da sua empresa com
  Claude Code: agentes de IA conectados ao cérebro do negócio, executando tarefas
  e apoiando decisões 24 horas por dia.`
- CTA primário: `Agendar diagnóstico` · CTA secundário: `Como funciona ↓`
- Nota: `presencial em Chapecó/SC · online em todo o Brasil`
- Elemento visual: terminal vivo (manter, é benchmark validado) OU preview do
  diagrama do ecossistema com glow

### 4.2 O ecossistema (seção-assinatura da página)
- Kicker: `01 · o ecossistema`
- H2: `Conheça, gerencie e automatize seu negócio.`
- Sub: `Um ecossistema de software próprio, desenhado para a sua realidade,
  que cresce com a empresa.`
- **Visual interativo**: diagrama orbital que se monta com o scroll (scrollytelling):
  1º aparece o núcleo (`seu sistema de gestão`), depois os agentes orbitando,
  depois as conexões MCP com as plataformas. Hover em cada nó revela o que ele faz.

### 4.3 Sistema de gestão próprio
- Kicker: `02 · o sistema`
- H2: `Um sistema de gestão feito para a sua empresa.`
- Corpo: `Nada de forçar sua operação a caber num software de prateleira.
  Desenvolvemos um sistema próprio, personalizado para a sua realidade:
  suas rotinas, seus indicadores, seu jeito de operar.`
- Cards glass: indicadores em tempo real · rotinas da SUA operação · acesso do
  time inteiro · evolui junto com o negócio

### 4.4 Integrações MCP
- Kicker: `03 · conectado a tudo`
- H2: `Seu sistema conversando com as maiores plataformas do mercado.`
- Corpo: `Via MCP, o padrão aberto de integração de IA, seu sistema se conecta
  direto às APIs de Meta, Google, Analytics, planilhas, CRMs e ERPs.
  Os dados entram e saem sozinhos.`
- Visual: fileira de ícones das plataformas (Meta, Google, Google Analytics,
  Sheets, WhatsApp...) com linhas de conexão animadas e hover glow
  (usar ícones oficiais simples; prática padrão de "integra com")

### 4.5 Agentes de IA 24h
- Kicker: `04 · agentes`
- H2: `Um agente de IA personalizado, trabalhando 24h no seu negócio.`
- Corpo: `Conectado ao seu sistema de gestão, o agente executa tarefas, monitora
  indicadores, prepara relatórios e te avisa do que importa. Você decide,
  ele executa. Um novo nível de gestão e automação.`
- Visual: feed/timeline animada de um agente trabalhando de madrugada
  (03:12 relatório gerado · 06:00 conciliação feita · 07:30 resumo no WhatsApp)

### 4.6 Mentoria individual personalizada (o método)
- Kicker: `05 · a mentoria`
- H2: `Avaliamos a sua realidade. Construímos a sua estratégia.`
- 3 passos: **Avaliação** (sua realidade e os projetos que você já tem em mente)
  → **Estratégia** (plano personalizado do ecossistema, priorizado)
  → **Construção com autonomia** (desenvolvemos juntos; você aprende a operar e
  evoluir sozinho)
- Fechamento: `Meu objetivo é a sua autonomia: que você escale o negócio para a
  nova realidade do mercado sem depender de ninguém.`

### 4.7 Formato: presencial ou online (NOVA, diferencial local)
- Kicker: `06 · onde acontece`
- H2: `Presencial em Chapecó. Online em todo o Brasil.`
- Dois cards:
  - **Chapecó/SC e região**: `Reuniões presenciais com você e o time da sua
    empresa. Mentoria dentro da sua operação real.`
  - **Demais regiões**: `Mesmo método, por videochamada. Sessões individuais e
    acompanhamento direto.`

### 4.8 Prova e contexto de mercado
- Dados citáveis: 80%+ das empresas planejam agentes de IA em 1 a 3 anos;
  mercado de agentes crescendo 15x até 2034; Claude Partner Network (Anthropic)
  lançada em 2026 = ecossistema oficial em expansão
- Dogfooding: `Minha própria operação roda nesse modelo: o sistema de propostas
  que meus clientes recebem foi construído com Claude Code e está em produção
  neste site.`
- Meta mono: `10+ anos · 50+ projetos · operação própria em claude code`

### 4.9 FAQ (reescrito para a v4)
1. `Preciso entender de tecnologia?` Não. A mentoria existe justamente pra isso:
   eu guio a parte técnica e você mantém o comando do negócio.
2. `Preciso já usar Claude Code?` Não. Se já usa, aceleramos. Se nunca abriu,
   começamos do zero, do jeito certo.
3. `O que é um ecossistema de software?` O conjunto de sistema de gestão, agentes
   de IA e integrações trabalhando juntos, feito sob medida pro seu negócio, e que
   fica seu.
4. `Serve pro meu ramo?` Se o seu negócio tem rotina, dados e decisões, serve.
   O ecossistema é desenhado na sua realidade, não é pacote pronto.
5. `Quanto custa?` Depende da estratégia que desenharmos juntos. O diagnóstico é
   gratuito e você sai dele com clareza do caminho, com ou sem contrato.
6. `O que preciso ter?` Uma assinatura do Claude com Claude Code e vontade de
   evoluir a gestão. O resto a gente constrói.

### 4.10 CTA final
- H2: `Vamos desenhar o seu ecossistema?`
- Sub: `Diagnóstico gratuito. Presencial em Chapecó/SC ou online.
  Você sai com o mapa do primeiro passo.`
- Botões: `Agendar diagnóstico` + `Chamar no WhatsApp`
- Msg WhatsApp: `Olá, Eduardo! Quero agendar um diagnóstico do ecossistema
  da minha empresa.`

### 4.11 SEO
- Title: `Ecossistema de Software com IA para Empresas | Claude Code | Eduardo Nicoleti`
- Description: `Desenvolva o ecossistema de software da sua empresa com Claude Code:
  sistema de gestão próprio, agentes de IA 24h e integrações via MCP. Mentoria
  individual, presencial em Chapecó/SC ou online.`

## 5. Direção visual: linguagem designcode.io

Referência aprovada pelo Eduardo: https://designcode.io/ (identidade visual geral +
micro-interações de scroll e hover, navegação interativa e fluida).

### DNA visual da referência
- **Dark luminoso** (não dark chapado): fundo azul-noite profundo com gradientes
  aurora (violeta, azul, ciano, rosa) em mesh/blur criando profundidade
- **Glassmorphism**: cards com blur, borda `rgba(255,255,255,0.1)`, brilho interno
- **Glow**: sombras coloridas atrás de elementos-chave, texto com gradiente
- Tipografia display grande e apertada, labels pequenas em caps
- **Micro-interações spring**: cards que levantam/inclinam no hover com glow que
  acompanha o mouse, botões com shimmer, ícones que reagem
- **Scroll storytelling**: seções sticky, parallax em camadas, reveals suaves,
  elementos que se montam conforme o scroll
- Nav em pill glass flutuante que encolhe ao rolar

### ⚠️ Decisão consciente sobre o dark
Na v1 desta LP o Eduardo rejeitou um tema dark editorial "pesado" (atmosfera
demais). O designcode.io é dark de outra natureza: **luminoso, colorido, vivo**,
lê-se como produto premium de tecnologia e é coerente com "ecossistema + agentes".
Decisão v4: seguir a referência (dark luminoso), validar com screenshot ao fim da
primeira fase de implementação antes de avançar. Plano B barato: os mesmos tokens
em modo claro (o designcode.io tem light mode; a linguagem sobrevive à troca).

### Aproveitamento técnico da v3
- `motion/react` já instalada e dominada (progress bar, springs, whileInView)
- Sticky CTA mobile, acessibilidade AA, reduced-motion, code-splitting: manter
- Terminal vivo: manter como demo, re-skinado para o novo tema
- CSS: **novo arquivo de tokens** (paleta, glass, glow, gradientes); estrutura de
  seções nova, então Mentoria.css será majoritariamente reescrito

### Mapa de interações v4 (evolução da tabela v3)
| Onde | Interação |
|---|---|
| Nav | Pill glass flutuante, encolhe no scroll, links com glow no hover |
| Hero | Gradiente aurora animado lento no fundo; headline com reveal por palavra; CTA com shimmer |
| Ecossistema | Scrollytelling sticky: núcleo → agentes → conexões MCP se montam conforme scroll |
| Cards (todas as seções) | Hover: lift + tilt sutil + glow seguindo o cursor |
| Integrações | Linhas de conexão animadas (dash offset), ícones com glow no hover |
| Agentes | Timeline com entradas aparecendo em sequência (stagger) |
| Passos da mentoria | Linha conectora que desenha + número com gradiente ativo |
| FAQ | Accordion glass suave (manter mecânica v3) |
| CTA final | Card glass com aurora própria e glow que respira |
| Página toda | Progress bar (manter), reduced-motion em tudo |

## 6. Fases de execução

### Fase 0 — Aprovação (bloqueia tudo)
- [ ] Eduardo aprova este documento (discurso, arquitetura, referência visual)
- [ ] Confirmar uso dos dados de mercado da seção 4.8 na página
- [ ] Confirmar dark luminoso como direção (com plano B claro)
- [ ] Definir se o produto ganha nome próprio (ex.: "Ecossistema IA") ou segue
      como mentoria/consultoria do Eduardo

### Fase 1 — Design system v4 + hero (~1 sessão)
- Tokens novos (paleta dark luminosa, glass, glow, gradientes), nav pill, hero completo
- **Gate de aprovação: screenshot do hero pro Eduardo antes de seguir**

### Fase 2 — Seções e copy (~1-2 sessões)
- Todas as seções da arquitetura 4.2 a 4.11, com copy final

### Fase 3 — Interações (~1 sessão)
- Scrollytelling do ecossistema, hovers com tilt/glow, timeline dos agentes

### Fase 4 — Mobile (~1 sessão)
- Adaptar interações pro touch (tilt vira press, scrollytelling simplificado),
  manter sticky CTA

### Fase 5 — QA e deploy
- Lighthouse (manter a11y 100, perf ≥ atual), reduced-motion, deploy na main

## 7. Fontes da pesquisa (15/07/2026)
- https://especialistasclaudecode.com.br/ (benchmark de agência BR)
- https://claudementorybossai.manus.space/ (mentoria de nicho, advocacia)
- https://www.clicportela.com.br/noticia/170144/claude-amplia-atuacao-no-brasil-com-parceiros-especializados (Claude Partner Network + Corevalue)
- https://abraao.tech/blog/agentes-de-ia-2026/ e https://eco.sapo.pt/2026/03/16/as-empresas-entraram-na-nova-era-da-ia-os-agentes-novo-curso-prepara-profissionais-portugueses/ (dados de adoção de agentes)
- https://designcode.io/ (referência visual aprovada)
