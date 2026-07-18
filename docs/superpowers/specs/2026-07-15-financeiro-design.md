# Spec — Sistema de Organização Financeira (/financeiro)

**Data:** 2026-07-15
**Status:** Aprovado pelo Eduardo (via brainstorming)

## Objetivo

Página interna em `edunicoleti.com.br/financeiro`, protegida por senha ("0800"), com um
sistema de organização financeira pessoal inspirado no dashboard de referência e na
planilha Excel atual do Eduardo. Uso em PC e celular.

## Decisões de produto

- **Dispositivos:** PC + celular → dados precisam sincronizar (nuvem).
- **Escopo:** receitas, despesas fixas, despesas variáveis, parceladas, situação
  pago/em aberto, agrupamento por cartão, gráfico de rosca por categoria.
- **Fora do escopo (por ora):** card de investimentos, multi-usuário, notificações.
- **Deploy:** automático via git (mesmo build do site).

## Arquitetura

SPA existente (Vite + React 19 + react-router). A rota `/financeiro` entra como chunk
lazy — zero impacto na Home e na LP Mentoria. `noindex` via meta tag injetada na página.

### Camada de armazenamento (adapter)

Interface única `StorageAdapter` com duas implementações:

1. **LocalAdapter** (padrão): estado inteiro persistido em `localStorage`
   (`financeiro:v1`). Funciona sem nenhuma configuração. Botões de exportar/importar
   backup JSON.
2. **SupabaseAdapter**: ativado quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
   existirem no ambiente. CRUD por linha nas tabelas `fin_*`, com RLS exigindo usuário
   autenticado. Login: e-mail fixo + senha digitada com sufixo interno (para atender o
   mínimo de 6 caracteres do Supabase). A senha "0800" passa a ser autenticação real.

Sem Supabase configurado, o gate de senha é apenas visual (comparação client-side) e os
dados ficam privados no navegador — limitação documentada e aceita.

### Modelo de dados

```ts
type EntryType = 'receita' | 'fixa' | 'variavel'

type Entry = {
  id: string
  month: string           // 'YYYY-MM'
  type: EntryType
  name: string
  categoryId: string | null
  cardId: string | null
  amountCents: number
  dueDay: number | null   // dia de vencimento (1–31)
  paid: boolean
  installment: { current: number; total: number } | null // ex.: 2/48
  seriesId: string | null // vincula recorrência (fixa) ou grupo de parcelas
}

type Series = {            // recorrência de despesa fixa / receita fixa
  id: string
  type: EntryType
  name: string
  categoryId: string | null
  cardId: string | null
  amountCents: number
  dueDay: number | null
  startMonth: string
  endMonth: string | null  // null = ativa
  skipMonths: string[]     // meses onde a ocorrência foi excluída individualmente
}

type Category = { id: string; name: string; color: string }
type Card = { id: string; name: string }
```

### Regras de recorrência

- **Fixas:** criam uma `Series`. As ocorrências são **materializadas sob demanda**: ao
  carregar/navegar, o app garante entries de cada série ativa até
  `max(mês visualizado, mês atual + 12)`, pulando `skipMonths` e respeitando
  `startMonth`/`endMonth`. Ocorrências materializadas são linhas independentes:
  - Editar **"só este mês"** altera apenas a linha.
  - Editar **"este e os próximos"** atualiza a série e reescreve as linhas futuras
    ainda não pagas.
  - Excluir **"só este mês"** remove a linha e adiciona o mês em `skipMonths`.
  - Excluir **"este e os próximos"** define `endMonth` e remove linhas futuras.
- **Parceladas:** geradas de uma vez na criação (ex.: lançar 2/48 em Julho/2026 gera
  3/48 … 48/48 nos meses seguintes, mesmo `seriesId`, sem `Series` — o grupo é finito).
  Edição/exclusão oferece "só esta parcela" ou "esta e as futuras".

### Cálculos do mês

- Receita = soma de `receita`; Despesas = soma de `fixa` + `variavel`.
- Saldo = Receita − Despesas. Pago / A pagar = partição de despesas por `paid`
  (replica a lógica Pago/A pagar da planilha).
- Fatura por cartão = soma de despesas do mês agrupadas por `cardId`.
- Rosca por categoria = despesas do mês agrupadas por `categoryId`, com percentuais.

## Interface (mobile-first, tokens do design system do site)

1. **Tela de bloqueio:** campo de senha único, sessão lembrada (sessionStorage no modo
   local; sessão Supabase no modo nuvem).
2. **Topo:** título + navegador de mês `‹ Julho de 2026 ›` (passado consulta, futuro
   projeta fixas + parcelas).
3. **Cards de resumo:** Receita · Despesas · A pagar · Saldo.
4. **Abas:** Receitas / Fixas / Variáveis → tabela editável (nome, categoria, cartão,
   vencimento, valor, parcela, checkbox pago). Rodapé com total da aba.
5. **Painel lateral** (abaixo no mobile): rosca SVG por categoria com legenda
   (percentual + nome) e lista de fatura total por cartão.
6. **Adicionar/editar:** botão "+ Adicionar" abre modal (desktop) / bottom-sheet
   (mobile) com: tipo, nome, valor (máscara BRL), categoria, cartão, dia de vencimento,
   repetir todo mês (fixa), parcelado (parcela atual / total), pago.
7. **Gerenciar categorias e cartões:** modal simples (criar, renomear, cor, excluir).
8. **Backup:** exportar/importar JSON (modo local).

Sem dependências novas de UI (rosca em SVG à mão; ícones do lucide-react já presente).
Única dependência nova: `@supabase/supabase-js`.

## Seed (Julho/2026, da planilha)

Aplicado apenas na primeira execução (storage vazio):

| Lançamento | Tipo | Valor | Situação | Extras |
|---|---|---|---|---|
| Luz e Internet | fixa (série) | R$ 920,00 | pago | categoria Casa |
| Fatura Cartão Nubank | variável | R$ 1.611,86 | em aberto | cartão Nubank |
| Cartão Mercado Livre | variável | R$ 656,08 | pago | cartão Mercado Livre |
| Fatura PJ Nubank | variável | R$ 520,00 | pago | cartão Nubank PJ |
| Fatura Cartão Sicredi | variável | R$ 162,60 | pago | cartão Sicredi |
| Carro - BV | fixa (parcelada) | R$ 1.128,00 | em aberto | parcela 2/48, categoria Carro |
| Plano Unimed | fixa (série) | R$ 800,00 | pago | categoria Saúde |

Conferência: total R$ 5.798,54 · pago R$ 3.058,68 · a pagar R$ 2.739,86 (bate com a
planilha; o checkbox da planilha é a fonte da verdade da situação — o Unimed consta
"EM ABERTO" na coluna Situação mas está no total pago).

Categorias seed: Casa, Cartões, Carro, Saúde, Mercado, Contas (cores da paleta).
Cartões seed: Nubank, Nubank PJ, Sicredi, Mercado Livre.

## Erros e robustez

- Valores em **centavos (inteiros)** — nunca float.
- Escrita no adapter é otimista; falha de rede no modo Supabase mostra aviso e mantém
  estado local da sessão.
- Import de backup valida a estrutura antes de substituir.

## Testes / verificação

Verificação manual via preview: login, seed correto (totais idênticos à planilha),
CRUD nas três abas, navegação para meses futuros mostrando fixas + parcelas projetadas
(ex.: Agosto/2026 deve mostrar Luz e Internet, Unimed e Carro - BV 3/48), gráfico e
faturas por cartão, responsivo mobile.

## Documentação

`docs/financeiro-supabase-setup.md` com passo a passo: criar projeto Supabase, rodar o
SQL das tabelas + RLS, criar o usuário, e colar as env vars no provedor de deploy.

---

## Revisão 2 — 2026-07-16 (pós-uso)

Ajustes pedidos depois da primeira versão no ar. O que muda em relação ao texto acima:

### Modelo: `fixa`/`variavel` colapsam em `despesa`

`EntryType` passa a ser `'receita' | 'despesa'`. A distinção fixa/variável era
informação duplicada: "fixa" já é observável por o lançamento ter uma `Series`
(repete todo mês) ou parcelas — ambos já exibidos como selo na linha. Migração
`v1 → v2` em `migrate.ts`, acionada no `load` dos dois adapters; `FinData` ganha
`version`.

### Abas: Todas · Receitas · Despesas

"Todas" é a lente principal e padrão, com receitas listadas antes das despesas.
Some a separação fixas/variáveis.

### Rodapé da lista: três números

Total · Pago · A pagar (em Receitas: Total · Recebido · A receber). Em "Todas" o
total é o **saldo** (assinado) e pago/a pagar seguem só as despesas, igual aos
cards do topo — somar receita recebida com despesa paga não teria significado.

### Status: pill no lugar do checkbox

Checkbox à esquerda da linha é a convenção de *seleção de linha*, não de status;
não se descreve sozinho e tinha alvo de toque de 18px. Vira um pill clicável à
direita do valor, com ícone + rótulo ("Pago"/"A pagar"), `aria-pressed` e 44px de
alvo de toque — espelhando a coluna SITUAÇÃO da planilha.

### Gráfico: Recharts, e a paleta passou a ser validada

Donut em `recharts` (MIT): percentuais dentro do anel, hover sincronizado com a
legenda nos dois sentidos, figura central que mostra a fatia em foco, toque para
focar no mobile.

A paleta antiga **reprovava** no validador de CVD: `#4F46E5` (Contas) e `#7C3AED`
(Cartões) ficavam a ΔE 3.5 sob protanopia — indistinguíveis. A nova (`palette.ts`)
mantém o azul da marca no slot 1 e usa a paleta de referência validada nos demais:
pior par ΔE 12.9 com os 7 slots padrão, checado com `--pairs all` porque as fatias
são ordenadas por valor e qualquer par pode virar vizinho.

Regras aplicadas: cauda além de 6 fatias vira "Outras" em cinza (nunca um 9º hue
gerado); rótulo só dentro de fatias ≥ 7% (abaixo disso não cabe e vai para a
legenda); legenda sempre presente como canal de alívio — aqua, amarelo e magenta
ficam abaixo de 3:1 no branco, e a regra de alívio exige rótulo visível.

Nova categoria padrão: **Filho**. A migração só garante essa — recriar toda
categoria padrão ausente ressuscitaria as que o usuário apagou de propósito.

### Custo de bundle

`recharts` fica isolado no chunk lazy do `/financeiro` (147 kB gzip). O chunk
`index`, que serve Home e LP Mentoria, seguiu inalterado em ~116 kB gzip.

---

## Revisão 3 — 2026-07-16 (dashboard analítica)

Os percentuais dentro do anel do donut saíram (poluição visual); ficam na
legenda e na figura central. Novos recursos, todos sobre dados que já existiam:

- **Projeção dos próximos 6 meses** (`MonthlyProjection`): barras com o
  comprometido (fixas + parcelas) dos 6 meses após o mês visto, linha de
  receita quando houver, rótulo compacto no topo de cada barra, tooltip, e
  clique na barra navega para o mês. A materialização de séries passou a
  cobrir mês visto + 6.
- **Parcelamentos ativos** (`InstallmentsPanel`): por grupo de parcelas —
  próxima parcela, quantas faltam, valor restante, mês de término e barra de
  progresso. "Faltam" é sempre relativo ao mês de hoje, não ao navegado.
- **Comparativo com o mês anterior**: delta % nos cards Receita/Despesas
  (para despesa, subir é ruim/laranja) e delta por categoria na legenda do
  donut, em cinza. Variação < 1% é suprimida; sem mês anterior, sem delta.
- **Categoria filtra a lista**: clique na fatia/legenda do donut ou no chip
  da linha alterna o filtro; barra acima da lista mostra o filtro ativo com
  "limpar". Seleção no donut é controlada (persiste após o hover).
- **Copiar mês anterior**: botão no cabeçalho da lista (só quando há
  candidatos) copia os lançamentos manuais — sem série e sem parcela — do mês
  anterior como cópias em aberto, pulando nomes já presentes no mês.
- **Leitura da tabela**: zebra sutil (#F7F7F4) nas linhas em aberto; linhas
  pagas recebem lavagem verde (5%) que vence a zebra — pendente alterna,
  resolvido recua em bloco uniforme. Divisor entre linhas saiu; cantos
  arredondados entraram. Riscado e reordenação de pagos foram descartados
  (prejudica leitura / linha pularia ao marcar).

Chunk do /financeiro: 171 kB gzip (Bar/Line/ComposedChart); `index` inalterado.

---

## Revisão 4 — 2026-07-16 (ajustes + backlog do assistente IA)

- **Despesas parceladas**: o painel de parcelamentos passa a considerar só
  `type === 'despesa'` — receita parcelada (ex.: projeto recebido em parcelas)
  não é dívida; segue na lista e na projeção.
- **Projeção redesenhada**: barras horizontais em HTML/CSS (mês / barra /
  valor legível), traço verde marcando a receita na régua, barra vermelha
  quando o comprometido passa da receita do mês. Sai o BarChart do Recharts
  (ilegível no painel estreito); chunk cai para ~149 kB gzip.

### Backlog — Assistente IA financeiro (análise de viabilidade feita, não implementado)

Viável e barato; decisão registrada em 2026-07-16. Plano em duas fases:

1. **Fase 1 — Alertas inteligentes sem IA** (~meio dia, sem pré-requisitos):
   regras determinísticas sobre dados existentes — mês futuro com comprometido
   acima da receita, categoria fora do padrão histórico, comprometimento da
   renda acima de limiar. Painel de alertas na dashboard.
2. **Fase 2 — Assistente IA** (~1 dia, com pré-requisitos): Supabase Edge
   Function como ponte (a chave da API nunca vai ao navegador; site é estático),
   autenticação via Supabase Auth existente. O app envia **resumo agregado**
   (totais por mês/categoria, parcelamentos, projeção), não lançamentos
   individuais. Prompt de especialista em organização financeira em linguagem
   acessível; escopo limitado a orçamento/organização — sem recomendação de
   investimentos específicos. Modelo: Claude Opus 4.8 (~US$ 0,08/análise;
   Haiku 4.5 como alternativa econômica ~US$ 0,02).

   **Pré-requisitos**: (a) Supabase configurado
   (`docs/financeiro-supabase-setup.md`), (b) conta em console.anthropic.com
   com créditos pré-pagos (~US$ 5 duram meses), (c) Edge Function + painel de
   chat a implementar.

---

## Revisão 5 — 2026-07-16 (projeção em área + backlog reordenado)

### Projeção vira gráfico de área

`MonthlyProjection` passa a ser um `AreaChart` do Recharts com duas séries
preenchidas: comprometido (vermelho `#DC2626`) e receita (verde `#16A34A`),
com o valor de cada ponto rotulado no gráfico.

Decisões que valem registrar:

- **Rótulo posiciona por comparação, não por posição fixa.** `position="top"`
  na receita e `"bottom"` na despesa colidia sempre que as linhas se cruzam
  (medido: 3px de distância em set/out). Agora quem tem o maior valor no mês
  leva o rótulo acima; empate manda a despesa para cima. Zero colisões
  medidas em desktop e mobile.
- **Par verde/vermelho validado**, apesar de ser a colisão clássica do
  daltonismo: ΔE 20.6 sob deuteranopia (alvo 12) — a diferença de
  luminosidade separa o par mesmo sem percepção de matiz. Legenda + rótulos
  diretos são o canal secundário exigido pela regra de alívio.
- **Eixo Y ancorado em zero** (`domain={[0, max * 1.25]}`): truncar o eixo
  exageraria a distância entre as linhas e faria um mês apertado parecer
  folgado.
- **Hit-test do clique é próprio**, calculado da posição do clique — não do
  `activeIndex` do Recharts, que deriva do `offsetX` de evento real de
  ponteiro (opaco no toque e não verificável em teste). As constantes
  `MARGIN_X`/`AXIS_PAD` são compartilhadas entre o gráfico e o hit-test.

Chunk do /financeiro: ~169 kB gzip; `index` (Home e LP) inalterado em ~115 kB.

### Backlog reordenado

1. **Fase 1 — Alertas por regras** ✅ **CONCLUÍDA** (`alerts.ts` + painel; deploy)
2. **Fase 2 — Import de faturas por print** ⬅ próxima; pré-requisitos pendentes
3. **Fase 3 — Assistente de chat** (reaproveita a Edge Function da Fase 2)

**Fase 1 entregue** (`alerts.ts`): motor puro com três regras — gargalo futuro
(mês dos próximos 6 com despesa > receita), comprometimento da renda
(fixas+parcelas vs receita; aviso 60%, perigo 85%), categoria acima da média
(vs média dos até 3 meses anteriores; ≥30% e ≥R$100). Painel entre cards e
abas, só aparece quando há alerta, ordenado por gravidade. Sem alarme falso no
seed padrão. Limiares centralizados no topo de `alerts.ts` para ajuste fácil.

### Fase 2 — Import de faturas de cartão por print (análise feita 2026-07-16)

Viável. Sobe de prioridade porque conserta o maior buraco de dados do sistema:
hoje cada fatura é **um** lançamento, então o donut diz "Cartões 51%" — metade
do dinheiro sem categoria real.

**O modelo já aguenta, sem migração.** `cardTotals` em `Financeiro.tsx` soma
toda despesa com `cardId` preenchido — não um lançamento-resumo específico.
Itens individuais com `cardId` fazem o painel "Faturas por cartão" continuar
correto **e** dão categoria própria a cada item. Parcelas dentro da fatura
("3/10") caem no modelo de `installment` existente e se projetam sozinhas.
Único cuidado: ao importar, substituir o lançamento-resumo da fatura para não
somar duas vezes.

**Fluxo**: `<input type="file" accept="image/*" multiple>` (abre galeria/câmera
no celular) → Edge Function → Claude Opus 4.8 com `output_config.format`
(JSON Schema garante saída parseável) → tabela de revisão → salvar. **Nunca
lançar direto.**

**Verificação que torna confiável**: somar os itens extraídos e comparar com o
total da fatura que a Claude também lê do print. Pega linha perdida na emenda
entre prints e linha duplicada na sobreposição. Sem esse cruzamento, não
construir. Dedup adicional por fingerprint (cartão + data + nome + valor).

**Modelo**: Opus 4.8 — visão de alta resolução (2576px; print de iPhone cabe
inteiro) e treinado para imagem torta/borrada/com ruído. ~US$ 0,12 por fatura
de ~3 prints (~R$ 0,65); ~R$ 2,60/mês para 4 cartões. Haiku 4.5 sairia ~US$
0,02 mas economizar R$ 2/mês num OCR de valores em dinheiro é falsa economia.

**Decisão pendente**: fatura ≠ mês — a fatura que vence em julho tem compras de
junho. Recomendação: lançar no **mês da fatura** (é quando o dinheiro sai, e é
como a planilha original funcionava).

**Esforço**: ~1 a 1,5 dia. Pré-requisitos iguais aos da Fase 3 (Supabase +
conta Anthropic); a Edge Function é compartilhada entre as duas fases.
