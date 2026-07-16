import { useMemo } from 'react'
import type { Entry } from '../types'
import { formatBRL } from '../money'
import { compareMonths, currentMonth, monthShortWithYear } from '../months'

type Props = {
  entries: Entry[]
}

type InstallmentGroup = {
  seriesId: string
  name: string
  total: number
  /* próxima parcela em aberto (a partir do mês atual real) */
  nextCurrent: number | null
  remainingCount: number
  remainingCents: number
  endMonth: string
}

/*
 * "Faltam" é sempre relativo ao mês de hoje (não ao mês navegado): a dívida
 * restante é um fato do presente, independente de qual mês está na tela.
 */
function buildGroups(entries: Entry[]): InstallmentGroup[] {
  const today = currentMonth()
  const bySeries = new Map<string, Entry[]>()
  for (const e of entries) {
    if (!e.installment || !e.seriesId) continue
    const list = bySeries.get(e.seriesId) ?? []
    list.push(e)
    bySeries.set(e.seriesId, list)
  }

  const groups: InstallmentGroup[] = []
  for (const [seriesId, list] of bySeries) {
    const pending = list.filter(
      (e) => !e.paid && compareMonths(e.month, today) >= 0,
    )
    if (pending.length === 0) continue
    pending.sort((a, b) => compareMonths(a.month, b.month))
    const last = list.reduce((max, e) => (compareMonths(e.month, max.month) > 0 ? e : max))
    groups.push({
      seriesId,
      name: last.name,
      total: last.installment!.total,
      nextCurrent: pending[0].installment!.current,
      remainingCount: pending.length,
      remainingCents: pending.reduce((sum, e) => sum + e.amountCents, 0),
      endMonth: last.month,
    })
  }
  return groups.sort((a, b) => b.remainingCents - a.remainingCents)
}

export default function InstallmentsPanel({ entries }: Props) {
  const groups = useMemo(() => buildGroups(entries), [entries])

  if (groups.length === 0) return null

  const totalCents = groups.reduce((sum, g) => sum + g.remainingCents, 0)

  return (
    <section className="fin-panel">
      <h2>Parcelamentos ativos</h2>
      <ul className="fin-installments">
        {groups.map((g) => (
          <li key={g.seriesId}>
            <div className="fin-installments__head">
              <span className="fin-installments__name">{g.name}</span>
              <strong>{formatBRL(g.remainingCents)}</strong>
            </div>
            <div className="fin-installments__meta">
              <span>
                {g.nextCurrent}/{g.total} · faltam {g.remainingCount}
              </span>
              <span>termina {monthShortWithYear(g.endMonth)}</span>
            </div>
            {/* Barra de progresso: quanto do parcelamento já ficou para trás */}
            <div
              className="fin-installments__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={g.total}
              aria-valuenow={g.total - g.remainingCount}
              aria-label={`${g.name}: ${g.total - g.remainingCount} de ${g.total} parcelas quitadas`}
            >
              <div
                className="fin-installments__fill"
                style={{ width: `${((g.total - g.remainingCount) / g.total) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {groups.length > 1 && (
        <footer className="fin-installments__total">
          <span>Total restante</span>
          <strong>{formatBRL(totalCents)}</strong>
        </footer>
      )}
    </section>
  )
}
