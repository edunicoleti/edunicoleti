import type { Entry, Installment, Series } from './types'
import { uid } from './types'
import { addMonths, compareMonths, currentMonth, dayOf, isoDate, monthRange } from './months'

/* Horizonte mínimo de materialização de séries fixas além do mês atual */
const HORIZON_MONTHS = 12

function seriesOccurrence(series: Series, month: string): Entry {
  return {
    id: uid(),
    month,
    type: series.type,
    name: series.name,
    categoryId: series.categoryId,
    cardId: series.cardId,
    amountCents: series.amountCents,
    /* O template guarda o dia-do-mês; a ocorrência ganha a data real do seu mês */
    dueDate: series.dueDay != null ? isoDate(month, series.dueDay) : null,
    paid: false,
    paidDate: null,
    installment: null,
    seriesId: series.id,
  }
}

/*
 * Garante que toda série ativa tenha ocorrências materializadas até
 * max(mês visualizado, mês atual + HORIZON). Retorna apenas as entries
 * novas (o chamador decide como persistir).
 */
export function materializeSeries(
  series: Series[],
  entries: Entry[],
  viewedMonth: string,
): Entry[] {
  const horizon = addMonths(currentMonth(), HORIZON_MONTHS)
  const limit = compareMonths(viewedMonth, horizon) > 0 ? viewedMonth : horizon

  const existing = new Set(
    entries.filter((e) => e.seriesId).map((e) => `${e.seriesId}:${e.month}`),
  )

  const created: Entry[] = []
  for (const s of series) {
    const end = s.endMonth && compareMonths(s.endMonth, limit) < 0 ? s.endMonth : limit
    if (compareMonths(s.startMonth, end) > 0) continue
    for (const month of monthRange(s.startMonth, end)) {
      if (s.skipMonths.includes(month)) continue
      if (existing.has(`${s.id}:${month}`)) continue
      created.push(seriesOccurrence(s, month))
    }
  }
  return created
}

/*
 * Gera o grupo completo de parcelas a partir da parcela lançada.
 * Ex.: base 2/48 em 2026-07 → entries de 2/48 a 48/48, uma por mês.
 */
export function generateInstallments(
  base: Omit<Entry, 'id' | 'installment' | 'seriesId'>,
  installment: Installment,
): Entry[] {
  const seriesId = uid()
  const entries: Entry[] = []
  /* Só a primeira parcela herda o estado pago da base; as futuras nascem em
     aberto. O dia do vencimento se repete a cada mês na data de cada parcela. */
  const day = base.dueDate != null ? dayOf(base.dueDate) : null
  for (let i = installment.current; i <= installment.total; i++) {
    const first = i === installment.current
    const month = addMonths(base.month, i - installment.current)
    entries.push({
      ...base,
      id: uid(),
      month,
      dueDate: day != null ? isoDate(month, day) : null,
      paid: first ? base.paid : false,
      paidDate: first ? base.paidDate : null,
      installment: { current: i, total: installment.total },
      seriesId,
    })
  }
  return entries
}
