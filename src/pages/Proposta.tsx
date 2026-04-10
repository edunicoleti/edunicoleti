import { useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { todasPropostas } from '../data/propostas'
import './Proposta.css'

export default function Proposta() {
  const { slug } = useParams<{ slug: string }>()
  const proposta = todasPropostas.find((p) => p.slug === slug)

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
    tecnologias,
    prazoEntrega,
    valorTotal,
    mensalidade,
    pagamento,
    validade,
    observacoes,
    criadoEm,
  } = proposta

  const formatBRL = (val: number) =>
    val > 0
      ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : 'A confirmar'

  const itensSim = escopo.filter((i) => i.incluido)

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

        {/* Escopo */}
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

        {/* Tecnologias */}
        <section className="proposta-section" aria-label="Tecnologias">
          <h2 className="proposta-section__title">Tecnologias utilizadas</h2>
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
            
            <div className="proposta-invest__grid" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="text-label" style={{ fontSize: '0.85rem' }}>Implantação do Projeto</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>{formatBRL(valorTotal)}</span>
                
                <ul className="proposta-invest__features">
                  <li>Design UI/UX corporativo</li>
                  <li>Desenvolvimento técnico (React) + SEO</li>
                  <li>Configuração primária e integrações</li>
                </ul>
              </div>
              
              {mensalidade && mensalidade > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span className="text-label" style={{ fontSize: '0.85rem' }}>Manutenção e Hospedagem</span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-accent)', lineHeight: 1 }}>{formatBRL(mensalidade)}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>/ mês</span>
                  </span>
                  
                  <ul className="proposta-invest__features">
                    <li>Hospedagem Cloud premium (alta performance)</li>
                    <li>Backups semanais blindados de segurança</li>
                    <li>Atualizações preventivas de banco e suporte</li>
                  </ul>
                </div>
              )}
            </div>
            
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
                onClick={() => window.print()}
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
