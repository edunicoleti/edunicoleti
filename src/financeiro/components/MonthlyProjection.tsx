import { useMemo } from 'react'
import type { Entry } from '../types'
import { addMonths, monthLabel, monthShortLabel, monthShortWithYear } from '../months'

type Props = {
  entries: Entry[]
  /* mês em exibição — a projeção mostra os 6 seguintes */
  baseMonth: string
  onSelectMonth: (month: string) => void
}

type MonthPoint = {
  month: string
  label: string
  despesas: number
  receita: number
}

/* Projeção não precisa de centavos — só atrapalham a leitura */
const brlNoCents = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export default function MonthlyProjection({ entries, baseMonth, onSelectMonth }: Props) {
  const points = useMemo<MonthPoint[]>(() => {
    const baseYear = baseMonth.slice(0, 4)
    return Array.from({ length: 6 }, (_, i) => {
      const month = addMonths(baseMonth, i + 1)
      let despesas = 0
      let receita = 0
      for (const e of entries) {
        if (e.month !== month) continue
        if (e.type === 'receita') receita += e.amountCents
        else despesas += e.amountCents
      }
      return {
        month,
        label:
          month.slice(0, 4) === baseYear ? monthShortLabel(month) : monthShortWithYear(month),
        despesas,
        receita,
      }
    })
  }, [entries, baseMonth])

  const hasReceita = points.some((p) => p.receita > 0)
  /* Escala única para todas as barras: o maior valor (gasto ou receita) = 100% */
  const max = Math.max(...points.map((p) => Math.max(p.despesas, p.receita)), 1)

  if (points.every((p) => p.despesas === 0 && p.receita === 0)) {
    return <p className="fin-donut__empty">Nada comprometido nos próximos meses.</p>
  }

  return (
    <div className="fin-projection">
      <ul>
        {points.map((p) => {
          const over = p.receita > 0 && p.despesas > p.receita
          const tooltip =
            `${monthLabel(p.month)} — comprometido ${brlNoCents.format(p.despesas / 100)}` +
            (p.receita > 0 ? ` · receita ${brlNoCents.format(p.receita / 100)}` : '') +
            (over ? ' · acima da receita!' : '')
          return (
            <li key={p.month}>
              <button type="button" title={tooltip} onClick={() => onSelectMonth(p.month)}>
                <span className="fin-projection__month">{p.label}</span>
                <span className="fin-projection__track">
                  <span
                    className={
                      over
                        ? 'fin-projection__fill fin-projection__fill--over'
                        : 'fin-projection__fill'
                    }
                    style={{ width: `${(p.despesas / max) * 100}%` }}
                  />
                  {p.receita > 0 && (
                    <span
                      className="fin-projection__income"
                      style={{ left: `${(p.receita / max) * 100}%` }}
                    />
                  )}
                </span>
                <span
                  className={
                    over ? 'fin-projection__value fin-projection__value--over' : 'fin-projection__value'
                  }
                >
                  {brlNoCents.format(p.despesas / 100)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="fin-projection__legend">
        barra = comprometido
        {hasReceita && (
          <>
            {' · '}
            <span className="fin-projection__income-key" /> receita
          </>
        )}
        {' · '}clique abre o mês
      </p>
    </div>
  )
}
