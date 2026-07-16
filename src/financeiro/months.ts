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
