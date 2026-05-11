import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { todasPropostas } from '../data/propostas'
import './PropostaPDF.css'

export default function PropostaPDF() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const proposta = todasPropostas.find((p) => p.slug === slug)

  useEffect(() => {
    document.title = proposta
      ? `Proposta — ${proposta.cliente.empresa}`
      : 'Proposta'
  }, [proposta])

  if (!proposta) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <p>Proposta não encontrada.</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    )
  }

  const {
    cliente,
    projeto,
    escopo,
    tecnologias,
    tecnologiasTitulo,
    prazoEntrega,
    valorTotal,
    mensalidade,
    investimento,
    opcoesHospedagem,
    pagamento,
    validade,
    observacoes,
    criadoEm,
  } = proposta

  const formatBRL = (val: number) =>
    val > 0
      ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : 'A confirmar'

  const dataEmissao = new Date(criadoEm).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const itensSim = escopo.filter((i) => i.incluido)
  const temPasso2 = (mensalidade && mensalidade > 0) || (opcoesHospedagem && opcoesHospedagem.length > 0)
  const investimentoTitulo = investimento?.titulo ?? 'Implantação do Projeto'
  const investimentoDescricao =
    investimento?.descricao ?? 'Pagamento fixo referente ao desenvolvimento e entrega integral do escopo listado.'
  const investimentoRecursos =
    investimento?.recursos ?? [
      'Design UI/UX corporativo',
      'Desenvolvimento técnico (React) + SEO',
      'Configuração primária e integrações',
    ]

  return (
    <>
      <button className="pdf-print-btn" onClick={() => window.print()}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
        Salvar como PDF
      </button>

      <div className="pdf-page">

        {/* Cabeçalho timbrado */}
        <header className="pdf-header">
          <div className="pdf-header__brand">
            <div className="pdf-header__logo">edunicoleti<span>.</span></div>
            <div className="pdf-header__tagline">Desenvolvimento Web Profissional</div>
          </div>
          <div className="pdf-header__contact">
            <div>edunicoleti.com.br</div>
            <div>edunicoleti@gmail.com</div>
            <div>+55 (49) 99953-1382</div>
          </div>
        </header>

        {/* Título do documento */}
        <div className="pdf-doc-title">
          <div className="pdf-doc-title__label">Proposta Comercial</div>
          <div className="pdf-doc-title__main">{projeto.titulo}</div>
        </div>

        {/* Destinatário + datas */}
        <div className="pdf-meta">
          <div>
            <div className="pdf-meta__label">Preparada para</div>
            <div className="pdf-meta__value">{cliente.nome}</div>
            <div className="pdf-meta__sub">{cliente.empresa}</div>
            {cliente.cargo && <div className="pdf-meta__sub">{cliente.cargo}</div>}
          </div>
          <div className="pdf-meta__right">
            <div className="pdf-meta__label">Data de emissão</div>
            <div className="pdf-meta__value" style={{ fontSize: '9pt', fontWeight: 400 }}>{dataEmissao}</div>
            <div className="pdf-meta__label" style={{ marginTop: '3mm' }}>Válida por</div>
            <div className="pdf-meta__value" style={{ fontSize: '9pt', fontWeight: 400 }}>{validade}</div>
          </div>
        </div>

        {/* Descrição */}
        <p className="pdf-desc">{projeto.descricao}</p>

        {/* Escopo */}
        <div className="pdf-section">
          <div className="pdf-section__title">Escopo do Projeto</div>
          <ul className="pdf-scope-list">
            {itensSim.map((item) => (
              <li key={item.descricao}>{item.descricao}</li>
            ))}
          </ul>
        </div>

        {/* Tecnologias */}
        <div className="pdf-section">
          <div className="pdf-section__title">{tecnologiasTitulo ?? 'Tecnologias Utilizadas'}</div>
          <div className="pdf-tags">
            {tecnologias.map((t) => (
              <span className="pdf-tag" key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* Investimento */}
        <div className="pdf-section">
          <div className="pdf-section__title">Investimento</div>
          <div className="pdf-invest">

            {/* Passo 1 */}
            <div className="pdf-invest__step">
              <div className="pdf-invest__step-label pdf-invest__step-label--accent">Passo 1</div>
              <div className="pdf-invest__step-name">{investimentoTitulo}</div>
              <div className="pdf-invest__step-value">{formatBRL(valorTotal)}</div>
              <div className="pdf-invest__step-desc">
                {investimentoDescricao}
              </div>
              <ul className="pdf-invest__step-features">
                {investimentoRecursos.map((recurso) => (
                  <li key={recurso}>{recurso}</li>
                ))}
              </ul>
            </div>

            {/* Passo 2 */}
            {temPasso2 && (
              <div className="pdf-invest__step">
                <div className="pdf-invest__step-label">Passo 2</div>
                <div className="pdf-invest__step-name">Manutenção e Hospedagem</div>
                <div className="pdf-invest__step-desc">
                  Planos disponíveis para garantir performance e segurança contínua do site.
                </div>
                <ul className="pdf-invest__step-features">
                  <li>Hospedagem Cloud premium de alta performance</li>
                  <li>Backups semanais blindados de segurança</li>
                  <li>Atualizações preventivas de banco e suporte técnico</li>
                </ul>

                {opcoesHospedagem && opcoesHospedagem.length > 0 ? (
                  <div className="pdf-hosp-grid">
                    {opcoesHospedagem.map((op, idx) => (
                      <div
                        key={op.titulo}
                        className={`pdf-hosp-card${idx === 1 ? ' pdf-hosp-card--featured' : ''}`}
                      >
                        {idx === 1 && (
                          <div style={{ fontSize: '7pt', color: '#16a34a', fontWeight: 700, marginBottom: '1mm', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>
                            Recomendado
                          </div>
                        )}
                        <div className="pdf-hosp-card__label">{op.titulo}</div>
                        <div className="pdf-hosp-card__value">{op.valorFormatado}</div>
                        {op.descricao && <div className="pdf-hosp-card__desc">{op.descricao}</div>}
                      </div>
                    ))}
                  </div>
                ) : mensalidade && mensalidade > 0 ? (
                  <div style={{ marginTop: '3mm', fontSize: '16pt', fontWeight: 800, fontFamily: 'Arial, sans-serif', color: '#1a1a1a' }}>
                    {formatBRL(mensalidade)}<span style={{ fontSize: '9pt', fontWeight: 400, color: '#555' }}> / mês</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Detalhes: pagamento + prazo */}
        <div className="pdf-section">
          <div className="pdf-section__title">Condições Comerciais</div>
          <div className="pdf-details-grid">
            <div className="pdf-details-grid__item">
              <div className="pdf-details-grid__label">Formas de Pagamento</div>
              <div className="pdf-details-grid__value">{pagamento.descricao}</div>
            </div>
            <div className="pdf-details-grid__item">
              <div className="pdf-details-grid__label">Prazo de Entrega</div>
              <div className="pdf-details-grid__value">{prazoEntrega}</div>
            </div>
          </div>
        </div>

        {/* Observações */}
        {observacoes && (
          <div className="pdf-section">
            <div className="pdf-section__title">Observações</div>
            <div className="pdf-obs">{observacoes}</div>
          </div>
        )}

        {/* Validade */}
        <div className="pdf-validity">
          Proposta emitida em {dataEmissao} · Válida por {validade} · Documento confidencial gerado para {cliente.empresa}
        </div>


        {/* Rodapé fixo */}
        <div className="pdf-footer">
          <span>edunicoleti.com.br · edunicoleti@gmail.com · +55 (49) 99953-1382</span>
          <span>© {new Date().getFullYear()} Eduardo Nicoleti</span>
        </div>

      </div>
    </>
  )
}
