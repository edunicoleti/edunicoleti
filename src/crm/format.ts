import type { Lead } from './types'
import type { PropostaData } from '../data/proposta.types'

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* Um follow-up está vencido quando tem data no passado e ainda não foi concluído */
export function isOverdue(dueAt: string | null, done: boolean): boolean {
  if (!dueAt || done) return false
  return new Date(dueAt).getTime() < Date.now()
}

export function slugify(input: string): string {
  const base = input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base || 'proposta'}-${suffix}`
}

/*
 * Monta uma proposta inicial a partir dos dados do lead. O escopo/valores ficam
 * como placeholders para o Eduardo ajustar no painel de propostas — o ganho aqui
 * é não redigitar cliente, empresa e contato.
 */
export function buildPropostaFromLead(lead: Lead): PropostaData {
  return {
    slug: slugify(lead.empresa || lead.nome),
    cliente: {
      nome: lead.nome,
      empresa: lead.empresa ?? '',
      cargo: '',
      email: lead.email ?? '',
      telefone: lead.telefone ?? '',
    },
    projeto: {
      titulo: `Proposta para ${lead.empresa || lead.nome}`,
      tipo: 'Projeto Web',
      descricao: '',
      tags: [],
    },
    escopo: [{ descricao: 'Item do escopo', incluido: true }],
    tecnologias: ['React', 'Vite'],
    prazoEntrega: 'A definir',
    valorTotal: lead.valorEstCents > 0 ? Math.round(lead.valorEstCents / 100) : 0,
    pagamento: { entrada: 0, saldo: 0, descricao: '' },
    validade: '30 dias',
    criadoEm: new Date().toISOString(),
  }
}
