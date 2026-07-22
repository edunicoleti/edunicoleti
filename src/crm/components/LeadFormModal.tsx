import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Lead, Stage } from '../types'
import { ORIGENS, STAGES } from '../types'
import type { NewLeadInput } from '../store'
import { maskDigitsToBRL } from '../../financeiro/money'

type Props = {
  initial?: Lead
  onClose: () => void
  onSubmit: (values: NewLeadInput) => void
}

export default function LeadFormModal({ initial, onClose, onSubmit }: Props) {
  const [nome, setNome] = useState(initial?.nome ?? '')
  const [empresa, setEmpresa] = useState(initial?.empresa ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [telefone, setTelefone] = useState(initial?.telefone ?? '')
  const [origem, setOrigem] = useState(initial?.origem ?? 'manual')
  const [stage, setStage] = useState<Stage>(initial?.stage ?? 'novo')
  const [notas, setNotas] = useState(initial?.notas ?? '')
  const [valor, setValor] = useState(() => {
    const cents = initial?.valorEstCents ?? 0
    return maskDigitsToBRL(String(cents))
  })
  const [error, setError] = useState<string | null>(null)

  function handleValor(raw: string) {
    setValor(maskDigitsToBRL(raw))
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!nome.trim()) {
      setError('O nome é obrigatório.')
      return
    }
    onSubmit({
      nome: nome.trim(),
      empresa: empresa.trim() || null,
      email: email.trim() || null,
      telefone: telefone.trim() || null,
      origem,
      valorEstCents: valor.cents,
      stage,
      notas: notas.trim() || null,
    })
  }

  return (
    <div className="crm-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <form className="crm-modal__card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="crm-modal__head">
          <h2>{initial ? 'Editar lead' : 'Novo lead'}</h2>
          <button type="button" className="crm-icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <label className="crm-field">
          <span>Nome *</span>
          <input value={nome} onChange={(e) => setNome(e.target.value)} autoFocus />
        </label>

        <div className="crm-field-row">
          <label className="crm-field">
            <span>Empresa</span>
            <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          </label>
          <label className="crm-field">
            <span>Valor estimado</span>
            <input
              inputMode="numeric"
              value={valor.display}
              onChange={(e) => handleValor(e.target.value)}
            />
          </label>
        </div>

        <div className="crm-field-row">
          <label className="crm-field">
            <span>E-mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="crm-field">
            <span>Telefone</span>
            <input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </label>
        </div>

        <div className="crm-field-row">
          <label className="crm-field">
            <span>Origem</span>
            <select value={origem} onChange={(e) => setOrigem(e.target.value)}>
              {ORIGENS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="crm-field">
            <span>Estágio</span>
            <select value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="crm-field">
          <span>Notas</span>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} />
        </label>

        {error && <p className="crm-error">{error}</p>}

        <div className="crm-modal__actions">
          <button type="button" className="btn btn--outline" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn--primary">
            {initial ? 'Salvar alterações' : 'Criar lead'}
          </button>
        </div>
      </form>
    </div>
  )
}
