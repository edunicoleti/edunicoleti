import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { upsertProposta, type PropostaStatus } from '../data/propostaStore'
import type { PropostaData, PropostaOpcao } from '../data/proposta.types'
import './PropostaEditor.css'

/*
 * Editor visual de propostas. Substitui o textarea de JSON: os campos viram
 * formulário e o JSON fica como modo avançado — útil para colar uma proposta
 * pronta de fora ou mexer em campos que o formulário não cobre.
 * Serve tanto para criar quanto para editar (o upsert é pelo slug).
 */

const STATUS_OPCOES: { valor: PropostaStatus; rotulo: string }[] = [
  { valor: 'rascunho', rotulo: 'Rascunho' },
  { valor: 'enviada', rotulo: 'Enviada' },
  { valor: 'vista', rotulo: 'Vista' },
  { valor: 'aceita', rotulo: 'Aceita' },
  { valor: 'recusada', rotulo: 'Recusada' },
]

const PROPOSTA_VAZIA: PropostaData = {
  slug: '',
  cliente: { nome: '', empresa: '', cargo: '', email: '', telefone: '' },
  projeto: { titulo: '', tipo: 'Projeto Web', descricao: '', tags: [] },
  escopo: [{ descricao: '', incluido: true }],
  tecnologias: [],
  prazoEntrega: 'A definir',
  valorTotal: 0,
  pagamento: { entrada: 0, saldo: 0, descricao: '' },
  validade: '15 dias',
  criadoEm: new Date().toISOString(),
}

/* "Criare Construtora" -> "criare-construtora" */
function gerarSlug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const listaParaTexto = (v?: string[]) => (v ?? []).join(', ')
const textoParaLista = (v: string) =>
  v.split(',').map((s) => s.trim()).filter(Boolean)
const linhasParaLista = (v: string) =>
  v.split('\n').map((s) => s.trim()).filter(Boolean)

interface Props {
  inicial?: PropostaData
  statusInicial?: PropostaStatus
  leadId?: string | null
  onClose: () => void
  onSaved: () => void
}

export function PropostaEditor({
  inicial,
  statusInicial = 'enviada',
  leadId = null,
  onClose,
  onSaved,
}: Props) {
  const editando = Boolean(inicial)
  const [p, setP] = useState<PropostaData>(inicial ?? PROPOSTA_VAZIA)
  const [status, setStatus] = useState<PropostaStatus>(statusInicial)
  const [modoJson, setModoJson] = useState(false)
  const [json, setJson] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  const set = (patch: Partial<PropostaData>) => setP((prev) => ({ ...prev, ...patch }))
  const setCliente = (patch: Partial<PropostaData['cliente']>) =>
    setP((prev) => ({ ...prev, cliente: { ...prev.cliente, ...patch } }))
  const setProjeto = (patch: Partial<PropostaData['projeto']>) =>
    setP((prev) => ({ ...prev, projeto: { ...prev.projeto, ...patch } }))
  const setPagamento = (patch: Partial<PropostaData['pagamento']>) =>
    setP((prev) => ({ ...prev, pagamento: { ...prev.pagamento, ...patch } }))

  /* Alterna entre formulário e JSON mantendo o que já foi preenchido */
  function alternarModo() {
    if (!modoJson) {
      setJson(JSON.stringify(p, null, 2))
      setModoJson(true)
      setErro(null)
      return
    }
    try {
      setP(JSON.parse(json) as PropostaData)
      setModoJson(false)
      setErro(null)
    } catch {
      setErro('JSON inválido — corrija antes de voltar ao formulário.')
    }
  }

  async function salvar() {
    let dados = p
    if (modoJson) {
      try {
        dados = JSON.parse(json) as PropostaData
      } catch {
        setErro('JSON inválido — confira as vírgulas e aspas.')
        return
      }
    }
    if (!dados.slug.trim()) {
      setErro('Preencha o endereço do link (slug).')
      return
    }
    if (!dados.projeto?.titulo?.trim()) {
      setErro('Preencha o título do projeto.')
      return
    }
    setSalvando(true)
    setErro(null)
    try {
      await upsertProposta(dados, status, leadId)
      onSaved()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao salvar')
      setSalvando(false)
    }
  }

  /* ── escopo ── */
  const addEscopo = () => set({ escopo: [...p.escopo, { descricao: '', incluido: true }] })
  const updEscopo = (i: number, patch: Partial<PropostaData['escopo'][number]>) =>
    set({ escopo: p.escopo.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) })
  const delEscopo = (i: number) => set({ escopo: p.escopo.filter((_, idx) => idx !== i) })

  /* ── opções de escopo ── */
  const opcoes = p.opcoes ?? []
  const addOpcao = () =>
    set({
      opcoes: [
        ...opcoes,
        { id: `opcao-${opcoes.length + 1}`, titulo: '', valorTotal: 0, destaques: [] },
      ],
    })
  const updOpcao = (i: number, patch: Partial<PropostaOpcao>) =>
    set({ opcoes: opcoes.map((o, idx) => (idx === i ? { ...o, ...patch } : o)) })
  const delOpcao = (i: number) => {
    const restantes = opcoes.filter((_, idx) => idx !== i)
    set({ opcoes: restantes.length ? restantes : undefined })
  }

  return (
    <div className="prop-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="prop-modal__card prop-modal__card--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ed-head">
          <h2 className="prop-modal__title">
            {editando ? `Editar proposta` : 'Nova proposta'}
          </h2>
          <button className="btn btn--outline btn--sm" onClick={alternarModo} type="button">
            {modoJson ? '← Voltar ao formulário' : 'Modo avançado (JSON)'}
          </button>
        </div>

        {modoJson ? (
          <>
            <p className="prop-modal__hint">
              Cole ou edite o JSON completo da proposta. Ao voltar para o formulário, os
              campos são preenchidos com o que estiver aqui.
            </p>
            <textarea
              className="prop-modal__textarea"
              value={json}
              onChange={(e) => setJson(e.target.value)}
              spellCheck={false}
            />
          </>
        ) : (
          <div className="ed-form">
            {/* ── Link e status ── */}
            <fieldset className="ed-sec">
              <legend className="ed-sec__t">Link e situação</legend>
              <div className="ed-row">
                <label className="ed-f ed-f--grow">
                  <span>Endereço do link</span>
                  <div className="ed-slug">
                    <em>/proposta/</em>
                    <input
                      value={p.slug}
                      onChange={(e) => set({ slug: gerarSlug(e.target.value) })}
                      placeholder="nome-do-cliente"
                    />
                  </div>
                  {!editando && p.cliente.empresa && (
                    <button
                      type="button"
                      className="ed-mini"
                      onClick={() => set({ slug: gerarSlug(p.cliente.empresa) })}
                    >
                      usar “{gerarSlug(p.cliente.empresa)}”
                    </button>
                  )}
                </label>
                <label className="ed-f">
                  <span>Situação</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropostaStatus)}
                  >
                    {STATUS_OPCOES.map((s) => (
                      <option key={s.valor} value={s.valor}>{s.rotulo}</option>
                    ))}
                  </select>
                </label>
              </div>
            </fieldset>

            {/* ── Cliente ── */}
            <fieldset className="ed-sec">
              <legend className="ed-sec__t">Cliente</legend>
              <div className="ed-row">
                <label className="ed-f ed-f--grow">
                  <span>Nome</span>
                  <input
                    value={p.cliente.nome}
                    onChange={(e) => setCliente({ nome: e.target.value })}
                    placeholder="Nome de quem recebe"
                  />
                </label>
                <label className="ed-f ed-f--grow">
                  <span>Empresa</span>
                  <input
                    value={p.cliente.empresa}
                    onChange={(e) => setCliente({ empresa: e.target.value })}
                  />
                </label>
              </div>
              <div className="ed-row">
                <label className="ed-f">
                  <span>Cargo</span>
                  <input
                    value={p.cliente.cargo ?? ''}
                    onChange={(e) => setCliente({ cargo: e.target.value })}
                  />
                </label>
                <label className="ed-f">
                  <span>E-mail</span>
                  <input
                    value={p.cliente.email ?? ''}
                    onChange={(e) => setCliente({ email: e.target.value })}
                  />
                </label>
                <label className="ed-f">
                  <span>Telefone</span>
                  <input
                    value={p.cliente.telefone ?? ''}
                    onChange={(e) => setCliente({ telefone: e.target.value })}
                  />
                </label>
              </div>
            </fieldset>

            {/* ── Projeto ── */}
            <fieldset className="ed-sec">
              <legend className="ed-sec__t">Projeto</legend>
              <div className="ed-row">
                <label className="ed-f ed-f--grow">
                  <span>Título</span>
                  <input
                    value={p.projeto.titulo}
                    onChange={(e) => setProjeto({ titulo: e.target.value })}
                    placeholder="Novo site institucional da…"
                  />
                </label>
                <label className="ed-f">
                  <span>Tipo</span>
                  <input
                    value={p.projeto.tipo}
                    onChange={(e) => setProjeto({ tipo: e.target.value })}
                  />
                </label>
              </div>
              <label className="ed-f">
                <span>Descrição</span>
                <textarea
                  rows={3}
                  value={p.projeto.descricao}
                  onChange={(e) => setProjeto({ descricao: e.target.value })}
                />
              </label>
              <label className="ed-f">
                <span>Etiquetas <em>(separadas por vírgula)</em></span>
                <input
                  value={listaParaTexto(p.projeto.tags)}
                  onChange={(e) => setProjeto({ tags: textoParaLista(e.target.value) })}
                  placeholder="Site institucional, SEO, Hospedagem"
                />
              </label>
            </fieldset>

            {/* ── Escopo ── */}
            <fieldset className="ed-sec">
              <legend className="ed-sec__t">O que está incluso</legend>
              {p.escopo.map((item, i) => (
                <div className="ed-item" key={i}>
                  <input
                    value={item.descricao}
                    onChange={(e) => updEscopo(i, { descricao: e.target.value })}
                    placeholder="Descreva um item do escopo"
                  />
                  <button
                    type="button"
                    className="ed-del"
                    onClick={() => delEscopo(i)}
                    aria-label="Remover item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button type="button" className="ed-add" onClick={addEscopo}>
                <Plus size={14} /> Adicionar item
              </button>
            </fieldset>

            {/* ── Opções de escopo ── */}
            <fieldset className="ed-sec">
              <legend className="ed-sec__t">Opções de escopo <em>(opcional)</em></legend>
              <p className="ed-hint">
                Preencha para o cliente comparar dois ou mais escopos lado a lado, cada um
                com seu valor. Deixe vazio para mostrar um valor único.
              </p>
              {opcoes.map((op, i) => (
                <div className="ed-card" key={i}>
                  <div className="ed-row">
                    <label className="ed-f ed-f--grow">
                      <span>Título da opção</span>
                      <input
                        value={op.titulo}
                        onChange={(e) => updOpcao(i, { titulo: e.target.value })}
                        placeholder="Site Institucional"
                      />
                    </label>
                    <button
                      type="button"
                      className="ed-del ed-del--top"
                      onClick={() => delOpcao(i)}
                      aria-label="Remover opção"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <label className="ed-f">
                    <span>Resumo</span>
                    <textarea
                      rows={2}
                      value={op.resumo ?? ''}
                      onChange={(e) => updOpcao(i, { resumo: e.target.value })}
                    />
                  </label>
                  <div className="ed-row">
                    <label className="ed-f">
                      <span>Investimento (R$)</span>
                      <input
                        type="number"
                        value={op.valorTotal}
                        onChange={(e) => updOpcao(i, { valorTotal: Number(e.target.value) })}
                      />
                    </label>
                    <label className="ed-f">
                      <span>Mensalidade (R$)</span>
                      <input
                        type="number"
                        value={op.mensalidade ?? 0}
                        onChange={(e) => updOpcao(i, { mensalidade: Number(e.target.value) })}
                      />
                    </label>
                    <label className="ed-f ed-f--check">
                      <input
                        type="checkbox"
                        checked={Boolean(op.recomendada)}
                        onChange={(e) => updOpcao(i, { recomendada: e.target.checked })}
                      />
                      <span>Recomendada</span>
                    </label>
                  </div>
                  <label className="ed-f">
                    <span>Destaques <em>(um por linha)</em></span>
                    <textarea
                      rows={4}
                      value={(op.destaques ?? []).join('\n')}
                      onChange={(e) => updOpcao(i, { destaques: linhasParaLista(e.target.value) })}
                    />
                  </label>
                </div>
              ))}
              <button type="button" className="ed-add" onClick={addOpcao}>
                <Plus size={14} /> Adicionar opção
              </button>
            </fieldset>

            {/* ── Valores ── */}
            <fieldset className="ed-sec">
              <legend className="ed-sec__t">Valores e condições</legend>
              <div className="ed-row">
                <label className="ed-f">
                  <span>Investimento (R$)</span>
                  <input
                    type="number"
                    value={p.valorTotal}
                    onChange={(e) => set({ valorTotal: Number(e.target.value) })}
                  />
                </label>
                <label className="ed-f">
                  <span>Mensalidade (R$)</span>
                  <input
                    type="number"
                    value={p.mensalidade ?? 0}
                    onChange={(e) => set({ mensalidade: Number(e.target.value) })}
                  />
                </label>
                <label className="ed-f">
                  <span>Prazo de entrega</span>
                  <input
                    value={p.prazoEntrega}
                    onChange={(e) => set({ prazoEntrega: e.target.value })}
                  />
                </label>
                <label className="ed-f">
                  <span>Validade</span>
                  <input
                    value={p.validade}
                    onChange={(e) => set({ validade: e.target.value })}
                  />
                </label>
              </div>
              <div className="ed-row">
                <label className="ed-f">
                  <span>Entrada (R$)</span>
                  <input
                    type="number"
                    value={p.pagamento.entrada}
                    onChange={(e) => setPagamento({ entrada: Number(e.target.value) })}
                  />
                </label>
                <label className="ed-f">
                  <span>Saldo (R$)</span>
                  <input
                    type="number"
                    value={p.pagamento.saldo}
                    onChange={(e) => setPagamento({ saldo: Number(e.target.value) })}
                  />
                </label>
                <label className="ed-f ed-f--grow">
                  <span>Como funciona o pagamento</span>
                  <input
                    value={p.pagamento.descricao}
                    onChange={(e) => setPagamento({ descricao: e.target.value })}
                    placeholder="50% na aprovação e 50% na entrega"
                  />
                </label>
              </div>
            </fieldset>

            {/* ── Extras ── */}
            <fieldset className="ed-sec">
              <legend className="ed-sec__t">Complementos</legend>
              <label className="ed-f">
                <span>Tecnologias <em>(separadas por vírgula)</em></span>
                <input
                  value={listaParaTexto(p.tecnologias)}
                  onChange={(e) => set({ tecnologias: textoParaLista(e.target.value) })}
                  placeholder="React, TypeScript, MySQL"
                />
              </label>
              <label className="ed-f">
                <span>Observações</span>
                <textarea
                  rows={3}
                  value={p.observacoes ?? ''}
                  onChange={(e) => set({ observacoes: e.target.value })}
                />
              </label>
              <label className="ed-f ed-f--check">
                <input
                  type="checkbox"
                  checked={p.mostrarDetalhesComerciais !== false}
                  onChange={(e) => set({ mostrarDetalhesComerciais: e.target.checked })}
                />
                <span>Mostrar formas de pagamento e prazo na proposta</span>
              </label>
            </fieldset>
          </div>
        )}

        {erro && <p className="dashboard__state dashboard__state--error">{erro}</p>}

        <div className="prop-modal__actions">
          <button className="btn btn--outline" onClick={onClose} disabled={salvando}>
            Cancelar
          </button>
          <button className="btn btn--primary" onClick={salvar} disabled={salvando}>
            {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Criar proposta'}
          </button>
        </div>
      </div>
    </div>
  )
}
