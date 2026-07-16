import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'
import type { PieLabelRenderProps, PieSectorShapeProps } from 'recharts/types/polar/Pie'
import { formatBRL } from '../money'
import { OTHER_COLOR, inkOn } from '../palette'

export type DonutSegment = {
  label: string
  color: string
  value: number
}

type Props = {
  segments: DonutSegment[]
}

/* Donut só é honesto para parte-do-todo à primeira vista e com poucas fatias:
   além de 6 a cauda vira "Outras" em cinza, nunca um 9º hue gerado. */
const MAX_SLICES = 6

/* Abaixo disso o rótulo não cabe dentro do anel — fica só na legenda/centro */
const MIN_LABEL_PCT = 7

function foldTail(segments: DonutSegment[]): DonutSegment[] {
  if (segments.length <= MAX_SLICES) return segments
  const head = segments.slice(0, MAX_SLICES - 1)
  const tail = segments.slice(MAX_SLICES - 1)
  return [
    ...head,
    {
      label: 'Outras',
      color: OTHER_COLOR,
      value: tail.reduce((sum, s) => sum + s.value, 0),
    },
  ]
}

export default function CategoryDonut({ segments }: Props) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null)

  const data = useMemo(() => foldTail(segments), [segments])
  const total = useMemo(() => data.reduce((sum, s) => sum + s.value, 0), [data])

  if (total === 0) {
    return <p className="fin-donut__empty">Sem despesas neste mês.</p>
  }

  const withPct = data.map((s) => ({ ...s, pct: (s.value / total) * 100 }))
  const focused = withPct.find((s) => s.label === activeLabel) ?? null

  /* A fatia ativa cresce 6px — sem borda, o respiro vem do paddingAngle */
  const renderSector = (props: PieSectorShapeProps) => {
    const isActive = (props.payload as DonutSegment | undefined)?.label === activeLabel
    const outerRadius = props.outerRadius ?? 0
    return <Sector {...props} outerRadius={isActive ? outerRadius + 6 : outerRadius} />
  }

  const renderLabel = (props: PieLabelRenderProps) => {
    const pct = (props.percent ?? 0) * 100
    if (pct < MIN_LABEL_PCT) return <g />
    const cx = Number(props.cx ?? 0)
    const cy = Number(props.cy ?? 0)
    const inner = Number(props.innerRadius ?? 0)
    const outer = Number(props.outerRadius ?? 0)
    const radius = inner + (outer - inner) * 0.5
    const rad = -(props.midAngle ?? 0) * (Math.PI / 180)
    return (
      <text
        x={cx + radius * Math.cos(rad)}
        y={cy + radius * Math.sin(rad)}
        fill={inkOn(String(props.fill ?? '#000000'))}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={600}
        pointerEvents="none"
      >
        {Math.round(pct)}%
      </text>
    )
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
              labelLine={false}
              label={renderLabel}
              isAnimationActive={false}
              onMouseEnter={(d) => setActiveLabel((d as unknown as DonutSegment).label)}
              onMouseLeave={() => setActiveLabel(null)}
              /* Mobile não tem hover: tocar a fatia foca, tocar de novo solta */
              onClick={(d) => {
                const label = (d as unknown as DonutSegment).label
                setActiveLabel((cur) => (cur === label ? null : label))
              }}
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
        {withPct.map((s) => (
          <li key={s.label}>
            <button
              type="button"
              className={activeLabel === s.label ? 'active' : ''}
              aria-pressed={activeLabel === s.label}
              onMouseEnter={() => setActiveLabel(s.label)}
              onMouseLeave={() => setActiveLabel(null)}
              onFocus={() => setActiveLabel(s.label)}
              onBlur={() => setActiveLabel(null)}
              onClick={() =>
                setActiveLabel((cur) => (cur === s.label ? null : s.label))
              }
            >
              <span className="fin-donut__swatch" style={{ background: s.color }} />
              <span className="fin-donut__name">{s.label}</span>
              <span className="fin-donut__value">{formatBRL(s.value)}</span>
              <span className="fin-donut__pct">{Math.round(s.pct)}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
