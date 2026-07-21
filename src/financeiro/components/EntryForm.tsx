import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Card, Category, Entry, EntryType } from '../types'
import { formatBRL, maskDigitsToBRL } from '../money'
import { todayISO } from '../months'
import type { EditScope, EntryPatch, NewEntryInput } from '../store'

/* Montado sob demanda pelo pai (com key por entry) — o estado inicializa dos props */
type Props = {
  /* null = criando novo lançamento */
  entry: Entry | null
  defaultType: EntryType
  month: string
  categories: Category[]
  cards: Card[]
  onCreate: (input: NewEntryInput) => void
  onUpdate: (entry: Entry, patch: EntryPatch, scope: EditScope) => void
  onDelete: (entry: Entry, scope: EditScope) => void
  onClose: () => void
}

type PendingAction = { kind: 'update'; patch: EntryPatch } | { kind: 'delete' }

const TYPE_LABELS: Record<EntryType, string> = {
  receita: 'Receita',
  despesa: 'Despesa',
}

export default function EntryForm({
  entry,
  defaultType,
  month,
  categories,
  cards,
  onCreate,
  onUpdate,
  onDelete,
  onClose,
}: Props) {
  const [type, setType] = useState<EntryType>(entry?.type ?? defaultType)
  const [name, setName] = useState(entry?.name ?? '')
  const [amountCents, setAmountCents] = useState(entry?.amountCents ?? 0)
  const [categoryId, setCategoryId] = useState(entry?.categoryId ?? '')
  const [cardId, setCardId] = useState(entry?.cardId ?? '')
  const [dueDate, setDueDate] = useState(entry?.dueDate ?? '')
  const [paid, setPaid] = useState(entry?.paid ?? false)
  const [paidDate, setPaidDate] = useState(entry?.paidDate ?? '')
  const [recurring, setRecurring] = useState(false)
  const [installments, setInstallments] = useState(false)
  const [instCurrent, setInstCurrent] = useState('1')
  const [instTotal, setInstTotal] = useState('')
  const [pending, setPending] = useState<PendingAction | null>(null)

  const editing = entry !== null
  const inSeries = editing && entry.seriesId !== null
  const paidLabel = type === 'receita' ? 'Recebido' : 'Pago'

  function buildPatch(): EntryPatch {
    return {
      name: name.trim(),
      categoryId: categoryId || null,
      cardId: cardId || null,
      amountCents,
      dueDate: dueDate || null,
      paid,
      paidDate: paid ? paidDate || todayISO() : null,
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || amountCents <= 0) return

    if (editing) {
      const patch = buildPatch()
      if (inSeries) {
        setPending({ kind: 'update', patch })
        return
      }
      onUpdate(entry, patch, 'one')
      onClose()
      return
    }

    const total = Number(instTotal)
    const current = Number(instCurrent)
    onCreate({
      month,
      type,
      name: name.trim(),
      categoryId: categoryId || null,
      cardId: cardId || null,
      amountCents,
      dueDate: dueDate || null,
      paid,
      paidDate: paid ? paidDate || todayISO() : null,
      recurring: recurring && !installments,
      installment:
        installments && total >= 1 && current >= 1 && current <= total
          ? { current, total }
          : null,
    })
    onClose()
  }

  function handleDelete() {
    if (!entry) return
    if (inSeries) {
      setPending({ kind: 'delete' })
      return
    }
    onDelete(entry, 'one')
    onClose()
  }

  function resolveScope(scope: EditScope) {
    if (!entry || !pending) return
    if (pending.kind === 'update') onUpdate(entry, pending.patch, scope)
    else onDelete(entry, scope)
    onClose()
  }

  const scopeNoun = entry?.installment ? 'parcela' : 'mês'

  return (
    <div className="fin-modal" role="dialog" aria-modal="true">
      <div className="fin-modal__backdrop" onClick={onClose} />
      <div className="fin-modal__sheet">
        <header>
          <h2>
            {pending
              ? pending.kind === 'delete'
                ? 'Excluir lançamento'
                : 'Aplicar alteração'
              : editing
                ? 'Editar lançamento'
                : 'Novo lançamento'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </header>

        {pending ? (
          <div className="fin-scope">
            <p>
              Este lançamento {entry?.installment ? 'é parcelado' : 'se repete todo mês'}.{' '}
              {pending.kind === 'delete' ? 'Excluir' : 'Aplicar'} em:
            </p>
            <div className="fin-scope__options">
              <button type="button" className="btn btn--outline" onClick={() => resolveScope('one')}>
                Só {scopeNoun === 'mês' ? 'este mês' : 'esta parcela'}
              </button>
              <button type="button" className="btn btn--primary" onClick={() => resolveScope('future')}>
                {scopeNoun === 'mês' ? 'Este e os próximos' : 'Esta e as futuras'}
              </button>
            </div>
            <button type="button" className="fin-scope__cancel" onClick={() => setPending(null)}>
              Voltar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {!editing && (
              <div className="fin-field">
                <label>Tipo</label>
                <div className="fin-segmented">
                  {(Object.keys(TYPE_LABELS) as EntryType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={type === t ? 'active' : ''}
                      onClick={() => setType(t)}
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="fin-field">
              <label htmlFor="fin-name">Nome</label>
              <input
                id="fin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'receita' ? 'Ex.: Salário' : 'Ex.: Energia'}
                autoFocus
              />
            </div>

            <div className="fin-field-row">
              <div className="fin-field">
                <label htmlFor="fin-amount">Valor</label>
                <input
                  id="fin-amount"
                  inputMode="numeric"
                  value={amountCents ? formatBRL(amountCents) : ''}
                  onChange={(e) => setAmountCents(maskDigitsToBRL(e.target.value).cents)}
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="fin-field">
                <label htmlFor="fin-due">Vencimento</label>
                <input
                  id="fin-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {type !== 'receita' && (
              <div className="fin-field-row">
                <div className="fin-field">
                  <label htmlFor="fin-cat">Categoria</label>
                  <select id="fin-cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Sem categoria</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="fin-field">
                  <label htmlFor="fin-card">Cartão</label>
                  <select id="fin-card" value={cardId} onChange={(e) => setCardId(e.target.value)}>
                    <option value="">Sem cartão</option>
                    {cards.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {!editing && (
              <div className="fin-toggles">
                <label className="fin-check">
                  <input
                    type="checkbox"
                    checked={recurring}
                    disabled={installments}
                    onChange={(e) => setRecurring(e.target.checked)}
                  />
                  Repetir todo mês
                  <span className="fin-check__hint">
                    {type === 'receita' ? 'receita fixa' : 'despesa fixa'}
                  </span>
                </label>
                <label className="fin-check">
                  <input
                    type="checkbox"
                    checked={installments}
                    disabled={recurring}
                    onChange={(e) => setInstallments(e.target.checked)}
                  />
                  Parcelado
                </label>
                {installments && (
                  <div className="fin-inst">
                    <input
                      inputMode="numeric"
                      value={instCurrent}
                      onChange={(e) => setInstCurrent(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      aria-label="Parcela atual"
                    />
                    <span>de</span>
                    <input
                      inputMode="numeric"
                      value={instTotal}
                      onChange={(e) => setInstTotal(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      aria-label="Total de parcelas"
                      placeholder="48"
                    />
                    <span className="fin-inst__hint">as futuras entram nos próximos meses</span>
                  </div>
                )}
              </div>
            )}

            <label className="fin-check fin-check--paid">
              <input
                type="checkbox"
                checked={paid}
                onChange={(e) => {
                  setPaid(e.target.checked)
                  if (e.target.checked && !paidDate) setPaidDate(todayISO())
                }}
              />
              {paidLabel}
            </label>

            {paid && (
              <div className="fin-field">
                <label htmlFor="fin-paid-date">{type === 'receita' ? 'Recebido em' : 'Pago em'}</label>
                <input
                  id="fin-paid-date"
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                />
              </div>
            )}

            <footer className="fin-modal__footer">
              {editing && (
                <button type="button" className="fin-modal__delete" onClick={handleDelete}>
                  Excluir
                </button>
              )}
              <button type="submit" className="btn btn--primary" disabled={!name.trim() || amountCents <= 0}>
                {editing ? 'Salvar' : 'Adicionar'}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  )
}
