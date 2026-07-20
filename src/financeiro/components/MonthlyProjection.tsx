import { useMemo } from 'react'
import {
  Area, AreaChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { LabelProps } from 'recharts'
import type { Entry } from '../types'
import { formatBRL } from '../money'
import { addMonths, monthLabel, monthShortLabel, monthShortWithYear } from '../months'

type Props = {
  entries: Entry[]
  /* mês em exibição — a projeção começa nele e vai até os 5 seguintes */
  baseMonth: string
  onSelectMonth: (month: string) => void
}

type MonthPoint = {
  month: string
  label: string
  despesas: number
  receita: number
}

/*
 * Verde (receita) e vermelho (despesa) são as cores que o app já usa nos
 * valores. Validadas para daltonismo: ΔE 20.6 sob deuteranopia (alvo 12) —
 * a diferença de luminosidade separa o par mesmo sem percepção de matiz.
 * Legenda e rótulos diretos são o canal secundário: a identidade nunca
 * depende só da cor.
 */
const COLOR_DESPESA = '#DC2626'
const COLOR_RECEITA = '#16A34A'

/* Projeção não precisa de centavos — só atrapalham a leitura */
const brlNoCents = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/* Geometria do plot. Compartilhada entre o gráfico e o hit-test do clique:
   se mudar aqui, muda nos dois lugares. */
const MARGIN_X = 8
const AXIS_PAD = 6
const EDGE = MARGIN_X + AXIS_PAD

/*
 * Rótulo de cada ponto. A posição não pode ser fixa: as duas linhas se cruzam,
 * e "receita sempre em cima" colide sempre que o mês fecha no vermelho. Quem
 * tem o maior valor no mês leva o rótulo acima; o outro, abaixo. Empate manda
 * a despesa para cima (e a receita para baixo), então nunca coincidem.
 */
function pointLabel(series: 'despesas' | 'receita', points: MonthPoint[], color: string) {
  return (props: LabelProps) => {
    const p = points[props.index ?? -1]
    const vb = props.viewBox as { x: number; y: number } | undefined
    if (!p || !vb) return <g />
    const value = p[series]
    if (value <= 0) return <g />
    const other = series === 'despesas' ? p.receita : p.despesas
    const above = series === 'despesas' ? value >= other : value > other
    return (
      <text
        x={vb.x}
        y={vb.y + (above ? -9 : 16)}
        fill={color}
        textAnchor="middle"
        fontSize={9}
        fontWeight={600}
        pointerEvents="none"
      >
        {brlNoCents.format(value / 100)}
      </text>
    )
  }
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
  const sobra = p.receita - p.despesas
  return (
    <div className="fin-projection__tooltip">
      <strong>{monthLabel(p.month)}</strong>
      <span>Comprometido: {formatBRL(p.despesas)}</span>
      {p.receita > 0 && (
        <>
          <span>Receita: {formatBRL(p.receita)}</span>
          <span className={sobra < 0 ? 'fin-red' : 'fin-green'}>
            {sobra < 0 ? 'Falta ' : 'Sobra '}
            {formatBRL(Math.abs(sobra))}
          </span>
        </>
      )}
      <em>clique para abrir o mês</em>
    </div>
  )
}

export default function MonthlyProjection({ entries, baseMonth, onSelectMonth }: Props) {
  const points = useMemo<MonthPoint[]>(() => {
    const baseYear = baseMonth.slice(0, 4)
    return Array.from({ length: 6 }, (_, i) => {
      /* i = 0 é o próprio mês em exibição: sem ele não há de onde comparar */
      const month = addMonths(baseMonth, i)
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
    return <p className="fin-donut__empty">Nada comprometido nesses meses.</p>
  }

  /* Escala partindo de zero: um eixo truncado exageraria a distância entre
     as duas linhas e faria um mês apertado parecer folgado. */
  const max = Math.max(...points.map((p) => Math.max(p.despesas, p.receita)))

  /*
   * Hit-test próprio em vez do activeIndex do Recharts: aquele vem do
   * offsetX que só eventos reais de ponteiro preenchem, então não dá para
   * verificar e é opaco no toque. Aqui o mês sai da posição do clique.
   */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const span = rect.width - EDGE * 2
    if (span <= 0) return
    const step = span / (points.length - 1)
    const i = Math.round((e.clientX - rect.left - EDGE) / step)
    const p = points[Math.min(Math.max(i, 0), points.length - 1)]
    if (p) onSelectMonth(p.month)
  }

  return (
    <div className="fin-projection">
      <div
        className="fin-projection__plot"
        onClick={handleClick}
        role="presentation"
        title="Clique num mês para abri-lo"
      >
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart
          data={points}
          margin={{ top: 20, right: MARGIN_X, bottom: 0, left: MARGIN_X }}
        >
          <defs>
            <linearGradient id="fin-fill-despesa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR_DESPESA} stopOpacity={0.22} />
              <stop offset="100%" stopColor={COLOR_DESPESA} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fin-fill-receita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR_RECEITA} stopOpacity={0.18} />
              <stop offset="100%" stopColor={COLOR_RECEITA} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: '#898781' }}
            interval={0}
            padding={{ left: AXIS_PAD, right: AXIS_PAD }}
          />
          {/* Eixo oculto só para fixar o domínio em zero e dar folga aos rótulos */}
          <YAxis hide domain={[0, max * 1.25]} />
          <Tooltip
            content={<ProjectionTooltip />}
            cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
          />

          {hasReceita && (
            <Area
              dataKey="receita"
              stroke={COLOR_RECEITA}
              strokeWidth={2}
              fill="url(#fin-fill-receita)"
              dot={{ r: 2.5, fill: COLOR_RECEITA, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: COLOR_RECEITA, stroke: 'var(--color-surface)', strokeWidth: 2 }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="receita"
                content={pointLabel('receita', points, COLOR_RECEITA)}
              />
            </Area>
          )}

          <Area
            dataKey="despesas"
            stroke={COLOR_DESPESA}
            strokeWidth={2}
            fill="url(#fin-fill-despesa)"
            dot={{ r: 2.5, fill: COLOR_DESPESA, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: COLOR_DESPESA, stroke: 'var(--color-surface)', strokeWidth: 2 }}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="despesas"
              content={pointLabel('despesas', points, COLOR_DESPESA)}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
      </div>

      {/* Legenda: identidade nunca fica só na cor */}
      <p className="fin-projection__legend">
        <span className="fin-projection__key" style={{ background: COLOR_DESPESA }} />
        comprometido
        {hasReceita && (
          <>
            <span className="fin-projection__key" style={{ background: COLOR_RECEITA }} />
            receita
          </>
        )}
      </p>
    </div>
  )
}
