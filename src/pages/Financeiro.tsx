import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle, AlertTriangle, Check, ChevronLeft, ChevronRight, Clock, Cloud,
  CloudOff, CopyPlus, Download, LogOut, Pencil, Plus, Settings2, TrendingDown,
  TrendingUp, Upload, X,
} from 'lucide-react'
import type { Entry, EntryType, TabKey } from '../financeiro/types'
import { computeAlerts } from '../financeiro/alerts'
import { formatBRL } from '../financeiro/money'
import { addMonths, currentMonth, monthLabel, monthShortLabel } from '../financeiro/months'
import { useFinStore } from '../financeiro/store'
import { isAuthenticated, logout } from '../financeiro/supabase'
import LockScreen from '../financeiro/components/LockScreen'
import CategoryDonut from '../financeiro/components/CategoryDonut'
import MonthlyProjection from '../financeiro/components/MonthlyProjection'
import InstallmentsPanel from '../financeiro/components/InstallmentsPanel'
import EntryForm from '../financeiro/components/EntryForm'
import ManagePanel from '../financeiro/components/ManagePanel'
import './Financeiro.css'

/* "Todas" é a lente principal; receitas e despesas são recortes dela */
const TABS: { key: TabKey; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'receita', label: 'Receitas' },
  { key: 'despesa', label: 'Despesas' },
]

export default function Financeiro() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    document.title = 'Financeiro — edunicoleti'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      meta.remove()
      document.title = 'edunicoleti'
    }
  }, [])

  useEffect(() => {
    isAuthenticated().then(setAuthed)
  }, [])

  if (authed === null) return <div className="fin-loading" />
  if (!authed) return <LockScreen onUnlock={() => setAuthed(true)} />
  return <Dashboard onLogout={() => logout().then(() => setAuthed(false))} />
}

/*
 * Status como pill clicável, não checkbox: um checkbox à esquerda da linha é a
 * convenção de seleção de linha, e não se descreve sozinho. O pill diz o estado
 * em texto (como a coluna SITUAÇÃO da planilha), carrega ícone + rótulo — nunca
 * só cor — e tem alvo de toque adequado.
 */
function StatusPill({ entry, onToggle }: { entry: Entry; onToggle: () => void }) {
  const isReceita = entry.type === 'receita'
  const doneLabel = isReceita ? 'Recebido' : 'Pago'
  const pendingLabel = isReceita ? 'A receber' : 'A pagar'
  const current = entry.paid ? doneLabel : pendingLabel
  const next = entry.paid ? pendingLabel : doneLabel

  return (
    <button
      type="button"
      className={entry.paid ? 'fin-status fin-status--done' : 'fin-status'}
      aria-pressed={entry.paid}
      aria-label={`${entry.name}: ${current}. Marcar como ${next}`}
      title={`Marcar como ${next}`}
      onClick={onToggle}
    >
      {entry.paid ? <Check size={13} /> : <Clock size={13} />}
      <span>{current}</span>
    </button>
  )
}

/*
 * Variação vs mês anterior nos cards do topo. Para despesas subir é ruim
 * (laranja) e cair é bom (verde); para receita, o inverso.
 */
function CardDelta({
  current,
  previous,
  isExpense,
  prevMonth,
}: {
  current: number
  previous: number
  isExpense: boolean
  prevMonth: string
}) {
  if (previous <= 0) return null
  const pct = ((current - previous) / previous) * 100
  if (Math.abs(pct) < 1) return null
  const up = pct > 0
  const bad = isExpense ? up : !up
  return (
    <small className={bad ? 'fin-delta fin-delta--bad' : 'fin-delta fin-delta--good'}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {Math.abs(Math.round(pct))}% vs {monthShortLabel(prevMonth)}
    </small>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [month, setMonth] = useState(currentMonth())
  const [tab, setTab] = useState<TabKey>('todas')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [manageOpen, setManageOpen] = useState(false)

  const store = useFinStore(month)
  const { data, monthEntries, loading, syncError, mode } = store

  const prevMonth = addMonths(month, -1)
  const prevEntries = useMemo(
    () => data.entries.filter((e) => e.month === prevMonth),
    [data.entries, prevMonth],
  )

  const totals = useMemo(() => {
    let receita = 0
    let despesas = 0
    let pago = 0
    for (const e of monthEntries) {
      if (e.type === 'receita') {
        receita += e.amountCents
      } else {
        despesas += e.amountCents
        if (e.paid) pago += e.amountCents
      }
    }
    return { receita, despesas, pago, aPagar: despesas - pago, saldo: receita - despesas }
  }, [monthEntries])

  const prevTotals = useMemo(() => {
    let receita = 0
    let despesas = 0
    for (const e of prevEntries) {
      if (e.type === 'receita') receita += e.amountCents
      else despesas += e.amountCents
    }
    return { receita, despesas }
  }, [prevEntries])

  const donutSegments = useMemo(() => {
    const sumByCategory = (entries: Entry[]) => {
      const map = new Map<string, number>()
      for (const e of entries) {
        if (e.type === 'receita') continue
        const key = e.categoryId ?? ''
        map.set(key, (map.get(key) ?? 0) + e.amountCents)
      }
      return map
    }
    const current = sumByCategory(monthEntries)
    const previous = sumByCategory(prevEntries)
    const hasPrev = prevEntries.some((e) => e.type === 'despesa')
    return [...current.entries()]
      .map(([categoryId, value]) => {
        const cat = data.categories.find((c) => c.id === categoryId)
        return {
          id: categoryId || null,
          label: cat?.name ?? 'Sem categoria',
          color: cat?.color ?? '#898781',
          value,
          previousValue: hasPrev ? previous.get(categoryId) ?? 0 : null,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [monthEntries, prevEntries, data.categories])

  const cardTotals = useMemo(() => {
    const byCard = new Map<string, number>()
    for (const e of monthEntries) {
      if (e.type === 'receita' || !e.cardId) continue
      byCard.set(e.cardId, (byCard.get(e.cardId) ?? 0) + e.amountCents)
    }
    return data.cards
      .map((card) => ({ card, total: byCard.get(card.id) ?? 0 }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [monthEntries, data.cards])

  /* Em "Todas" as receitas vêm antes: o mês lê como entra → sai */
  const tabEntries = useMemo(() => {
    let entries =
      tab === 'todas'
        ? [...monthEntries].sort((a, b) =>
            a.type === b.type ? 0 : a.type === 'receita' ? -1 : 1,
          )
        : monthEntries.filter((e) => e.type === tab)
    if (categoryFilter) entries = entries.filter((e) => e.categoryId === categoryFilter)
    return entries
  }, [monthEntries, tab, categoryFilter])

  const filterCategory = categoryFilter
    ? data.categories.find((c) => c.id === categoryFilter) ?? null
    : null

  /* Alertas por regras: gargalo futuro, renda comprometida, categoria em alta */
  const alerts = useMemo(
    () => computeAlerts(data.entries, data.categories, month),
    [data.entries, data.categories, month],
  )

  /* Lançamentos manuais do mês anterior ainda não presentes neste mês */
  const copyCandidates = useMemo(() => {
    const currentNames = new Set(monthEntries.map((e) => e.name))
    return prevEntries.filter(
      (e) => !e.seriesId && !e.installment && !currentNames.has(e.name),
    ).length
  }, [monthEntries, prevEntries])

  const footer = useMemo(() => {
    let total = 0
    let done = 0
    let pending = 0
    for (const e of tabEntries) {
      if (tab === 'todas') {
        /* Total misto só faz sentido como saldo; pago/a pagar seguem as
           despesas, igual aos cards do topo */
        total += e.type === 'receita' ? e.amountCents : -e.amountCents
        if (e.type === 'despesa') {
          if (e.paid) done += e.amountCents
          else pending += e.amountCents
        }
      } else {
        total += e.amountCents
        if (e.paid) done += e.amountCents
        else pending += e.amountCents
      }
    }
    const labels =
      tab === 'receita'
        ? { total: 'Total', done: 'Recebido', pending: 'A receber' }
        : { total: tab === 'todas' ? 'Saldo' : 'Total', done: 'Pago', pending: 'A pagar' }
    return { total, done, pending, labels }
  }, [tabEntries, tab])

  const defaultType: EntryType = tab === 'receita' ? 'receita' : 'despesa'

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      file.text().then((text) => {
        if (!store.importBackup(text)) {
          alert('Arquivo de backup inválido.')
        }
      })
    }
    input.click()
  }

  /* Em "Todas" o total é um saldo e carrega o próprio sinal; em "Despesas" o
     valor é positivo e o "–" é só leitura. */
  const totalClass =
    tab === 'receita'
      ? 'fin-green'
      : tab === 'todas'
        ? footer.total < 0
          ? 'fin-red'
          : 'fin-green'
        : 'fin-red'
  const totalText =
    tab === 'despesa' ? `– ${formatBRL(footer.total)}` : formatBRL(footer.total)

  return (
    <div className="fin">
      <header className="fin-header">
        <div>
          <span className="text-label">Olá, Eduardo</span>
          <h1>Financeiro</h1>
        </div>
        <div className="fin-header__right">
          <span
            className={`fin-mode ${mode === 'cloud' ? 'fin-mode--cloud' : ''}`}
            title={mode === 'cloud' ? 'Dados sincronizados na nuvem' : 'Dados salvos apenas neste navegador'}
          >
            {mode === 'cloud' ? <Cloud size={13} /> : <CloudOff size={13} />}
            {mode === 'cloud' ? 'Sincronizado' : 'Neste navegador'}
          </span>
          <nav className="fin-monthnav" aria-label="Navegar entre meses">
            <button type="button" onClick={() => setMonth((m) => addMonths(m, -1))} aria-label="Mês anterior">
              <ChevronLeft size={16} />
            </button>
            <span>{monthLabel(month)}</span>
            <button type="button" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Próximo mês">
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      </header>

      {syncError && (
        <div className="fin-syncerror" role="alert">
          Falha ao salvar: {syncError}
          <button type="button" onClick={store.dismissSyncError}>Fechar</button>
        </div>
      )}

      <section className="fin-cards">
        <article>
          <span className="text-label">Receita</span>
          <strong className="fin-green">{formatBRL(totals.receita)}</strong>
          <CardDelta
            current={totals.receita}
            previous={prevTotals.receita}
            isExpense={false}
            prevMonth={prevMonth}
          />
        </article>
        <article>
          <span className="text-label">Despesas</span>
          <strong className="fin-red">{formatBRL(totals.despesas)}</strong>
          <CardDelta
            current={totals.despesas}
            previous={prevTotals.despesas}
            isExpense
            prevMonth={prevMonth}
          />
        </article>
        <article>
          <span className="text-label">A pagar</span>
          <strong className="fin-orange">{formatBRL(totals.aPagar)}</strong>
          <small>pago {formatBRL(totals.pago)}</small>
        </article>
        <article>
          <span className="text-label">Saldo</span>
          <strong className={totals.saldo < 0 ? 'fin-red' : ''}>{formatBRL(totals.saldo)}</strong>
        </article>
      </section>

      {alerts.length > 0 && (
        <section className="fin-alerts" aria-label="Alertas financeiros">
          {alerts.map((a) => (
            <div key={a.id} className={`fin-alert fin-alert--${a.severity}`}>
              {a.severity === 'danger' ? (
                <AlertTriangle size={16} aria-hidden="true" />
              ) : (
                <AlertCircle size={16} aria-hidden="true" />
              )}
              <div>
                <strong>{a.title}</strong>
                <span>{a.detail}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="fin-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="fin-grid">
        <section className="fin-panel fin-list">
          <header>
            <h2>{TABS.find((t) => t.key === tab)?.label}</h2>
            <div className="fin-list__actions">
              {copyCandidates > 0 && (
                <button
                  type="button"
                  className="btn btn--outline fin-add"
                  title={`Copiar ${copyCandidates} lançamento(s) manual(is) de ${monthLabel(prevMonth)} como em aberto`}
                  onClick={() => store.copyFromPreviousMonth(month)}
                >
                  <CopyPlus size={14} /> Copiar mês anterior
                </button>
              )}
              <button
                type="button"
                className="btn btn--primary fin-add"
                onClick={() => { setEditingEntry(null); setFormOpen(true) }}
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>
          </header>

          {filterCategory && (
            <div className="fin-filterbar">
              <span
                className="fin-chip"
                style={{ background: `${filterCategory.color}1A`, color: filterCategory.color }}
              >
                {filterCategory.name}
              </span>
              <span>mostrando só esta categoria</span>
              <button
                type="button"
                onClick={() => setCategoryFilter(null)}
                aria-label="Limpar filtro de categoria"
              >
                <X size={13} /> limpar
              </button>
            </div>
          )}

          {loading ? (
            <p className="fin-empty">Carregando…</p>
          ) : tabEntries.length === 0 ? (
            <p className="fin-empty">
              {filterCategory
                ? `Nada em ${filterCategory.name} neste mês.`
                : tab === 'receita'
                  ? 'Nenhuma receita lançada neste mês.'
                  : tab === 'despesa'
                    ? 'Nenhuma despesa lançada neste mês.'
                    : 'Nenhum lançamento neste mês.'}
            </p>
          ) : (
            <ul className="fin-rows">
              {tabEntries.map((e) => {
                const cat = data.categories.find((c) => c.id === e.categoryId)
                const card = data.cards.find((c) => c.id === e.cardId)
                return (
                  <li key={e.id} className={e.paid ? 'fin-row fin-row--done' : 'fin-row'}>
                    <div className="fin-row__main">
                      <span className="fin-row__name">{e.name}</span>
                      <span className="fin-row__meta">
                        {e.dueDay && <em>venc. dia {e.dueDay}</em>}
                        {cat && (
                          <button
                            type="button"
                            className="fin-chip fin-chip--button"
                            style={{ background: `${cat.color}1A`, color: cat.color }}
                            title={`Filtrar por ${cat.name}`}
                            onClick={() =>
                              setCategoryFilter((cur) => (cur === cat.id ? null : cat.id))
                            }
                          >
                            {cat.name}
                          </button>
                        )}
                        {card && <em>{card.name}</em>}
                        {e.installment && <em>{e.installment.current}/{e.installment.total}</em>}
                        {e.seriesId && !e.installment && <em>mensal</em>}
                      </span>
                    </div>
                    <span className={`fin-row__amount ${e.type === 'receita' ? 'fin-green' : 'fin-red'}`}>
                      {e.type === 'receita' ? '' : '– '}{formatBRL(e.amountCents)}
                    </span>
                    <StatusPill entry={e} onToggle={() => store.togglePaid(e)} />
                    <button
                      type="button"
                      className="fin-row__edit"
                      aria-label={`Editar ${e.name}`}
                      onClick={() => { setEditingEntry(e); setFormOpen(true) }}
                    >
                      <Pencil size={14} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {tabEntries.length > 0 && (
            <footer className="fin-list__total">
              <div className="fin-list__stat">
                <span className="text-label">{footer.labels.total}</span>
                <strong className={totalClass}>{totalText}</strong>
              </div>
              <div className="fin-list__stat">
                <span className="text-label">{footer.labels.done}</span>
                <strong className="fin-done">{formatBRL(footer.done)}</strong>
              </div>
              <div className="fin-list__stat">
                <span className="text-label">{footer.labels.pending}</span>
                <strong className="fin-orange">{formatBRL(footer.pending)}</strong>
              </div>
            </footer>
          )}
        </section>

        <aside className="fin-side">
          <section className="fin-panel">
            <h2>Despesas por categoria</h2>
            <CategoryDonut
              segments={donutSegments}
              selectedId={categoryFilter}
              onSelect={setCategoryFilter}
            />
          </section>

          <section className="fin-panel">
            <h2>Este mês e os 5 seguintes</h2>
            <MonthlyProjection
              entries={data.entries}
              baseMonth={month}
              onSelectMonth={setMonth}
            />
          </section>

          <InstallmentsPanel entries={data.entries} />

          {cardTotals.length > 0 && (
            <section className="fin-panel">
              <h2>Faturas por cartão</h2>
              <ul className="fin-cardlist">
                {cardTotals.map(({ card, total }) => (
                  <li key={card.id}>
                    <span>{card.name}</span>
                    <strong>{formatBRL(total)}</strong>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="fin-actions">
            <button type="button" onClick={() => setManageOpen(true)}>
              <Settings2 size={14} /> Gerenciar categorias e cartões
            </button>
            <button type="button" onClick={store.exportBackup}>
              <Download size={14} /> Exportar backup
            </button>
            <button type="button" onClick={handleImport}>
              <Upload size={14} /> Importar backup
            </button>
            <button type="button" onClick={onLogout}>
              <LogOut size={14} /> Sair
            </button>
          </div>
        </aside>
      </div>

      {formOpen && (
        <EntryForm
          key={editingEntry?.id ?? 'new'}
          entry={editingEntry}
          defaultType={defaultType}
          month={month}
          categories={data.categories}
          cards={data.cards}
          onCreate={store.addEntry}
          onUpdate={store.updateEntry}
          onDelete={store.deleteEntry}
          onClose={() => setFormOpen(false)}
        />
      )}

      <ManagePanel
        open={manageOpen}
        categories={data.categories}
        cards={data.cards}
        onSaveCategory={store.saveCategory}
        onDeleteCategory={store.deleteCategory}
        onSaveCard={store.saveCard}
        onDeleteCard={store.deleteCard}
        onClose={() => setManageOpen(false)}
      />
    </div>
  )
}
