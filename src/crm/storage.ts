import type { Activity, CrmData, Lead, Stage, ActivityTipo } from './types'
import { cloudEnabled, getSupabase } from '../financeiro/supabase'

/*
 * Persistência do CRM, no mesmo espírito do financeiro: um adaptador nuvem
 * (Supabase) quando configurado, e um fallback local (localStorage) para rodar
 * sem banco em desenvolvimento. As duas metades cumprem a mesma interface.
 */
export interface CrmAdapter {
  mode: 'local' | 'cloud'
  loadAll(): Promise<CrmData>
  upsertLead(lead: Lead): Promise<void>
  deleteLead(id: string): Promise<void>
  upsertActivity(activity: Activity): Promise<void>
  deleteActivity(id: string): Promise<void>
}

/* ---------- Local (localStorage) ---------- */

const LOCAL_KEY = 'crm:v1'

class LocalCrmAdapter implements CrmAdapter {
  mode = 'local' as const
  private data: CrmData = { leads: [], activities: [] }

  private persist() {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(this.data))
  }

  async loadAll(): Promise<CrmData> {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<CrmData>
        this.data = {
          leads: Array.isArray(parsed.leads) ? parsed.leads : [],
          activities: Array.isArray(parsed.activities) ? parsed.activities : [],
        }
      } catch {
        this.data = { leads: [], activities: [] }
      }
    }
    return this.data
  }

  async upsertLead(lead: Lead) {
    const i = this.data.leads.findIndex((l) => l.id === lead.id)
    if (i >= 0) this.data.leads[i] = lead
    else this.data.leads.push(lead)
    this.persist()
  }

  async deleteLead(id: string) {
    this.data.leads = this.data.leads.filter((l) => l.id !== id)
    this.data.activities = this.data.activities.filter((a) => a.leadId !== id)
    this.persist()
  }

  async upsertActivity(activity: Activity) {
    const i = this.data.activities.findIndex((a) => a.id === activity.id)
    if (i >= 0) this.data.activities[i] = activity
    else this.data.activities.push(activity)
    this.persist()
  }

  async deleteActivity(id: string) {
    this.data.activities = this.data.activities.filter((a) => a.id !== id)
    this.persist()
  }
}

/* ---------- Supabase (nuvem) ---------- */

type LeadRow = {
  id: string
  nome: string
  empresa: string | null
  email: string | null
  telefone: string | null
  origem: string
  valor_est_cents: number
  stage: Stage
  notas: string | null
  created_at: string
  updated_at: string
}

function toLeadRow(l: Lead): LeadRow {
  return {
    id: l.id,
    nome: l.nome,
    empresa: l.empresa,
    email: l.email,
    telefone: l.telefone,
    origem: l.origem,
    valor_est_cents: l.valorEstCents,
    stage: l.stage,
    notas: l.notas,
    created_at: l.createdAt,
    updated_at: l.updatedAt,
  }
}

function fromLeadRow(r: LeadRow): Lead {
  return {
    id: r.id,
    nome: r.nome,
    empresa: r.empresa,
    email: r.email,
    telefone: r.telefone,
    origem: r.origem,
    valorEstCents: r.valor_est_cents,
    stage: r.stage,
    notas: r.notas,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

type ActivityRow = {
  id: string
  lead_id: string
  tipo: ActivityTipo
  descricao: string
  due_at: string | null
  done: boolean
  created_at: string
}

function toActivityRow(a: Activity): ActivityRow {
  return {
    id: a.id,
    lead_id: a.leadId,
    tipo: a.tipo,
    descricao: a.descricao,
    due_at: a.dueAt,
    done: a.done,
    created_at: a.createdAt,
  }
}

function fromActivityRow(r: ActivityRow): Activity {
  return {
    id: r.id,
    leadId: r.lead_id,
    tipo: r.tipo,
    descricao: r.descricao,
    dueAt: r.due_at,
    done: r.done,
    createdAt: r.created_at,
  }
}

class SupabaseCrmAdapter implements CrmAdapter {
  mode = 'cloud' as const

  async loadAll(): Promise<CrmData> {
    const sb = getSupabase()
    const [leads, activities] = await Promise.all([
      sb.from('crm_leads').select('*'),
      sb.from('crm_activities').select('*'),
    ])
    const err = leads.error ?? activities.error
    if (err) throw new Error(err.message)
    return {
      leads: (leads.data as LeadRow[]).map(fromLeadRow),
      activities: (activities.data as ActivityRow[]).map(fromActivityRow),
    }
  }

  async upsertLead(lead: Lead) {
    const { error } = await getSupabase().from('crm_leads').upsert(toLeadRow(lead))
    if (error) throw new Error(error.message)
  }

  async deleteLead(id: string) {
    // crm_activities tem ON DELETE CASCADE — apagar o lead limpa as atividades
    const { error } = await getSupabase().from('crm_leads').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }

  async upsertActivity(activity: Activity) {
    const { error } = await getSupabase().from('crm_activities').upsert(toActivityRow(activity))
    if (error) throw new Error(error.message)
  }

  async deleteActivity(id: string) {
    const { error } = await getSupabase().from('crm_activities').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}

export function createCrmAdapter(): CrmAdapter {
  return cloudEnabled ? new SupabaseCrmAdapter() : new LocalCrmAdapter()
}
