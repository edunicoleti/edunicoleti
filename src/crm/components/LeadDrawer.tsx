import { useState, type FormEvent } from 'react'
import { Check, Clock, FileText, Mail, Pencil, Phone, Trash2, X } from 'lucide-react'
import type { Activity, ActivityTipo, Lead, Stage } from '../types'
import { ACTIVITY_TIPOS, STAGES } from '../types'
import { formatDateTime, isOverdue } from '../format'
import { formatBRL } from '../../financeiro/money'

type Props = {
  lead: Lead
  activities: Activity[]
  gerando: boolean
  onClose: () => void
  onMove: (stage: Stage) => void
  onEdit: () => void
  onDelete: () => void
  onGerarProposta: () => void
  onAddActivity: (tipo: ActivityTipo, descricao: string, dueAt: string | null) => void
  onToggleActivity: (activity: Activity) => void
  onDeleteActivity: (id: string) => void
}

export default function LeadDrawer({
  lead,
  activities,
  gerando,
  onClose,
  onMove,
  onEdit,
  onDelete,
  onGerarProposta,
  onAddActivity,
  onToggleActivity,
  onDeleteActivity,
}: Props) {
  const [tipo, setTipo] = useState<ActivityTipo>('nota')
  const [descricao, setDescricao] = useState('')
  const [dueAt, setDueAt] = useState('')

  const ordered = [...activities].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
  )

  function addActivity(e: FormEvent) {
    e.preventDefault()
    if (!descricao.trim()) return
    onAddActivity(tipo, descricao.trim(), dueAt || null)
    setDescricao('')
    setDueAt('')
    setTipo('nota')
  }

  const waLink = lead.telefone
    ? `https://wa.me/${lead.telefone.replace(/\D/g, '')}`
    : null

  return (
    <div className="crm-drawer-overlay" onClick={onClose}>
      <aside className="crm-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="crm-drawer__head">
          <div>
            <h2 className="crm-drawer__name">{lead.nome}</h2>
            {lead.empresa && <p className="crm-drawer__company">{lead.empresa}</p>}
          </div>
          <button className="crm-icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="crm-drawer__contacts">
          {lead.email && (
            <a className="crm-chip" href={`mailto:${lead.email}`}>
              <Mail size={13} /> {lead.email}
            </a>
          )}
          {waLink && (
            <a className="crm-chip" href={waLink} target="_blank" rel="noopener noreferrer">
              <Phone size={13} /> {lead.telefone}
            </a>
          )}
          <span className="crm-chip crm-chip--muted">Origem: {lead.origem}</span>
        </div>

        <div className="crm-drawer__row">
          <label className="crm-field">
            <span>Estágio no funil</span>
            <select value={lead.stage} onChange={(e) => onMove(e.target.value as Stage)}>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
          <div className="crm-drawer__valor">
            <span>Valor estimado</span>
            <strong>{lead.valorEstCents > 0 ? formatBRL(lead.valorEstCents) : '—'}</strong>
          </div>
        </div>

        {lead.notas && <p className="crm-drawer__notas">{lead.notas}</p>}

        <div className="crm-drawer__actions">
          <button className="btn btn--outline" onClick={onEdit}>
            <Pencil size={15} /> Editar
          </button>
          <button className="btn btn--primary" onClick={onGerarProposta} disabled={gerando}>
            <FileText size={15} /> {gerando ? 'Gerando…' : 'Gerar proposta'}
          </button>
          <button className="btn btn--outline crm-btn-danger" onClick={onDelete}>
            <Trash2 size={15} />
          </button>
        </div>

        <div className="crm-drawer__section">
          <h3>Atividades e follow-ups</h3>

          <form className="crm-activity-form" onSubmit={addActivity}>
            <div className="crm-activity-form__top">
              <select value={tipo} onChange={(e) => setTipo(e.target.value as ActivityTipo)}>
                {ACTIVITY_TIPOS.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                aria-label="Agendar follow-up (opcional)"
              />
            </div>
            <textarea
              placeholder="Descreva a atividade ou o próximo passo…"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
            />
            <button type="submit" className="btn btn--outline">Adicionar</button>
          </form>

          <ul className="crm-timeline">
            {ordered.length === 0 && (
              <li className="crm-timeline__empty">Nenhuma atividade registrada ainda.</li>
            )}
            {ordered.map((a) => {
              const overdue = isOverdue(a.dueAt, a.done)
              return (
                <li key={a.id} className={`crm-timeline__item${a.done ? ' is-done' : ''}`}>
                  <button
                    className="crm-timeline__check"
                    onClick={() => onToggleActivity(a)}
                    aria-label={a.done ? 'Reabrir' : 'Concluir'}
                    title={a.done ? 'Reabrir' : 'Concluir'}
                  >
                    {a.done ? <Check size={13} /> : <span className="crm-timeline__dot" />}
                  </button>
                  <div className="crm-timeline__body">
                    <div className="crm-timeline__meta">
                      <span className="crm-tag">{a.tipo}</span>
                      {a.dueAt && (
                        <span className={`crm-timeline__due${overdue ? ' is-overdue' : ''}`}>
                          <Clock size={12} /> {formatDateTime(a.dueAt)}
                        </span>
                      )}
                    </div>
                    <p>{a.descricao}</p>
                    <span className="crm-timeline__ts">{formatDateTime(a.createdAt)}</span>
                  </div>
                  <button
                    className="crm-icon-btn crm-timeline__del"
                    onClick={() => onDeleteActivity(a.id)}
                    aria-label="Excluir atividade"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </div>
  )
}
