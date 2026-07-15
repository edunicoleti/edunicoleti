export type EntryType = 'receita' | 'fixa' | 'variavel'

export type Installment = {
  current: number
  total: number
}

export type Entry = {
  id: string
  month: string // 'YYYY-MM'
  type: EntryType
  name: string
  categoryId: string | null
  cardId: string | null
  amountCents: number
  dueDay: number | null
  paid: boolean
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
  entries: Entry[]
  series: Series[]
  categories: Category[]
  cards: Card[]
}

export const EMPTY_DATA: FinData = {
  entries: [],
  series: [],
  categories: [],
  cards: [],
}

export function uid(): string {
  return crypto.randomUUID()
}
