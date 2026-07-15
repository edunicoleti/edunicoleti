import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Card, Category, Entry, FinData, Installment, Series } from './types'
import { EMPTY_DATA, uid } from './types'
import { addMonths, compareMonths, currentMonth } from './months'
import { generateInstallments, materializeSeries } from './recurrence'
import { buildSeedData } from './seed'
import { createAdapter, parseBackup } from './storage'

export type EditScope = 'one' | 'future'

export type NewEntryInput = {
  month: string
  type: Entry['type']
  name: string
  categoryId: string | null
  cardId: string | null
  amountCents: number
  dueDay: number | null
  paid: boolean
  /* repetir todo mês (cria série) */
  recurring: boolean
  /* parcelado (gera grupo de parcelas) */
  installment: Installment | null
}

export type EntryPatch = {
  name: string
  categoryId: string | null
  cardId: string | null
  amountCents: number
  dueDay: number | null
  paid: boolean
}

export function useFinStore(viewedMonth: string) {
  const adapterRef = useRef(createAdapter())
  const [data, setData] = useState<FinData>(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState<string | null>(null)

  const adapter = adapterRef.current

  const guard = useCallback((promise: Promise<void>) => {
    promise.catch((err: unknown) => {
      setSyncError(err instanceof Error ? err.message : 'Falha ao salvar')
    })
  }, [])

  /* Carga inicial + seed na primeira execução */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        let loaded = await adapter.load()
        if (!loaded) {
          loaded = buildSeedData()
          await adapter.seedAll(loaded)
        }
        if (!cancelled) setData(loaded)
      } catch (err) {
        if (!cancelled) {
          setSyncError(err instanceof Error ? err.message : 'Falha ao carregar')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [adapter])

  /* Materializa ocorrências de séries fixas até o horizonte do mês visto.
     O ref evita duplicatas quando o effect roda de novo antes do estado
     refletir a materialização anterior (ex.: StrictMode). */
  const materializedKeysRef = useRef(new Set<string>())
  useEffect(() => {
    if (loading) return
    const created = materializeSeries(data.series, data.entries, viewedMonth).filter(
      (e) => !materializedKeysRef.current.has(`${e.seriesId}:${e.month}`),
    )
    if (created.length === 0) return
    for (const e of created) materializedKeysRef.current.add(`${e.seriesId}:${e.month}`)
    setData((d) => {
      /* Dedup também aqui: o estado atual pode já conter a ocorrência
         (lote anterior ou recarga), mesmo que o closure não a visse */
      const existing = new Set(
        d.entries.filter((e) => e.seriesId).map((e) => `${e.seriesId}:${e.month}`),
      )
      const fresh = created.filter((e) => !existing.has(`${e.seriesId}:${e.month}`))
      return fresh.length > 0 ? { ...d, entries: [...d.entries, ...fresh] } : d
    })
    guard(adapter.upsertEntries(created))
  }, [loading, viewedMonth, data.series, data.entries, adapter, guard])

  const addEntry = useCallback(
    (input: NewEntryInput) => {
      const base = {
        month: input.month,
        type: input.type,
        name: input.name,
        categoryId: input.categoryId,
        cardId: input.cardId,
        amountCents: input.amountCents,
        dueDay: input.dueDay,
        paid: input.paid,
      }

      if (input.installment) {
        const entries = generateInstallments(base, input.installment)
        setData((d) => ({ ...d, entries: [...d.entries, ...entries] }))
        guard(adapter.upsertEntries(entries))
        return
      }

      if (input.recurring) {
        const series: Series = {
          id: uid(),
          type: input.type,
          name: input.name,
          categoryId: input.categoryId,
          cardId: input.cardId,
          amountCents: input.amountCents,
          dueDay: input.dueDay,
          startMonth: input.month,
          endMonth: null,
          skipMonths: [],
        }
        const first: Entry = { ...base, id: uid(), installment: null, seriesId: series.id }
        setData((d) => ({
          ...d,
          series: [...d.series, series],
          entries: [...d.entries, first],
        }))
        guard(adapter.upsertSeries(series))
        guard(adapter.upsertEntries([first]))
        return
      }

      const entry: Entry = { ...base, id: uid(), installment: null, seriesId: null }
      setData((d) => ({ ...d, entries: [...d.entries, entry] }))
      guard(adapter.upsertEntries([entry]))
    },
    [adapter, guard],
  )

  const updateEntry = useCallback(
    (entry: Entry, patch: EntryPatch, scope: EditScope) => {
      const apply = (e: Entry, withPaid: boolean): Entry => ({
        ...e,
        name: patch.name,
        categoryId: patch.categoryId,
        cardId: patch.cardId,
        amountCents: patch.amountCents,
        dueDay: patch.dueDay,
        paid: withPaid ? patch.paid : e.paid,
      })

      const changed: Entry[] = []
      let newSeries: Series | null = null

      setData((d) => {
        const isFixedSeries = entry.seriesId && !entry.installment
        const series = isFixedSeries
          ? d.series.find((s) => s.id === entry.seriesId) ?? null
          : null

        const entries = d.entries.map((e) => {
          if (e.id === entry.id) {
            const next = apply(e, true)
            changed.push(next)
            return next
          }
          if (
            scope === 'future' &&
            entry.seriesId &&
            e.seriesId === entry.seriesId &&
            compareMonths(e.month, entry.month) > 0 &&
            !e.paid
          ) {
            const next = apply(e, false)
            changed.push(next)
            return next
          }
          return e
        })

        let seriesList = d.series
        if (scope === 'future' && series) {
          newSeries = {
            ...series,
            name: patch.name,
            categoryId: patch.categoryId,
            cardId: patch.cardId,
            amountCents: patch.amountCents,
            dueDay: patch.dueDay,
          }
          seriesList = d.series.map((s) => (s.id === newSeries!.id ? newSeries! : s))
        }

        return { ...d, entries, series: seriesList }
      })

      if (changed.length > 0) guard(adapter.upsertEntries(changed))
      if (newSeries) guard(adapter.upsertSeries(newSeries))
    },
    [adapter, guard],
  )

  const togglePaid = useCallback(
    (entry: Entry) => {
      const next = { ...entry, paid: !entry.paid }
      setData((d) => ({
        ...d,
        entries: d.entries.map((e) => (e.id === entry.id ? next : e)),
      }))
      guard(adapter.upsertEntries([next]))
    },
    [adapter, guard],
  )

  const deleteEntry = useCallback(
    (entry: Entry, scope: EditScope) => {
      const removedIds: string[] = []
      let seriesUpdate: Series | null = null
      let seriesDeleteId: string | null = null

      setData((d) => {
        const isFixedSeries = entry.seriesId && !entry.installment
        const series = isFixedSeries
          ? d.series.find((s) => s.id === entry.seriesId) ?? null
          : null

        const shouldRemove = (e: Entry): boolean => {
          if (e.id === entry.id) return true
          return (
            scope === 'future' &&
            entry.seriesId != null &&
            e.seriesId === entry.seriesId &&
            compareMonths(e.month, entry.month) > 0
          )
        }

        const entries = d.entries.filter((e) => {
          const remove = shouldRemove(e)
          if (remove) removedIds.push(e.id)
          return !remove
        })

        let seriesList = d.series
        if (series) {
          if (scope === 'one') {
            seriesUpdate = { ...series, skipMonths: [...series.skipMonths, entry.month] }
            seriesList = d.series.map((s) => (s.id === series.id ? seriesUpdate! : s))
          } else if (compareMonths(entry.month, series.startMonth) <= 0) {
            seriesDeleteId = series.id
            seriesList = d.series.filter((s) => s.id !== series.id)
          } else {
            seriesUpdate = { ...series, endMonth: addMonths(entry.month, -1) }
            seriesList = d.series.map((s) => (s.id === series.id ? seriesUpdate! : s))
          }
        }

        return { ...d, entries, series: seriesList }
      })

      if (removedIds.length > 0) guard(adapter.deleteEntries(removedIds))
      if (seriesUpdate) guard(adapter.upsertSeries(seriesUpdate))
      if (seriesDeleteId) guard(adapter.deleteSeries(seriesDeleteId))
    },
    [adapter, guard],
  )

  const saveCategory = useCallback(
    (category: Category) => {
      setData((d) => {
        const exists = d.categories.some((c) => c.id === category.id)
        return {
          ...d,
          categories: exists
            ? d.categories.map((c) => (c.id === category.id ? category : c))
            : [...d.categories, category],
        }
      })
      guard(adapter.upsertCategory(category))
    },
    [adapter, guard],
  )

  const deleteCategory = useCallback(
    (id: string) => {
      setData((d) => ({
        ...d,
        categories: d.categories.filter((c) => c.id !== id),
        entries: d.entries.map((e) =>
          e.categoryId === id ? { ...e, categoryId: null } : e,
        ),
      }))
      guard(adapter.deleteCategory(id))
    },
    [adapter, guard],
  )

  const saveCard = useCallback(
    (card: Card) => {
      setData((d) => {
        const exists = d.cards.some((c) => c.id === card.id)
        return {
          ...d,
          cards: exists
            ? d.cards.map((c) => (c.id === card.id ? card : c))
            : [...d.cards, card],
        }
      })
      guard(adapter.upsertCard(card))
    },
    [adapter, guard],
  )

  const deleteCard = useCallback(
    (id: string) => {
      setData((d) => ({
        ...d,
        cards: d.cards.filter((c) => c.id !== id),
        entries: d.entries.map((e) => (e.cardId === id ? { ...e, cardId: null } : e)),
      }))
      guard(adapter.deleteCard(id))
    },
    [adapter, guard],
  )

  const exportBackup = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financeiro-backup-${currentMonth()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  const importBackup = useCallback(
    (json: string): boolean => {
      const parsed = parseBackup(json)
      if (!parsed) return false
      setData(parsed)
      guard(adapter.replaceAll(parsed))
      return true
    },
    [adapter, guard],
  )

  const monthEntries = useMemo(
    () =>
      data.entries
        .filter((e) => e.month === viewedMonth)
        .sort((a, b) => (a.dueDay ?? 32) - (b.dueDay ?? 32) || a.name.localeCompare(b.name)),
    [data.entries, viewedMonth],
  )

  return {
    data,
    monthEntries,
    loading,
    syncError,
    dismissSyncError: () => setSyncError(null),
    mode: adapter.mode,
    addEntry,
    updateEntry,
    togglePaid,
    deleteEntry,
    saveCategory,
    deleteCategory,
    saveCard,
    deleteCard,
    exportBackup,
    importBackup,
  }
}
