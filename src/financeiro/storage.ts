import type { Card, Category, Entry, FinData, Series } from './types'
import { DATA_VERSION } from './types'
import { cloudEnabled, getSupabase } from './supabase'
import { migrate } from './migrate'

export interface StorageAdapter {
  mode: 'local' | 'cloud'
  /* null = primeira execução (sem dados) */
  load(): Promise<FinData | null>
  seedAll(data: FinData): Promise<void>
  upsertEntries(entries: Entry[]): Promise<void>
  deleteEntries(ids: string[]): Promise<void>
  upsertSeries(series: Series): Promise<void>
  deleteSeries(id: string): Promise<void>
  upsertCategory(category: Category): Promise<void>
  deleteCategory(id: string): Promise<void>
  upsertCard(card: Card): Promise<void>
  deleteCard(id: string): Promise<void>
  replaceAll(data: FinData): Promise<void>
}

/* ---------- Local (localStorage) ---------- */

const LOCAL_KEY = 'financeiro:v1'

function isFinData(value: unknown): value is FinData {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    Array.isArray(v.entries) &&
    Array.isArray(v.series) &&
    Array.isArray(v.categories) &&
    Array.isArray(v.cards)
  )
}

export function parseBackup(json: string): FinData | null {
  try {
    const parsed: unknown = JSON.parse(json)
    if (!isFinData(parsed)) return null
    /* Backups anteriores à v2 não têm o campo version */
    return migrate({ ...parsed, version: parsed.version ?? 1 })
  } catch {
    return null
  }
}

class LocalAdapter implements StorageAdapter {
  mode = 'local' as const
  private data: FinData | null = null

  private persist() {
    if (this.data) localStorage.setItem(LOCAL_KEY, JSON.stringify(this.data))
  }

  async load(): Promise<FinData | null> {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return null
    /* parseBackup já migra; grava de volta para não remigrar a cada carga */
    const parsed = parseBackup(raw)
    this.data = parsed
    if (parsed) this.persist()
    return parsed
  }

  async seedAll(data: FinData) {
    this.data = data
    this.persist()
  }

  async replaceAll(data: FinData) {
    this.data = data
    this.persist()
  }

  async upsertEntries(entries: Entry[]) {
    if (!this.data) return
    const byId = new Map(entries.map((e) => [e.id, e]))
    this.data.entries = this.data.entries.map((e) => byId.get(e.id) ?? e)
    const existing = new Set(this.data.entries.map((e) => e.id))
    this.data.entries.push(...entries.filter((e) => !existing.has(e.id)))
    this.persist()
  }

  async deleteEntries(ids: string[]) {
    if (!this.data) return
    const gone = new Set(ids)
    this.data.entries = this.data.entries.filter((e) => !gone.has(e.id))
    this.persist()
  }

  async upsertSeries(series: Series) {
    if (!this.data) return
    const idx = this.data.series.findIndex((s) => s.id === series.id)
    if (idx >= 0) this.data.series[idx] = series
    else this.data.series.push(series)
    this.persist()
  }

  async deleteSeries(id: string) {
    if (!this.data) return
    this.data.series = this.data.series.filter((s) => s.id !== id)
    this.persist()
  }

  async upsertCategory(category: Category) {
    if (!this.data) return
    const idx = this.data.categories.findIndex((c) => c.id === category.id)
    if (idx >= 0) this.data.categories[idx] = category
    else this.data.categories.push(category)
    this.persist()
  }

  async deleteCategory(id: string) {
    if (!this.data) return
    this.data.categories = this.data.categories.filter((c) => c.id !== id)
    this.persist()
  }

  async upsertCard(card: Card) {
    if (!this.data) return
    const idx = this.data.cards.findIndex((c) => c.id === card.id)
    if (idx >= 0) this.data.cards[idx] = card
    else this.data.cards.push(card)
    this.persist()
  }

  async deleteCard(id: string) {
    if (!this.data) return
    this.data.cards = this.data.cards.filter((c) => c.id !== id)
    this.persist()
  }
}

/* ---------- Supabase (nuvem) ---------- */

type EntryRow = {
  id: string
  month: string
  type: Entry['type']
  name: string
  category_id: string | null
  card_id: string | null
  amount_cents: number
  due_date: string | null
  paid: boolean
  paid_date: string | null
  installment_current: number | null
  installment_total: number | null
  series_id: string | null
}

function toEntryRow(e: Entry): EntryRow {
  return {
    id: e.id,
    month: e.month,
    type: e.type,
    name: e.name,
    category_id: e.categoryId,
    card_id: e.cardId,
    amount_cents: e.amountCents,
    due_date: e.dueDate,
    paid: e.paid,
    paid_date: e.paidDate,
    installment_current: e.installment?.current ?? null,
    installment_total: e.installment?.total ?? null,
    series_id: e.seriesId,
  }
}

function fromEntryRow(r: EntryRow): Entry {
  return {
    id: r.id,
    month: r.month,
    type: r.type,
    name: r.name,
    categoryId: r.category_id,
    cardId: r.card_id,
    amountCents: r.amount_cents,
    dueDate: r.due_date,
    paid: r.paid,
    paidDate: r.paid_date,
    installment:
      r.installment_current != null && r.installment_total != null
        ? { current: r.installment_current, total: r.installment_total }
        : null,
    seriesId: r.series_id,
  }
}

type SeriesRow = {
  id: string
  type: Series['type']
  name: string
  category_id: string | null
  card_id: string | null
  amount_cents: number
  due_day: number | null
  start_month: string
  end_month: string | null
  skip_months: string[]
}

function toSeriesRow(s: Series): SeriesRow {
  return {
    id: s.id,
    type: s.type,
    name: s.name,
    category_id: s.categoryId,
    card_id: s.cardId,
    amount_cents: s.amountCents,
    due_day: s.dueDay,
    start_month: s.startMonth,
    end_month: s.endMonth,
    skip_months: s.skipMonths,
  }
}

function fromSeriesRow(r: SeriesRow): Series {
  return {
    id: r.id,
    type: r.type,
    name: r.name,
    categoryId: r.category_id,
    cardId: r.card_id,
    amountCents: r.amount_cents,
    dueDay: r.due_day,
    startMonth: r.start_month,
    endMonth: r.end_month,
    skipMonths: r.skip_months ?? [],
  }
}

class SupabaseAdapter implements StorageAdapter {
  mode = 'cloud' as const

  async load(): Promise<FinData | null> {
    const sb = getSupabase()
    const [entries, series, categories, cards] = await Promise.all([
      sb.from('fin_entries').select('*'),
      sb.from('fin_series').select('*'),
      sb.from('fin_categories').select('*'),
      sb.from('fin_cards').select('*'),
    ])
    const err = entries.error ?? series.error ?? categories.error ?? cards.error
    if (err) throw new Error(err.message)
    const rawEntries = (entries.data as EntryRow[]).map(fromEntryRow)
    /* Sem coluna de versão no banco: infere pelo tipo legado nas linhas */
    const legacy = rawEntries.some((e) => e.type !== 'receita' && e.type !== 'despesa')
    const data: FinData = {
      version: legacy ? 1 : DATA_VERSION,
      entries: rawEntries,
      series: (series.data as SeriesRow[]).map(fromSeriesRow),
      categories: categories.data as Category[],
      cards: cards.data as Card[],
    }
    const empty =
      data.entries.length === 0 &&
      data.series.length === 0 &&
      data.categories.length === 0 &&
      data.cards.length === 0
    if (empty) return null

    const migrated = migrate(data)
    if (migrated !== data) await this.replaceAll(migrated)
    return migrated
  }

  async seedAll(data: FinData) {
    const sb = getSupabase()
    const results = await Promise.all([
      sb.from('fin_categories').upsert(data.categories),
      sb.from('fin_cards').upsert(data.cards),
      sb.from('fin_series').upsert(data.series.map(toSeriesRow)),
      sb.from('fin_entries').upsert(data.entries.map(toEntryRow)),
    ])
    const err = results.find((r) => r.error)?.error
    if (err) throw new Error(err.message)
  }

  async replaceAll(data: FinData) {
    const sb = getSupabase()
    // Limpa e regrava (import de backup)
    await Promise.all([
      sb.from('fin_entries').delete().neq('id', ''),
      sb.from('fin_series').delete().neq('id', ''),
      sb.from('fin_categories').delete().neq('id', ''),
      sb.from('fin_cards').delete().neq('id', ''),
    ])
    await this.seedAll(data)
  }

  async upsertEntries(entries: Entry[]) {
    const { error } = await getSupabase()
      .from('fin_entries')
      .upsert(entries.map(toEntryRow))
    if (error) throw new Error(error.message)
  }

  async deleteEntries(ids: string[]) {
    const { error } = await getSupabase().from('fin_entries').delete().in('id', ids)
    if (error) throw new Error(error.message)
  }

  async upsertSeries(series: Series) {
    const { error } = await getSupabase().from('fin_series').upsert(toSeriesRow(series))
    if (error) throw new Error(error.message)
  }

  async deleteSeries(id: string) {
    const { error } = await getSupabase().from('fin_series').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }

  async upsertCategory(category: Category) {
    const { error } = await getSupabase().from('fin_categories').upsert(category)
    if (error) throw new Error(error.message)
  }

  async deleteCategory(id: string) {
    const { error } = await getSupabase().from('fin_categories').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }

  async upsertCard(card: Card) {
    const { error } = await getSupabase().from('fin_cards').upsert(card)
    if (error) throw new Error(error.message)
  }

  async deleteCard(id: string) {
    const { error } = await getSupabase().from('fin_cards').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}

export function createAdapter(): StorageAdapter {
  return cloudEnabled ? new SupabaseAdapter() : new LocalAdapter()
}
