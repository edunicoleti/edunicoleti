import type { PropostaData } from './proposta.types'
import { cloudEnabled, getSupabase } from '../financeiro/supabase'

/*
 * Camada de dados das propostas. Antes o conteúdo dos clientes vivia estático em
 * `propostas.ts` e ia inteiro no bundle — qualquer visitante de uma proposta
 * baixava os dados e valores de todos os clientes. Agora cada proposta mora no
 * Supabase (tabela `crm_proposals`); a leitura pública passa por uma RPC
 * `get_proposta_publica(slug)` que devolve só a proposta pedida, com a tabela
 * negada ao papel anônimo. Sem Supabase configurado (dev local), cai num import
 * dinâmico do arquivo estático — que fica fora do bundle de produção.
 */

export type PropostaStatus = 'rascunho' | 'enviada' | 'vista' | 'aceita' | 'recusada'

export interface PropostaRecord {
  slug: string
  status: PropostaStatus
  data: PropostaData
  leadId: string | null
  firstSeenAt: string | null
  createdAt: string
}

type ProposalRow = {
  slug: string
  status: PropostaStatus
  data: PropostaData
  lead_id: string | null
  first_seen_at: string | null
  created_at: string
}

function fromRow(r: ProposalRow): PropostaRecord {
  return {
    slug: r.slug,
    status: r.status,
    data: r.data,
    leadId: r.lead_id,
    firstSeenAt: r.first_seen_at,
    createdAt: r.created_at,
  }
}

/* Leitura pública (cliente abre o link sem login) */
export async function fetchPropostaPublica(slug: string): Promise<PropostaData | null> {
  if (!cloudEnabled) {
    const mod = await import('./propostas')
    return mod.todasPropostas.find((p) => p.slug === slug) ?? null
  }
  const { data, error } = await getSupabase().rpc('get_proposta_publica', { p_slug: slug })
  if (error) throw new Error(error.message)
  return (data as PropostaData | null) ?? null
}

/* Marca o primeiro acesso do cliente ao link (best-effort — nunca quebra a página) */
export async function registrarVisita(slug: string): Promise<void> {
  if (!cloudEnabled) return
  try {
    await getSupabase().rpc('registrar_visita_proposta', { p_slug: slug })
  } catch {
    /* silencioso: registrar visita não pode atrapalhar a leitura da proposta */
  }
}

/* Lista completa para o painel autenticado */
export async function listPropostas(): Promise<PropostaRecord[]> {
  const { data, error } = await getSupabase()
    .from('crm_proposals')
    .select('slug, status, data, lead_id, first_seen_at, created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data as ProposalRow[]).map(fromRow)
}

/* Cria ou atualiza uma proposta (upsert pelo slug) */
export async function upsertProposta(
  proposta: PropostaData,
  status: PropostaStatus = 'enviada',
  leadId: string | null = null,
): Promise<void> {
  const { error } = await getSupabase()
    .from('crm_proposals')
    .upsert(
      { slug: proposta.slug, status, data: proposta, lead_id: leadId },
      { onConflict: 'slug' },
    )
  if (error) throw new Error(error.message)
}

export async function deleteProposta(slug: string): Promise<void> {
  const { error } = await getSupabase().from('crm_proposals').delete().eq('slug', slug)
  if (error) throw new Error(error.message)
}
