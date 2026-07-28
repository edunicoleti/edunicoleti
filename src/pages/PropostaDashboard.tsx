import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { AuthGate } from '../components/AuthGate'
import { useNoindex } from '../hooks/useNoindex'
import { cloudEnabled } from '../financeiro/supabase'
import {
  listPropostas,
  deleteProposta,
  type PropostaRecord,
  type PropostaStatus,
} from '../data/propostaStore'
import { PropostaEditor } from './PropostaEditor'
import './PropostaDashboard.css'

const STATUS_LABEL: Record<PropostaStatus, string> = {
  rascunho: 'Rascunho',
  enviada: 'Enviada',
  vista: 'Vista',
  aceita: 'Aceita',
  recusada: 'Recusada',
}

export default function PropostaDashboard() {
  useNoindex()
  return (
    <AuthGate subtitle="Digite a senha para acessar o painel de propostas.">
      {({ logout }) => <DashboardInner onLogout={logout} />}
    </AuthGate>
  )
}

function DashboardInner({ onLogout }: { onLogout: () => void }) {
  const [propostas, setPropostas] = useState<PropostaRecord[]>([])
  const [loading, setLoading] = useState(cloudEnabled)
  const [error, setError] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [editando, setEditando] = useState<PropostaRecord | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!cloudEnabled) return
    let cancelled = false
    listPropostas()
      .then((rows) => {
        if (!cancelled) {
          setPropostas(rows)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Falha ao carregar')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  async function handleDelete(slug: string) {
    if (!confirm(`Excluir a proposta "${slug}"? Esta ação não pode ser desfeita.`)) return
    try {
      await deleteProposta(slug)
      setPropostas((prev) => prev.filter((p) => p.slug !== slug))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Falha ao excluir')
    }
  }

  return (
    <div className="dashboard" id="proposals-dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-brand">
          <Link to="/" className="dashboard__logo">
            eduardo nicoleti<span>.</span>
          </Link>
          <span className="text-label">Painel de Propostas</span>
        </div>
        <div className="dashboard__header-actions">
          <Link to="/crm" className="btn btn--outline dashboard__back">
            Ver CRM →
          </Link>
          <button className="btn btn--outline dashboard__back" onClick={onLogout}>
            <LogOut size={15} /> Sair
          </button>
        </div>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__top">
          <div>
            <h1 className="dashboard__title">Propostas de Projeto</h1>
            <p className="dashboard__sub">
              {propostas.length} proposta{propostas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn btn--primary" onClick={() => setShowNew(true)} disabled={!cloudEnabled}>
            <Plus size={16} /> Nova proposta
          </button>
        </div>

        {!cloudEnabled && (
          <p className="dashboard__state dashboard__state--error">
            Supabase não configurado — o painel de propostas roda só no modo nuvem.
          </p>
        )}
        {cloudEnabled && loading && <p className="dashboard__state">Carregando…</p>}
        {cloudEnabled && error && <p className="dashboard__state dashboard__state--error">{error}</p>}

        {cloudEnabled && !loading && !error && (
          <div className="dashboard__grid">
            {propostas.map((rec) => {
              const p = rec.data
              const hasValue = p.valorTotal > 0
              const dateStr = new Date(p.criadoEm ?? rec.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })

              return (
                <article className="prop-card" key={rec.slug} id={`prop-card-${rec.slug}`}>
                  <div className="prop-card__top">
                    <div className="prop-card__tags">
                      {p.projeto.tags.slice(0, 2).map((t) => (
                        <span className="tag" key={t}>{t}</span>
                      ))}
                    </div>
                    <span className={`prop-status prop-status--${rec.status}`}>
                      {STATUS_LABEL[rec.status]}
                    </span>
                  </div>

                  <h2 className="prop-card__title">{p.projeto.titulo}</h2>
                  <p className="prop-card__client">
                    <strong>{p.cliente.nome || '—'}</strong> · {p.cliente.empresa || '—'}
                  </p>

                  <div className="prop-card__meta">
                    <div className="prop-card__meta-item">
                      <span className="prop-card__meta-label">Valor</span>
                      <span className="prop-card__meta-value">
                        {hasValue
                          ? p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          : 'A confirmar'}
                      </span>
                    </div>
                    <div className="prop-card__meta-item">
                      <span className="prop-card__meta-label">Prazo</span>
                      <span className="prop-card__meta-value">{p.prazoEntrega}</span>
                    </div>
                    <div className="prop-card__meta-item">
                      <span className="prop-card__meta-label">Criada</span>
                      <span className="prop-card__meta-value">{dateStr}</span>
                    </div>
                  </div>

                  <div className="prop-card__actions">
                    <Link
                      to={`/proposta/${rec.slug}`}
                      className="btn btn--primary prop-card__view"
                      id={`view-proposta-${rec.slug}`}
                    >
                      Ver proposta
                    </Link>
                    <button
                      className="btn btn--outline prop-card__edit"
                      onClick={() => setEditando(rec)}
                      aria-label={`Editar proposta ${rec.slug}`}
                    >
                      <Pencil size={15} /> Editar
                    </button>
                    <button
                      className="btn btn--outline prop-card__copy"
                      id={`copy-proposta-${rec.slug}`}
                      onClick={() => {
                        const url = `${window.location.origin}/proposta/${rec.slug}`
                        navigator.clipboard.writeText(url).then(() => alert('Link copiado: ' + url))
                      }}
                    >
                      Copiar link
                    </button>
                    <button
                      className="btn btn--outline prop-card__delete"
                      onClick={() => handleDelete(rec.slug)}
                      aria-label={`Excluir proposta ${rec.slug}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              )
            })}

            {propostas.length === 0 && (
              <p className="dashboard__state">
                Nenhuma proposta ainda. Clique em <strong>Nova proposta</strong> para criar a primeira.
              </p>
            )}
          </div>
        )}
      </main>

      {showNew && (
        <PropostaEditor
          onClose={() => setShowNew(false)}
          onSaved={() => {
            setShowNew(false)
            setReloadKey((k) => k + 1)
          }}
        />
      )}

      {editando && (
        <PropostaEditor
          inicial={editando.data}
          statusInicial={editando.status}
          leadId={editando.leadId}
          onClose={() => setEditando(null)}
          onSaved={() => {
            setEditando(null)
            setReloadKey((k) => k + 1)
          }}
        />
      )}
    </div>
  )
}
