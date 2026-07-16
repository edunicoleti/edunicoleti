import { useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import type { Card, Category } from '../types'
import { uid } from '../types'
import { CATEGORY_PALETTE } from '../palette'

/* Só os 8 slots validados: um hue fora dessa lista quebra a checagem de CVD */
const PALETTE = CATEGORY_PALETTE

type Props = {
  open: boolean
  categories: Category[]
  cards: Card[]
  onSaveCategory: (c: Category) => void
  onDeleteCategory: (id: string) => void
  onSaveCard: (c: Card) => void
  onDeleteCard: (id: string) => void
  onClose: () => void
}

export default function ManagePanel({
  open,
  categories,
  cards,
  onSaveCategory,
  onDeleteCategory,
  onSaveCard,
  onDeleteCard,
  onClose,
}: Props) {
  const [tab, setTab] = useState<'categorias' | 'cartoes'>('categorias')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftColor, setDraftColor] = useState(PALETTE[0])

  if (!open) return null

  function startEdit(id: string, name: string, color?: string) {
    setEditingId(id)
    setDraftName(name)
    if (color) setDraftColor(color)
  }

  function startNew() {
    setEditingId('new')
    setDraftName('')
    setDraftColor(PALETTE[(tab === 'categorias' ? categories.length : cards.length) % PALETTE.length])
  }

  function commit() {
    const name = draftName.trim()
    if (!name) return
    if (tab === 'categorias') {
      onSaveCategory({ id: editingId === 'new' ? uid() : editingId!, name, color: draftColor })
    } else {
      onSaveCard({ id: editingId === 'new' ? uid() : editingId!, name })
    }
    setEditingId(null)
  }

  const editorRow = (
    <li className="fin-manage__editor">
      {tab === 'categorias' && (
        <div className="fin-manage__colors">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              className={draftColor === c ? 'active' : ''}
              style={{ background: c }}
              onClick={() => setDraftColor(c)}
              aria-label={`Cor ${c}`}
            />
          ))}
        </div>
      )}
      <div className="fin-manage__editrow">
        <input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Nome"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && commit()}
        />
        <button type="button" onClick={commit} aria-label="Salvar" className="fin-manage__ok">
          <Check size={16} />
        </button>
        <button type="button" onClick={() => setEditingId(null)} aria-label="Cancelar">
          <X size={16} />
        </button>
      </div>
    </li>
  )

  return (
    <div className="fin-modal" role="dialog" aria-modal="true">
      <div className="fin-modal__backdrop" onClick={onClose} />
      <div className="fin-modal__sheet">
        <header>
          <h2>Gerenciar</h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </header>

        <div className="fin-segmented fin-segmented--manage">
          <button type="button" className={tab === 'categorias' ? 'active' : ''} onClick={() => { setTab('categorias'); setEditingId(null) }}>
            Categorias
          </button>
          <button type="button" className={tab === 'cartoes' ? 'active' : ''} onClick={() => { setTab('cartoes'); setEditingId(null) }}>
            Cartões
          </button>
        </div>

        <ul className="fin-manage__list">
          {tab === 'categorias' &&
            categories.map((c) =>
              editingId === c.id ? (
                <span key={c.id}>{editorRow}</span>
              ) : (
                <li key={c.id}>
                  <span className="fin-manage__dot" style={{ background: c.color }} />
                  <span className="fin-manage__name">{c.name}</span>
                  <button type="button" onClick={() => startEdit(c.id, c.name, c.color)} aria-label={`Editar ${c.name}`}>
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => onDeleteCategory(c.id)} aria-label={`Excluir ${c.name}`}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ),
            )}
          {tab === 'cartoes' &&
            cards.map((c) =>
              editingId === c.id ? (
                <span key={c.id}>{editorRow}</span>
              ) : (
                <li key={c.id}>
                  <span className="fin-manage__name">{c.name}</span>
                  <button type="button" onClick={() => startEdit(c.id, c.name)} aria-label={`Editar ${c.name}`}>
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => onDeleteCard(c.id)} aria-label={`Excluir ${c.name}`}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ),
            )}
          {editingId === 'new' && editorRow}
        </ul>

        {editingId !== 'new' && (
          <button type="button" className="btn btn--outline fin-manage__add" onClick={startNew}>
            <Plus size={14} /> {tab === 'categorias' ? 'Nova categoria' : 'Novo cartão'}
          </button>
        )}
      </div>
    </div>
  )
}
