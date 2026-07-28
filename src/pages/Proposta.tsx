import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { PropostaData } from '../data/proposta.types'
import { fetchPropostaPublica, registrarVisita } from '../data/propostaStore'
import { useNoindex } from '../hooks/useNoindex'
import './Proposta.css'

export default function Proposta() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  useNoindex()

  const [proposta, setProposta] = useState<PropostaData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    fetchPropostaPublica(slug)
      .then((p) => {
        if (cancelled) return
        setProposta(p)
        if (p) registrarVisita(slug)
      })
      .catch(() => {
        if (!cancelled) setProposta(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (!slug) {
    return (
      <div className="proposta-notfound">
        <p className="text-label">Proposta não encontrada</p>
        <h1>Esta proposta não existe ou foi removida.</h1>
        <a href="/" className="btn btn--primary">Voltar ao início</a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="proposta-notfound">
        <p className="text-label">Carregando proposta…</p>
      </div>
    )
  }

  if (!proposta) {
    return (
      <div className="proposta-notfound">
        <p className="text-label">Proposta não encontrada</p>
        <h1>Esta proposta não existe ou foi removida.</h1>
        <a href="/" className="btn btn--primary">Voltar ao início</a>
      </div>
    )
  }

  const {
    cliente,
    projeto,
    escopo,
    opcoes,
    tecnologias,
    tecnologiasTitulo,
    planejamentoVisual,
    prazoEntrega,
    valorTotal,
    mensalidade,
    mensalidadeInfo,
    investimento,
    opcoesHospedagem,
    pagamento,
    validade,
    observacoes,
    mostrarDetalhesComerciais = true,
    criadoEm,
  } = proposta

  const mensalidadeTitulo = mensalidadeInfo?.titulo ?? 'Manutenção e Hospedagem'
  const mensalidadeDescricao = mensalidadeInfo?.descricao ?? 'Estão disponíveis os seguintes planos para garantir performance e segurança contínua para o seu site ao longo do tempo. Basta me informar sua escolha na aprovação!'
  const mensalidadeRecursos = mensalidadeInfo?.recursos ?? [
    'Hospedagem Cloud premium de alta performance',
    'Backups semanais blindados de segurança',
    'Atualizações preventivas de banco e suporte técnico',
  ]

  const formatBRL = (val: number) =>
    val > 0
      ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : 'A confirmar'

  const itensSim = escopo.filter((i) => i.incluido)
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
    <div className="proposta-page" id="proposta-page">
      {/* Header */}
      <header className="proposta-header">
        <span className="proposta-header__type">PROPOSTA DE PROJETO</span>
        <div className="proposta-header__logo">
          edunicoleti<span>.</span>
        </div>
      </header>

      <main className="proposta-main">

        {/* Hero da proposta */}
        <section className="proposta-hero" aria-label="Resumo do projeto">
          <div className="proposta-hero__left">
            <h1 className="proposta-hero__title">{projeto.titulo}</h1>
            <p className="proposta-hero__desc">{projeto.descricao}</p>
            <div className="proposta-hero__features" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
              {projeto.tags.map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--color-bg-alt)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  <CheckCircle2 size={16} color="var(--color-accent)" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="proposta-hero__right">
            <div className="proposta-card proposta-card--client">
              <p className="text-label" style={{ marginBottom: '0.75rem' }}>Preparada para</p>
              <p className="proposta-card__name">{cliente.nome}</p>
              <p className="proposta-card__company">{cliente.empresa}</p>
              {cliente.cargo && <p className="proposta-card__role">{cliente.cargo}</p>}
            </div>
          </div>
        </section>

        {/* Planejamento visual */}
        {planejamentoVisual && (
          <section className="proposta-section proposta-visual-plan" aria-label="Planejamento visual">
            {planejamentoVisual.situacaoAtual && (
              <div className="proposta-infographic">
                <div className="proposta-infographic__heading">
                  <span className="proposta-section__title">Situação atual</span>
                  {planejamentoVisual.situacaoAtualDescricao && (
                    <p>{planejamentoVisual.situacaoAtualDescricao}</p>
                  )}
                </div>
                <div className="proposta-status-grid">
                  {planejamentoVisual.situacaoAtual.map((item, index) => (
                    <article className="proposta-status-card" key={item.titulo}>
                      <span className="proposta-status-card__index">{String(index + 1).padStart(2, '0')}</span>
                      <h3>{item.titulo}</h3>
                      <p>{item.descricao}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {(planejamentoVisual.roadmap || planejamentoVisual.cenarios) && (
              <div className="proposta-infographic">
                <div className="proposta-infographic__heading">
                  <span className="proposta-section__title">Plano de execução</span>
                  {planejamentoVisual.planoExecucaoDescricao && (
                    <p>{planejamentoVisual.planoExecucaoDescricao}</p>
                  )}
                </div>

                {planejamentoVisual.roadmap ? (
                  <div className="proposta-execution">
                    <div className="proposta-roadmap">
                      {planejamentoVisual.roadmap.map((item) => (
                        <article className="proposta-roadmap__item" key={item.titulo}>
                          <span>{item.titulo}</span>
                          <p>{item.descricao}</p>
                        </article>
                      ))}
                    </div>
                    <div className="proposta-execution__details">
                      <div className="proposta-execution__panel">
                        <h3>O que será realizado</h3>
                        <ul className="proposta-compact-list">
                          {itensSim.map((item) => (
                            <li key={item.descricao}>{item.descricao}</li>
                          ))}
                        </ul>
                      </div>
                      {planejamentoVisual.cenarios && (
                        <div className="proposta-execution__panel">
                          <h3>O que deve ficar funcionando</h3>
                          <div className="proposta-outcomes">
                            {planejamentoVisual.cenarios.map((cenario) => (
                              <article className={`proposta-outcome proposta-outcome--${cenario.nivel}`} key={cenario.titulo}>
                                <strong>{cenario.titulo}</strong>
                                <span>{cenario.destaque}</span>
                                <p>{cenario.descricao}</p>
                              </article>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {planejamentoVisual.cenarios && (
                      <div className="proposta-outcomes proposta-outcomes--full">
                        {planejamentoVisual.cenarios.map((cenario) => (
                          <article className={`proposta-outcome proposta-outcome--${cenario.nivel}`} key={cenario.titulo}>
                            <strong>{cenario.titulo}</strong>
                            <span>{cenario.destaque}</span>
                            <p>{cenario.descricao}</p>
                          </article>
                        ))}
                      </div>
                    )}
                    <div className="proposta-execution__panel">
                      <h3>O que está incluído</h3>
                      <ul className="proposta-compact-list">
                        {itensSim.map((item) => (
                          <li key={item.descricao}>{item.descricao}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Escopo */}
        {!planejamentoVisual && (
          <section className="proposta-section" aria-label="Escopo do projeto">
          <h2 className="proposta-section__title">O que está incluso</h2>
          <div className="proposta-escopo">
            <ul className="proposta-list proposta-list--yes">
              {itensSim.map((item) => (
                <li key={item.descricao} className="proposta-list__item proposta-list__item--yes">
                  <span className="proposta-list__icon" aria-hidden="true">✓</span>
                  {item.descricao}
                </li>
              ))}
            </ul>
          </div>
          </section>
        )}

        {/* Tecnologias */}
        <section className="proposta-section" aria-label="Tecnologias">
          <h2 className="proposta-section__title">{tecnologiasTitulo ?? 'Tecnologias utilizadas'}</h2>
          <div className="proposta-tags">
            {tecnologias.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </section>

        {/* Investimento e Prazos */}
        <section className="proposta-section" aria-label="Investimento e Prazos">
          <div className="proposta-invest">
            <h2 className="proposta-section__title" style={{ marginBottom: '1.5rem' }}>Investimento</h2>
            
            {/* Escopos alternativos: o cliente compara e escolhe */}
            {opcoes && opcoes.length > 0 ? (
              <>
                <div className="proposta-opcoes">
                  {opcoes.map((op) => (
                    <div
                      key={op.id}
                      className={`proposta-opcao${op.recomendada ? ' proposta-opcao--rec' : ''}`}
                    >
                      {op.recomendada && <span className="proposta-opcao__badge">Recomendada</span>}
                      <h3 className="proposta-opcao__titulo">{op.titulo}</h3>
                      {op.resumo && <p className="proposta-opcao__resumo">{op.resumo}</p>}
                      <div className="proposta-opcao__valor">{formatBRL(op.valorTotal)}</div>
                      <div className="proposta-opcao__label">Investimento único</div>
                      {op.mensalidade && op.mensalidade > 0 ? (
                        <div className="proposta-opcao__mensal">
                          + {formatBRL(op.mensalidade)} <span>/ mês</span>
                        </div>
                      ) : null}
                      {op.destaques && op.destaques.length > 0 && (
                        <ul className="proposta-opcao__lista">
                          {op.destaques.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <div className="proposta-opcoes__nota">
                  <span className="text-label">{mensalidadeTitulo}</span>
                  <p>{mensalidadeDescricao}</p>
                  <ul className="proposta-invest__features">
                    {mensalidadeRecursos.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
            <div className="proposta-invest__steps" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* PASSO 1 */}
              <div className="proposta-step-card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-accent)', color: 'var(--color-bg)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, width: 'fit-content', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passo 1</div>
                  <span className="text-label" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{investimentoTitulo}</span>
                  <span style={{ fontSize: 'clamp(2.25rem, 8vw, 3rem)', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>{formatBRL(valorTotal)}</span>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '600px' }}>{investimentoDescricao}</p>
                  
                  <ul className="proposta-invest__features" style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    {investimentoRecursos.map((recurso) => (
                      <li key={recurso}>{recurso}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {((mensalidade && mensalidade > 0) || opcoesHospedagem?.length) && (
                <>
                  <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-text)', border: '1px solid var(--color-border-light)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                  </div>

                  {/* PASSO 2 */}
                  <div className="proposta-step-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-text)', color: 'var(--color-bg)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, width: 'fit-content', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passo 2</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginTop: '0.5rem' }}>
                        <div style={{ flex: '1 1 300px' }}>
                          <span className="text-label" style={{ fontSize: '1rem' }}>{mensalidadeTitulo}</span>
                          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '400px', lineHeight: 1.5 }}>
                            {mensalidadeDescricao}
                          </p>
                          <ul className="proposta-invest__features" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {mensalidadeRecursos.map((r) => <li key={r}>{r}</li>)}
                          </ul>
                        </div>
                        
                        <div style={{ flex: '1 1 300px' }}>
                          {opcoesHospedagem?.length ? (
                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                              {opcoesHospedagem.map((op, idx) => (
                                <div key={op.titulo} className="proposta-hosp-card" style={{ position: 'relative', background: idx === 1 ? 'var(--color-bg)' : 'transparent', border: idx === 1 ? '2px solid var(--color-accent)' : '1px solid var(--color-border)', borderRadius: '12px', padding: '1.75rem 1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  {idx === 1 && (
                                    <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent)', color: 'var(--color-bg)', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Recomendado</span>
                                  )}
                                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{op.titulo}</div>
                                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>{op.valorFormatado}</div>
                                  {op.descricao && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem', lineHeight: 1.4 }}>{op.descricao}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ background: 'var(--color-bg)', border: '2px solid var(--color-accent)', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>{formatBRL(mensalidade as number)}</span>
                              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>/ mês</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            )}

            {mostrarDetalhesComerciais && (
              <div className="proposta-invest__details" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '2.5rem' }}>
              <div className="proposta-invest__card" style={{ background: 'var(--color-bg-alt)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--color-border-light)' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text)' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 
                  Formas de pagamento
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{pagamento.descricao}</p>
              </div>
              
              <div className="proposta-invest__card" style={{ background: 'var(--color-bg-alt)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--color-border-light)' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text)' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> 
                  Tempo estimado de entrega
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>{prazoEntrega}</p>
              </div>
              </div>
            )}
            
            <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem' }}>
              Emitida em {new Date(criadoEm).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })} • Válida por {validade}
            </div>
          </div>
        </section>

        {/* Observações */}
        {observacoes && (
          <section className="proposta-section proposta-obs" aria-label="Observações">
            <h2 className="proposta-section__title">Observações</h2>
            <p className="proposta-obs__text">{observacoes}</p>
          </section>
        )}

        {/* CTA */}
        <section className="proposta-cta" aria-label="Próximos passos">
          <div className="proposta-cta__inner">
            <div className="proposta-cta__content" style={{ flex: 1, minWidth: '280px' }}>
              <h2 className="proposta-cta__title">Pronto para começar?</h2>
              <p className="proposta-cta__sub">
                Entre em contato para aprovar a proposta e dar início ao projeto.
              </p>
            </div>
            
            <div className="proposta-cta__actions" style={{ flex: '1 1 auto', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => navigate(`/proposta/${slug}/pdf`)}
                className="btn btn--outline proposta-cta__btn"
              >
                Salvar proposta em PDF
              </button>
              <a
                href={`https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Referente%20%C3%A0%20proposta%20do%20projeto.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary proposta-cta__btn"
              >
                Aprovar pelo WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="proposta-footer">
        <div style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text)', marginBottom: '1rem' }}>
          edunicoleti<span style={{ color: 'var(--color-accent)' }}>.</span>
        </div>
        <p>
          Este é um documento confidencial gerado para {cliente.empresa}.<br />
          <a href="https://www.edunicoleti.com.br" target="_blank" rel="noopener noreferrer">
            edunicoleti.com.br
          </a>
          {' '}·{' '}
          <a href="https://wa.me/5549999531382">+55 (49) 99953-1382</a>
          {' '}·{' '}
          <a href="mailto:edunicoleti@gmail.com">edunicoleti@gmail.com</a>
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          © {new Date().getFullYear()} Eduardo Nicoleti.
        </p>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Referente%20%C3%A0%20proposta%20do%20projeto."
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        aria-label="Aprovar pelo WhatsApp"
      >
        <span className="floating-whatsapp-btn__text">Aprovar pelo WhatsApp</span>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.299 1.262.478 1.694.611.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  )
}
