import type { FinData } from './types'
import { DATA_VERSION, uid } from './types'
import { generateInstallments } from './recurrence'
import { CATEGORY_PALETTE } from './palette'

const SEED_MONTH = '2026-07'

/* Categorias padrão, cada uma num slot da paleta validada */
export const DEFAULT_CATEGORY_NAMES = [
  'Casa',
  'Mercado',
  'Contas',
  'Saúde',
  'Cartões',
  'Carro',
  'Filho',
] as const

export function defaultCategoryColor(index: number): string {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]
}

/* Dados da planilha do Eduardo — Julho/2026 */
export function buildSeedData(): FinData {
  const categories = DEFAULT_CATEGORY_NAMES.map((name, i) => ({
    id: uid(),
    name,
    color: defaultCategoryColor(i),
  }))
  const byName = (name: string) => categories.find((c) => c.name === name)!.id

  const card = {
    nubank: { id: uid(), name: 'Nubank' },
    nubankPJ: { id: uid(), name: 'Nubank PJ' },
    sicredi: { id: uid(), name: 'Sicredi' },
    ml: { id: uid(), name: 'Mercado Livre' },
  }

  const luzSeries = {
    id: uid(),
    type: 'despesa' as const,
    name: 'Luz e Internet',
    categoryId: byName('Casa'),
    cardId: null,
    amountCents: 92000,
    dueDay: null,
    startMonth: SEED_MONTH,
    endMonth: null,
    skipMonths: [],
  }
  const unimedSeries = {
    id: uid(),
    type: 'despesa' as const,
    name: 'Plano Unimed',
    categoryId: byName('Saúde'),
    cardId: null,
    amountCents: 80000,
    dueDay: null,
    startMonth: SEED_MONTH,
    endMonth: null,
    skipMonths: [],
  }

  const carroBV = generateInstallments(
    {
      month: SEED_MONTH,
      type: 'despesa',
      name: 'Carro - BV',
      categoryId: byName('Carro'),
      cardId: null,
      amountCents: 112800,
      dueDate: null,
      paid: false,
      paidDate: null,
    },
    { current: 2, total: 48 },
  )

  const julho = [
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'despesa' as const,
      name: 'Luz e Internet',
      categoryId: byName('Casa'),
      cardId: null,
      amountCents: 92000,
      dueDate: null,
      paid: true,
      paidDate: null,
      installment: null,
      seriesId: luzSeries.id,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'despesa' as const,
      name: 'Plano Unimed',
      categoryId: byName('Saúde'),
      cardId: null,
      amountCents: 80000,
      dueDate: null,
      paid: true,
      paidDate: null,
      installment: null,
      seriesId: unimedSeries.id,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'despesa' as const,
      name: 'Fatura Cartão Nubank',
      categoryId: byName('Cartões'),
      cardId: card.nubank.id,
      amountCents: 161186,
      dueDate: null,
      paid: false,
      paidDate: null,
      installment: null,
      seriesId: null,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'despesa' as const,
      name: 'Cartão Mercado Livre',
      categoryId: byName('Cartões'),
      cardId: card.ml.id,
      amountCents: 65608,
      dueDate: null,
      paid: true,
      paidDate: null,
      installment: null,
      seriesId: null,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'despesa' as const,
      name: 'Fatura PJ Nubank',
      categoryId: byName('Cartões'),
      cardId: card.nubankPJ.id,
      amountCents: 52000,
      dueDate: null,
      paid: true,
      paidDate: null,
      installment: null,
      seriesId: null,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'despesa' as const,
      name: 'Fatura Cartão Sicredi',
      categoryId: byName('Cartões'),
      cardId: card.sicredi.id,
      amountCents: 16260,
      dueDate: null,
      paid: true,
      paidDate: null,
      installment: null,
      seriesId: null,
    },
  ]

  return {
    version: DATA_VERSION,
    entries: [...julho, ...carroBV],
    series: [luzSeries, unimedSeries],
    categories,
    cards: Object.values(card),
  }
}
