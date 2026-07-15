export type DonutSegment = {
  label: string
  color: string
  value: number
}

type Props = {
  segments: DonutSegment[]
}

const R = 60
const CIRC = 2 * Math.PI * R

export default function DonutChart({ segments }: Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) {
    return <p className="fin-donut__empty">Sem despesas neste mês.</p>
  }

  const arcs: (DonutSegment & { dash: number; offset: number; pct: number })[] = []
  for (const s of segments) {
    const fraction = s.value / total
    const prev = arcs.length > 0 ? arcs[arcs.length - 1] : null
    arcs.push({
      ...s,
      dash: fraction * CIRC,
      offset: prev ? prev.offset + prev.dash : 0,
      pct: Math.round(fraction * 100),
    })
  }

  return (
    <div className="fin-donut">
      <svg viewBox="0 0 160 160" role="img" aria-label="Distribuição de despesas por categoria">
        <g transform="rotate(-90 80 80)">
          {arcs.map((a) => (
            <circle
              key={a.label}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={a.color}
              strokeWidth="26"
              strokeDasharray={`${a.dash} ${CIRC - a.dash}`}
              strokeDashoffset={-a.offset}
            />
          ))}
        </g>
      </svg>
      <ul className="fin-donut__legend">
        {arcs.map((a) => (
          <li key={a.label}>
            <span className="fin-donut__pct" style={{ background: a.color }}>
              {a.pct}%
            </span>
            <span>{a.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
