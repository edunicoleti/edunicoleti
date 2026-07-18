import type { Category, Entry } from './types'
import { formatBRL } from './money'
import { addMonths, monthShortLabel } from './months'

/*
 * Motor de alertas por regras — determinístico, sem IA, sem custo. Uma função
 * pura sobre os dados que o app já tem: histórico, projeção de fixas/parcelas
 * e receita. Tudo aqui é verificável e roda offline.
 */

export type AlertSeverity = 'danger' | 'warning' | 'info'

export type Alert = {
  id: string
  severity: AlertSeverity
  title: string
  detail: string
}

/* Limiares — escolhidos para avisar sem virar ruído. Ajustáveis num ponto só. */
const COMMIT_WARN = 0.6 // 60% da renda comprometida com fixas + parcelas
const COMMIT_DANGER = 0.85
const SPIKE_RATIO = 1.3 // categoria 30% acima da média histórica
const SPIKE_FLOOR_CENTS = 10000 // e pelo menos R$ 100 acima, senão é ruído
const SPIKE_HISTORY_MONTHS = 3
const FUTURE_HORIZON = 6

const SEVERITY_RANK: Record<AlertSeverity, number> = { danger: 0, warning: 1, info: 2 }

type MonthSums = { receita: number; despesas: number; committed: number }

function sumMonth(entries: Entry[], month: string): MonthSums {
  let receita = 0
  let despesas = 0
  let committed = 0 // fixas (série) + parcelas — a parte previsível da despesa
  for (const e of entries) {
    if (e.month !== month) continue
    if (e.type === 'receita') {
      receita += e.amountCents
    } else {
      despesas += e.amountCents
      if (e.seriesId || e.installment) committed += e.amountCents
    }
  }
  return { receita, despesas, committed }
}

function categorySpend(entries: Entry[], month: string, categoryId: string): number {
  let sum = 0
  for (const e of entries) {
    if (e.month !== month || e.type === 'receita' || (e.categoryId ?? '') !== categoryId) {
      continue
    }
    sum += e.amountCents
  }
  return sum
}

export function computeAlerts(
  entries: Entry[],
  categories: Category[],
  viewedMonth: string,
): Alert[] {
  const alerts: Alert[] = []

  /* 1. Gargalo futuro: meses dos próximos 6 em que o comprometido passa da
        receita. Só conta quando há receita projetada para comparar. */
  const overrun: string[] = []
  for (let i = 1; i <= FUTURE_HORIZON; i++) {
    const m = addMonths(viewedMonth, i)
    const { receita, despesas } = sumMonth(entries, m)
    if (receita > 0 && despesas > receita) overrun.push(m)
  }
  if (overrun.length > 0) {
    alerts.push({
      id: 'future-overrun',
      severity: 'danger',
      title:
        overrun.length === 1
          ? 'Um mês à frente fecha no vermelho'
          : `${overrun.length} dos próximos 6 meses fecham no vermelho`,
      detail: `Despesas acima da receita em: ${overrun.map(monthShortLabel).join(', ')}.`,
    })
  }

  /* 2. Comprometimento da renda do mês visto com fixas + parcelas. */
  const cur = sumMonth(entries, viewedMonth)
  if (cur.receita > 0 && cur.committed > 0) {
    const ratio = cur.committed / cur.receita
    if (ratio >= COMMIT_WARN) {
      alerts.push({
        id: 'income-commitment',
        severity: ratio >= COMMIT_DANGER ? 'danger' : 'warning',
        title: `${Math.round(ratio * 100)}% da renda comprometida`,
        detail: `Contas fixas e parcelas somam ${formatBRL(cur.committed)} da sua receita de ${formatBRL(cur.receita)} neste mês.`,
      })
    }
  }

  /* 3. Categorias bem acima da própria média dos últimos meses. */
  const currentByCategory = new Map<string, number>()
  for (const e of entries) {
    if (e.month !== viewedMonth || e.type === 'receita') continue
    const key = e.categoryId ?? ''
    currentByCategory.set(key, (currentByCategory.get(key) ?? 0) + e.amountCents)
  }

  const spikes: { categoryId: string; current: number; avg: number; delta: number }[] = []
  for (const [categoryId, current] of currentByCategory) {
    const past: number[] = []
    for (let i = 1; i <= SPIKE_HISTORY_MONTHS; i++) {
      const sum = categorySpend(entries, addMonths(viewedMonth, -i), categoryId)
      if (sum > 0) past.push(sum) // só meses com gasto entram na média
    }
    if (past.length === 0) continue
    const avg = past.reduce((a, b) => a + b, 0) / past.length
    const delta = current - avg
    if (current >= avg * SPIKE_RATIO && delta >= SPIKE_FLOOR_CENTS) {
      spikes.push({ categoryId, current, avg, delta })
    }
  }
  spikes.sort((a, b) => b.delta - a.delta)
  for (const s of spikes.slice(0, 2)) {
    const cat = categories.find((c) => c.id === s.categoryId)
    const pct = Math.round((s.current / s.avg - 1) * 100)
    alerts.push({
      id: `spike-${s.categoryId || 'sem-categoria'}`,
      severity: 'warning',
      title: `${cat?.name ?? 'Sem categoria'} acima da média`,
      detail: `${formatBRL(s.current)} neste mês — ${pct}% acima da média de ${formatBRL(Math.round(s.avg))}.`,
    })
  }

  return alerts.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
}
