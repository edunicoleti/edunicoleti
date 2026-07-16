import { useMemo } from 'react'
import {
  Bar, ComposedChart, LabelList, Line, ResponsiveContainer, Tooltip, XAxis,
} from 'recharts'
import type { Entry } from '../types'
import { formatBRL } from '../money'
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

/* Rótulo compacto em reais no topo da barra ("2.848") */
function compact(cents: number): string {
  return Math.round(cents / 100).toLocaleString('pt-BR')
}

function ProjectionTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: MonthPoint }[]
}) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="fin-projection__tooltip">
      <strong>{monthLabel(p.month)}</strong>
      <span>Comprometido: {formatBRL(p.despesas)}</span>
      {p.receita > 0 && <span>Receita: {formatBRL(p.receita)}</span>}
    </div>
  )
}

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

  if (points.every((p) => p.despesas === 0 && p.receita === 0)) {
    return <p className="fin-donut__empty">Nada comprometido nos próximos meses.</p>
  }

  return (
    <div className="fin-projection" title="Clique num mês para abri-lo">
      <ResponsiveContainer width="100%" height={150}>
        <ComposedChart data={points} margin={{ top: 18, right: 4, bottom: 0, left: 4 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: '#898781' }}
            interval={0}
          />
          <Tooltip content={<ProjectionTooltip />} cursor={{ fill: 'rgba(32, 71, 201, 0.06)' }} />
          <Bar
            dataKey="despesas"
            fill="#2047C9"
            radius={[4, 4, 0, 0]}
            barSize={24}
            isAnimationActive={false}
            cursor="pointer"
            onClick={(d) => onSelectMonth((d as unknown as MonthPoint).month)}
          >
            <LabelList
              dataKey="despesas"
              position="top"
              formatter={(v) => (typeof v === 'number' && v > 0 ? compact(v) : '')}
              style={{ fontSize: 9, fill: '#898781' }}
            />
          </Bar>
          {hasReceita && (
            <Line
              dataKey="receita"
              stroke="#16A34A"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#16A34A', strokeWidth: 0 }}
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      {hasReceita && (
        <p className="fin-projection__legend">
          <span className="fin-projection__key fin-projection__key--bar" /> comprometido
          <span className="fin-projection__key fin-projection__key--line" /> receita
        </p>
      )}
    </div>
  )
}
