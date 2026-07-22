/*
 * Modelo do CRM. Um lead percorre um funil de estágios fixos; cada lead acumula
 * atividades (notas, follow-ups, contatos). O valor estimado fica em centavos,
 * como no financeiro, para não arrastar imprecisão de ponto flutuante.
 */

export type Stage =
  | 'novo'
  | 'contato'
  | 'briefing'
  | 'proposta'
  | 'negociacao'
  | 'ganho'
  | 'perdido'

export const STAGES: { key: Stage; label: string }[] = [
  { key: 'novo', label: 'Novo' },
  { key: 'contato', label: 'Contato feito' },
  { key: 'briefing', label: 'Briefing' },
  { key: 'proposta', label: 'Proposta enviada' },
  { key: 'negociacao', label: 'Negociação' },
  { key: 'ganho', label: 'Ganho' },
  { key: 'perdido', label: 'Perdido' },
]

export const ORIGENS = ['manual', 'whatsapp', 'site', 'mentoria', 'indicacao'] as const
export type Origem = (typeof ORIGENS)[number]

export interface Lead {
  id: string
  nome: string
  empresa: string | null
  email: string | null
  telefone: string | null
  origem: string
  valorEstCents: number
  stage: Stage
  notas: string | null
  createdAt: string
  updatedAt: string
}

export type ActivityTipo = 'nota' | 'ligacao' | 'whatsapp' | 'reuniao' | 'proposta'

export const ACTIVITY_TIPOS: { key: ActivityTipo; label: string }[] = [
  { key: 'nota', label: 'Nota' },
  { key: 'ligacao', label: 'Ligação' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'reuniao', label: 'Reunião' },
  { key: 'proposta', label: 'Proposta' },
]

export interface Activity {
  id: string
  leadId: string
  tipo: ActivityTipo
  descricao: string
  /* follow-up agendado ('YYYY-MM-DDTHH:mm' ISO) — null = registro sem agenda */
  dueAt: string | null
  done: boolean
  createdAt: string
}

export interface CrmData {
  leads: Lead[]
  activities: Activity[]
}

export const EMPTY_CRM: CrmData = { leads: [], activities: [] }

export function uid(): string {
  return crypto.randomUUID()
}
