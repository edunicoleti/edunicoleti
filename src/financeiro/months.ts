const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function addMonths(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const total = y * 12 + (m - 1) + delta
  const ny = Math.floor(total / 12)
  const nm = (total % 12) + 1
  return `${ny}-${String(nm).padStart(2, '0')}`
}

export function compareMonths(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

export function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} de ${y}`
}

const MONTH_SHORT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

export function monthShortLabel(month: string): string {
  const [, m] = month.split('-').map(Number)
  return MONTH_SHORT[m - 1]
}

/* "mai/30" — para rótulos compactos que precisam do ano */
export function monthShortWithYear(month: string): string {
  const [y] = month.split('-')
  return `${monthShortLabel(month)}/${y.slice(2)}`
}

/* ---------- Datas completas ('YYYY-MM-DD') ---------- */

/* O mês (balde) de uma data */
export function monthOf(date: string): string {
  return date.slice(0, 7)
}

/* O dia do mês de uma data */
export function dayOf(date: string): number {
  return Number(date.slice(8, 10))
}

/* Monta 'YYYY-MM-DD' a partir de mês + dia, com clamp para o fim do mês curto
   (dia 31 em fevereiro cai no último dia real). */
export function isoDate(month: string, day: number): string {
  const [y, m] = month.split('-').map(Number)
  const last = new Date(y, m, 0).getDate()
  const d = Math.min(Math.max(day, 1), last)
  return `${month}-${String(d).padStart(2, '0')}`
}

export function todayISO(): string {
  const n = new Date()
  const m = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
  return `${m}-${String(n.getDate()).padStart(2, '0')}`
}

/* "05/06" — data curta para a linha */
export function shortDate(date: string): string {
  return `${String(dayOf(date)).padStart(2, '0')}/${date.slice(5, 7)}`
}

/* Lista de meses de start até end, inclusive */
export function monthRange(start: string, end: string): string[] {
  const months: string[] = []
  let cur = start
  while (compareMonths(cur, end) <= 0) {
    months.push(cur)
    cur = addMonths(cur, 1)
  }
  return months
}
