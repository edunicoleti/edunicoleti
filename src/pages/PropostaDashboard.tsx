import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Plus, Trash2 } from 'lucide-react'
import { AuthGate } from '../components/AuthGate'
import { useNoindex } from '../hooks/useNoindex'
import { cloudEnabled } from '../financeiro/supabase'
import {
  listPropostas,
  upsertProposta,
  deleteProposta,
  type PropostaRecord,
  type PropostaStatus,
} from '../data/propostaStore'
import type { PropostaData } from '../data/proposta.types'
import './PropostaDashboard.css'

const STATUS_LABEL: Record<PropostaStatus, string> = {
  rascunho: 'Rascunho',
  enviada: 'Enviada',
  vista: 'Vista',
  aceita: 'Aceita',
  recusada: 'Recusada',
}

const TEMPLATE: PropostaData = {
  slug: 'novo-cliente',
  cliente: { nome: '', empresa: '', cargo: '', email: '', telefone: '' },
  projeto: { titulo: 'Título do projeto', tipo: 'Projeto Web', descricao: '', tags: [] },
  escopo: [{ descricao: 'Item do escopo', incluido: true }],
  tecnologias: ['React', 'Vite'],
  prazoEntrega: 'A definir',
  valorTotal: 0,
  pagamento: { entrada: 0, saldo: 0, descricao: '' },
  validade: '30 dias',
  criadoEm: new Date().toISOString(),
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
        <NewPropostaModal
          onClose={() => setShowNew(false)}
          onSaved={() => {
            setShowNew(false)
            setReloadKey((k) => k + 1)
          }}
        />
      )}
    </div>
  )
}

function NewPropostaModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [json, setJson] = useState(() => JSON.stringify(TEMPLATE, null, 2))
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function save() {
    let parsed: PropostaData
    try {
      parsed = JSON.parse(json) as PropostaData
    } catch {
      setError('JSON inválido — confira as vírgulas e aspas.')
      return
    }
    if (!parsed.slug || !parsed.projeto?.titulo) {
      setError('A proposta precisa ao menos de "slug" e "projeto.titulo".')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await upsertProposta(parsed, 'enviada')
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar')
      setBusy(false)
    }
  }

  return (
    <div className="prop-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="prop-modal__card" onClick={(e) => e.stopPropagation()}>
        <h2 className="prop-modal__title">Nova proposta</h2>
        <p className="prop-modal__hint">
          Edite o modelo abaixo. O <code>slug</code> vira o link público (<code>/proposta/slug</code>).
          Um editor visual completo chega na próxima fase — por enquanto, é o mesmo formato do template.
        </p>
        <textarea
          className="prop-modal__textarea"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          spellCheck={false}
        />
        {error && <p className="dashboard__state dashboard__state--error">{error}</p>}
        <div className="prop-modal__actions">
          <button className="btn btn--outline" onClick={onClose} disabled={busy}>Cancelar</button>
          <button className="btn btn--primary" onClick={save} disabled={busy}>
            {busy ? 'Salvando…' : 'Salvar proposta'}
          </button>
        </div>
      </div>
    </div>
  )
}
