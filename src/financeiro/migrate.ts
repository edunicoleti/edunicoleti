import type { Category, FinData } from './types'
import { DATA_VERSION, uid } from './types'
import { isoDate } from './months'
import { CATEGORY_PALETTE } from './palette'
import { DEFAULT_CATEGORY_NAMES, defaultCategoryColor } from './seed'

/* Formato v1: o tipo carregava a distinção fixa/variável */
type LegacyType = 'receita' | 'fixa' | 'variavel' | 'despesa'

function migrateType(type: LegacyType): 'receita' | 'despesa' {
  return type === 'receita' ? 'receita' : 'despesa'
}

/*
 * v1 → v2
 * - 'fixa'/'variavel' colapsam em 'despesa' (a recorrência já vive na série
 *   e nas parcelas, então o tipo era informação duplicada)
 * - garante a categoria "Filho"
 * - reatribui cores: a paleta v1 reprovava no validador (indigo e violeta
 *   colapsavam sob protanopia, ΔE 3.5)
 */
function migrateV1toV2(data: FinData): FinData {
  const entries = data.entries.map((e) => ({
    ...e,
    type: migrateType(e.type as LegacyType),
  }))
  const series = data.series.map((s) => ({
    ...s,
    type: migrateType(s.type as LegacyType),
  }))

  /* Categorias padrão ficam no seu slot; as criadas pelo usuário pegam os
     slots restantes, sem nunca gerar um hue fora da paleta validada */
  let nextSlot = DEFAULT_CATEGORY_NAMES.length
  const categories: Category[] = data.categories.map((c) => {
    const defaultIndex = DEFAULT_CATEGORY_NAMES.indexOf(
      c.name as (typeof DEFAULT_CATEGORY_NAMES)[number],
    )
    if (defaultIndex >= 0) return { ...c, color: defaultCategoryColor(defaultIndex) }
    const color = CATEGORY_PALETTE[nextSlot % CATEGORY_PALETTE.length]
    nextSlot += 1
    return { ...c, color }
  })

  /* Só garante a Filho: recriar toda categoria padrão ausente ressuscitaria
     as que o usuário apagou de propósito */
  const filhoIndex = DEFAULT_CATEGORY_NAMES.indexOf('Filho')
  if (!categories.some((c) => c.name === 'Filho')) {
    categories.push({
      id: uid(),
      name: 'Filho',
      color: defaultCategoryColor(filhoIndex),
    })
  }

  return { version: 2, entries, series, categories, cards: data.cards }
}

/*
 * v2 → v3
 * - o vencimento do lançamento vira data completa: dueDay (só o dia) → dueDate
 *   ('YYYY-MM-DD'), montada a partir do mês do lançamento. Sem dia → null.
 * - novo paidDate (quando quitou): desconhecido no histórico, fica null.
 * - a série mantém dueDay (dia-do-mês recorrente); nada a fazer nela.
 */
function migrateV2toV3(data: FinData): FinData {
  const entries = data.entries.map((raw) => {
    const e = raw as unknown as {
      month: string
      dueDay?: number | null
      dueDate?: string | null
      paidDate?: string | null
    } & Record<string, unknown>
    const dueDate = e.dueDate ?? (e.dueDay != null ? isoDate(e.month, e.dueDay) : null)
    const next: Record<string, unknown> = { ...e, dueDate, paidDate: e.paidDate ?? null }
    delete next.dueDay
    return next as unknown as FinData['entries'][number]
  })
  return { ...data, version: 3, entries }
}

export function migrate(data: FinData): FinData {
  let d = data
  if (d.version < 2) d = migrateV1toV2(d)
  if (d.version < 3) d = migrateV2toV3(d)
  return d.version === DATA_VERSION ? d : { ...d, version: DATA_VERSION }
}
