import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Plus } from 'lucide-react'
import { AuthGate } from '../components/AuthGate'
import { useNoindex } from '../hooks/useNoindex'
import { useCrmStore, type NewLeadInput } from '../crm/store'
import type { Lead, Stage } from '../crm/types'
import { STAGES } from '../crm/types'
import { formatBRL } from '../financeiro/money'
import { isOverdue, buildPropostaFromLead } from '../crm/format'
import { upsertProposta } from '../data/propostaStore'
import LeadFormModal from '../crm/components/LeadFormModal'
import LeadDrawer from '../crm/components/LeadDrawer'
import './Crm.css'

export default function Crm() {
  useNoindex()
  return (
    <AuthGate subtitle="Digite a senha para acessar o CRM.">
      {({ logout }) => <CrmInner onLogout={logout} />}
    </AuthGate>
  )
}

function CrmInner({ onLogout }: { onLogout: () => void }) {
  const store = useCrmStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [gerando, setGerando] = useState(false)
  const draggingRef = useRef<Lead | null>(null)

  const selected = selectedId ? store.leads.find((l) => l.id === selectedId) ?? null : null
  const selectedActivities = selected
    ? store.activities.filter((a) => a.leadId === selected.id)
    : []

  function pendingCount(lead: Lead): number {
    return store.activities.filter((a) => a.leadId === lead.id && isOverdue(a.dueAt, a.done)).length
  }

  function handleSubmitLead(values: NewLeadInput) {
    if (editing) {
      store.updateLead({ ...editing, ...values })
    } else {
      const lead = store.addLead(values)
      setSelectedId(lead.id)
    }
    setShowForm(false)
    setEditing(null)
  }

  async function handleGerarProposta(lead: Lead) {
    setGerando(true)
    try {
      const proposta = buildPropostaFromLead(lead)
      await upsertProposta(proposta, 'enviada', lead.id)
      store.addActivity(lead.id, 'proposta', `Proposta gerada: /proposta/${proposta.slug}`, null)
      store.moveLead(lead, 'proposta')
      window.open(`/proposta/${proposta.slug}`, '_blank', 'noopener')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Falha ao gerar proposta')
    } finally {
      setGerando(false)
    }
  }

  function handleDeleteLead(lead: Lead) {
    if (!confirm(`Excluir o lead "${lead.nome}"? Isto remove também as atividades.`)) return
    store.deleteLead(lead.id)
    setSelectedId(null)
  }

  return (
    <div className="crm">
      <header className="crm__header">
        <div className="crm__brand">
          <Link to="/" className="crm__logo">eduardo nicoleti<span>.</span></Link>
          <span className="text-label">CRM · Funil de vendas</span>
        </div>
        <div className="crm__header-actions">
          <Link to="/propostas" className="btn btn--outline">Propostas</Link>
          <button className="btn btn--primary" onClick={() => { setEditing(null); setShowForm(true) }}>
            <Plus size={16} /> Novo lead
          </button>
          <button className="btn btn--outline" onClick={onLogout} aria-label="Sair">
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {store.mode === 'local' && (
        <div className="crm__banner">
          Modo local (sem Supabase): os leads ficam só neste navegador.
        </div>
      )}
      {store.error && (
        <div className="crm__banner crm__banner--error" onClick={store.dismissError}>
          {store.error} (toque para dispensar)
        </div>
      )}

      {store.loading ? (
        <p className="crm__state">Carregando…</p>
      ) : (
        <div className="crm__board">
          {STAGES.map((s) => {
            const leads = store.leads.filter((l) => l.stage === s.key)
            const total = leads.reduce((sum, l) => sum + l.valorEstCents, 0)
            return (
              <section
                key={s.key}
                className="crm-col"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  const dragged = draggingRef.current
                  if (dragged) store.moveLead(dragged, s.key as Stage)
                  draggingRef.current = null
                }}
              >
                <header className="crm-col__head">
                  <span className="crm-col__label">{s.label}</span>
                  <span className="crm-col__count">{leads.length}</span>
                </header>
                {total > 0 && <div className="crm-col__total">{formatBRL(total)}</div>}
                <div className="crm-col__list">
                  {leads.map((lead) => {
                    const pend = pendingCount(lead)
                    return (
                      <article
                        key={lead.id}
                        className="crm-card"
                        draggable
                        onDragStart={() => { draggingRef.current = lead }}
                        onClick={() => setSelectedId(lead.id)}
                      >
                        <p className="crm-card__name">{lead.nome}</p>
                        {lead.empresa && <p className="crm-card__company">{lead.empresa}</p>}
                        <div className="crm-card__foot">
                          {lead.valorEstCents > 0 && (
                            <span className="crm-card__valor">{formatBRL(lead.valorEstCents)}</span>
                          )}
                          <span className="crm-card__origem">{lead.origem}</span>
                        </div>
                        {pend > 0 && (
                          <span className="crm-card__alert">{pend} follow-up{pend > 1 ? 's' : ''} vencido{pend > 1 ? 's' : ''}</span>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {showForm && (
        <LeadFormModal
          initial={editing ?? undefined}
          onClose={() => { setShowForm(false); setEditing(null) }}
          onSubmit={handleSubmitLead}
        />
      )}

      {selected && (
        <LeadDrawer
          lead={selected}
          activities={selectedActivities}
          gerando={gerando}
          onClose={() => setSelectedId(null)}
          onMove={(stage) => store.moveLead(selected, stage)}
          onEdit={() => { setEditing(selected); setShowForm(true) }}
          onDelete={() => handleDeleteLead(selected)}
          onGerarProposta={() => handleGerarProposta(selected)}
          onAddActivity={(tipo, descricao, dueAt) => store.addActivity(selected.id, tipo, descricao, dueAt)}
          onToggleActivity={store.toggleActivity}
          onDeleteActivity={store.deleteActivity}
        />
      )}
    </div>
  )
}
