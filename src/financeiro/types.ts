/*
 * Um lançamento é receita ou despesa. A qualidade de "fixa" não é um tipo:
 * ela vem de o lançamento pertencer a uma série (repete todo mês) ou ter
 * parcelas — ambos visíveis como selo na linha.
 */
export type EntryType = 'receita' | 'despesa'

/* Aba de visualização — "todas" é só uma lente, nunca um tipo de lançamento */
export type TabKey = 'todas' | 'receita' | 'despesa'

export type Installment = {
  current: number
  total: number
}

export type Entry = {
  id: string
  month: string // 'YYYY-MM' — balde contábil
  type: EntryType
  name: string
  categoryId: string | null
  cardId: string | null
  amountCents: number
  /* Vencimento como data real 'YYYY-MM-DD'. Antes era só o dia (v2): a data
     completa distingue a parcela de junho da de julho e sustenta o atraso. */
  dueDate: string | null
  paid: boolean
  /* Quando foi marcado como pago ('YYYY-MM-DD'); null enquanto em aberto */
  paidDate: string | null
  installment: Installment | null
  seriesId: string | null
}

export type Series = {
  id: string
  type: EntryType
  name: string
  categoryId: string | null
  cardId: string | null
  amountCents: number
  dueDay: number | null
  startMonth: string
  endMonth: string | null
  skipMonths: string[]
}

export type Category = {
  id: string
  name: string
  color: string
}

export type Card = {
  id: string
  name: string
}

export type FinData = {
  version: number
  entries: Entry[]
  series: Series[]
  categories: Category[]
  cards: Card[]
}

export const DATA_VERSION = 3

export const EMPTY_DATA: FinData = {
  version: DATA_VERSION,
  entries: [],
  series: [],
  categories: [],
  cards: [],
}

export function uid(): string {
  return crypto.randomUUID()
}
