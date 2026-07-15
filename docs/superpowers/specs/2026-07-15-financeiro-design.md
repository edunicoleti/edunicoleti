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
