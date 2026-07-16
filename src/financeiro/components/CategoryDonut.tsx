import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'
import type { PieSectorShapeProps } from 'recharts/types/polar/Pie'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatBRL } from '../money'
import { OTHER_COLOR } from '../palette'

export type DonutSegment = {
  /* null = agregado "Outras" ou sem categoria — não filtrável */
  id: string | null
  label: string
  color: string
  value: number
  /* valor da mesma categoria no mês anterior; null = sem base de comparação */
  previousValue: number | null
}

type Props = {
  segments: DonutSegment[]
  /* categoria selecionada (filtra a lista); clique alterna */
  selectedId: string | null
  onSelect: (id: string | null) => void
}

/* Donut só é honesto para parte-do-todo à primeira vista e com poucas fatias:
   além de 6 a cauda vira "Outras" em cinza, nunca um 9º hue gerado. */
const MAX_SLICES = 6

/* Variação abaixo disso é ruído de arredondamento, não tendência */
const MIN_DELTA_PCT = 1

function foldTail(segments: DonutSegment[]): DonutSegment[] {
  if (segments.length <= MAX_SLICES) return segments
  const head = segments.slice(0, MAX_SLICES - 1)
  const tail = segments.slice(MAX_SLICES - 1)
  return [
    ...head,
    {
      id: null,
      label: 'Outras',
      color: OTHER_COLOR,
      value: tail.reduce((sum, s) => sum + s.value, 0),
      previousValue: null,
    },
  ]
}

function deltaPct(s: DonutSegment): number | null {
  if (s.previousValue === null || s.previousValue === 0) return null
  const pct = ((s.value - s.previousValue) / s.previousValue) * 100
  return Math.abs(pct) < MIN_DELTA_PCT ? null : pct
}

export default function CategoryDonut({ segments, selectedId, onSelect }: Props) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null)

  const data = useMemo(() => foldTail(segments), [segments])
  const total = useMemo(() => data.reduce((sum, s) => sum + s.value, 0), [data])

  if (total === 0) {
    return <p className="fin-donut__empty">Sem despesas neste mês.</p>
  }

  const withPct = data.map((s) => ({ ...s, pct: (s.value / total) * 100 }))
  const selected = withPct.find((s) => s.id !== null && s.id === selectedId) ?? null
  /* hover tem prioridade visual; seleção persiste quando o mouse sai */
  const focused = withPct.find((s) => s.label === hoverLabel) ?? selected

  const activeLabel = focused?.label ?? null

  /* A fatia ativa cresce 6px — sem borda, o respiro vem do paddingAngle */
  const renderSector = (props: PieSectorShapeProps) => {
    const isActive = (props.payload as DonutSegment | undefined)?.label === activeLabel
    const outerRadius = props.outerRadius ?? 0
    return <Sector {...props} outerRadius={isActive ? outerRadius + 6 : outerRadius} />
  }

  const toggleSelect = (s: DonutSegment) => {
    if (s.id === null) return
    onSelect(selectedId === s.id ? null : s.id)
  }

  return (
    <div className="fin-donut">
      <div className="fin-donut__plot">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={withPct}
              dataKey="value"
              nameKey="label"
              innerRadius="60%"
              outerRadius="86%"
              paddingAngle={2}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              shape={renderSector}
              isAnimationActive={false}
              onMouseEnter={(d) => setHoverLabel((d as unknown as DonutSegment).label)}
              onMouseLeave={() => setHoverLabel(null)}
              onClick={(d) => toggleSelect(d as unknown as DonutSegment)}
            >
              {withPct.map((s) => (
                <Cell key={s.label} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Figura central: total do mês, ou a fatia em foco */}
        <div className="fin-donut__center" aria-hidden="true">
          <span className="fin-donut__center-label">
            {focused ? focused.label : 'Total'}
          </span>
          <strong className="fin-donut__center-value">
            {formatBRL(focused ? focused.value : total)}
          </strong>
          <span className="fin-donut__center-pct">
            {focused ? `${Math.round(focused.pct)}%` : 'do mês'}
          </span>
        </div>
      </div>

      {/* A legenda é o canal de alívio e o table view: identidade nunca fica só
          na cor, e todo valor é legível sem depender de hover. */}
      <ul className="fin-donut__legend">
        {withPct.map((s) => {
          const delta = deltaPct(s)
          const isSelected = s.id !== null && s.id === selectedId
          return (
            <li key={s.label}>
              <button
                type="button"
                className={isSelected || hoverLabel === s.label ? 'active' : ''}
                aria-pressed={isSelected}
                title={s.id ? 'Filtrar a lista por esta categoria' : undefined}
                onMouseEnter={() => setHoverLabel(s.label)}
                onMouseLeave={() => setHoverLabel(null)}
                onFocus={() => setHoverLabel(s.label)}
                onBlur={() => setHoverLabel(null)}
                onClick={() => toggleSelect(s)}
              >
                <span className="fin-donut__swatch" style={{ background: s.color }} />
                <span className="fin-donut__name">{s.label}</span>
                {delta !== null && (
                  <span
                    className="fin-donut__delta"
                    title={`${delta > 0 ? '+' : ''}${Math.round(delta)}% vs mês anterior`}
                  >
                    {delta > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {Math.abs(Math.round(delta))}%
                  </span>
                )}
                <span className="fin-donut__value">{formatBRL(s.value)}</span>
                <span className="fin-donut__pct">{Math.round(s.pct)}%</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
