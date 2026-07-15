import type { FinData } from './types'
import { uid } from './types'
import { generateInstallments } from './recurrence'

const SEED_MONTH = '2026-07'

/* Dados da planilha do Eduardo — Julho/2026 */
export function buildSeedData(): FinData {
  const cat = {
    casa: { id: uid(), name: 'Casa', color: '#2047C9' },
    cartoes: { id: uid(), name: 'Cartões', color: '#7C3AED' },
    carro: { id: uid(), name: 'Carro', color: '#DC2626' },
    saude: { id: uid(), name: 'Saúde', color: '#16A34A' },
    mercado: { id: uid(), name: 'Mercado', color: '#0EA5E9' },
    contas: { id: uid(), name: 'Contas', color: '#4F46E5' },
  }
  const card = {
    nubank: { id: uid(), name: 'Nubank' },
    nubankPJ: { id: uid(), name: 'Nubank PJ' },
    sicredi: { id: uid(), name: 'Sicredi' },
    ml: { id: uid(), name: 'Mercado Livre' },
  }

  const luzSeries = {
    id: uid(),
    type: 'fixa' as const,
    name: 'Luz e Internet',
    categoryId: cat.casa.id,
    cardId: null,
    amountCents: 92000,
    dueDay: null,
    startMonth: SEED_MONTH,
    endMonth: null,
    skipMonths: [],
  }
  const unimedSeries = {
    id: uid(),
    type: 'fixa' as const,
    name: 'Plano Unimed',
    categoryId: cat.saude.id,
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
      type: 'fixa',
      name: 'Carro - BV',
      categoryId: cat.carro.id,
      cardId: null,
      amountCents: 112800,
      dueDay: null,
      paid: false,
    },
    { current: 2, total: 48 },
  )

  const julho = [
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'fixa' as const,
      name: 'Luz e Internet',
      categoryId: cat.casa.id,
      cardId: null,
      amountCents: 92000,
      dueDay: null,
      paid: true,
      installment: null,
      seriesId: luzSeries.id,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'fixa' as const,
      name: 'Plano Unimed',
      categoryId: cat.saude.id,
      cardId: null,
      amountCents: 80000,
      dueDay: null,
      paid: true,
      installment: null,
      seriesId: unimedSeries.id,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'variavel' as const,
      name: 'Fatura Cartão Nubank',
      categoryId: cat.cartoes.id,
      cardId: card.nubank.id,
      amountCents: 161186,
      dueDay: null,
      paid: false,
      installment: null,
      seriesId: null,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'variavel' as const,
      name: 'Cartão Mercado Livre',
      categoryId: cat.cartoes.id,
      cardId: card.ml.id,
      amountCents: 65608,
      dueDay: null,
      paid: true,
      installment: null,
      seriesId: null,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'variavel' as const,
      name: 'Fatura PJ Nubank',
      categoryId: cat.cartoes.id,
      cardId: card.nubankPJ.id,
      amountCents: 52000,
      dueDay: null,
      paid: true,
      installment: null,
      seriesId: null,
    },
    {
      id: uid(),
      month: SEED_MONTH,
      type: 'variavel' as const,
      name: 'Fatura Cartão Sicredi',
      categoryId: cat.cartoes.id,
      cardId: card.sicredi.id,
      amountCents: 16260,
      dueDay: null,
      paid: true,
      installment: null,
      seriesId: null,
    },
  ]

  return {
    entries: [...julho, ...carroBV],
    series: [luzSeries, unimedSeries],
    categories: Object.values(cat),
    cards: Object.values(card),
  }
}
