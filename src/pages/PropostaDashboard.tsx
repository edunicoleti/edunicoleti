import { Link } from 'react-router-dom'
import { todasPropostas } from '../data/propostas'
import './PropostaDashboard.css'

export default function PropostaDashboard() {
  return (
    <div className="dashboard" id="proposals-dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-brand">
          <Link to="/" className="dashboard__logo">
            eduardo nicoleti<span>.</span>
          </Link>
          <span className="text-label">Painel de Propostas</span>
        </div>
        <Link to="/" className="btn btn--outline dashboard__back">
          ← Voltar ao site
        </Link>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__top">
          <h1 className="dashboard__title">Propostas de Projeto</h1>
          <p className="dashboard__sub">
            {todasPropostas.length} proposta{todasPropostas.length !== 1 ? 's' : ''} ativa{todasPropostas.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="dashboard__grid">
          {todasPropostas.map((p) => {
            const hasValue = p.valorTotal > 0
            const dateStr = new Date(p.criadoEm).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })

            return (
              <article
                className="prop-card"
                key={p.slug}
                id={`prop-card-${p.slug}`}
              >
                <div className="prop-card__top">
                  <div className="prop-card__tags">
                    {p.projeto.tags.slice(0, 2).map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <span className="prop-card__date">{dateStr}</span>
                </div>

                <h2 className="prop-card__title">{p.projeto.titulo}</h2>
                <p className="prop-card__client">
                  <strong>{p.cliente.nome}</strong> · {p.cliente.empresa}
                </p>

                <div className="prop-card__meta">
                  <div className="prop-card__meta-item">
                    <span className="prop-card__meta-label">Valor</span>
                    <span className="prop-card__meta-value">
                      {hasValue
                        ? p.valorTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : 'A confirmar'}
                    </span>
                  </div>
                  <div className="prop-card__meta-item">
                    <span className="prop-card__meta-label">Prazo</span>
                    <span className="prop-card__meta-value">{p.prazoEntrega}</span>
                  </div>
                  <div className="prop-card__meta-item">
                    <span className="prop-card__meta-label">Válida por</span>
                    <span className="prop-card__meta-value">{p.validade}</span>
                  </div>
                </div>

                <div className="prop-card__actions">
                  <Link
                    to={`/proposta/${p.slug}`}
                    className="btn btn--primary prop-card__view"
                    id={`view-proposta-${p.slug}`}
                  >
                    Ver proposta
                  </Link>
                  <button
                    className="btn btn--outline prop-card__copy"
                    id={`copy-proposta-${p.slug}`}
                    onClick={() => {
                      const url = `${window.location.origin}/proposta/${p.slug}`
                      navigator.clipboard.writeText(url).then(() => {
                        alert('Link copiado: ' + url)
                      })
                    }}
                  >
                    Copiar link
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="dashboard__help">
          <p className="text-label" style={{ marginBottom: '0.75rem' }}>Como adicionar uma nova proposta</p>
          <ol className="dashboard__steps">
            <li>Abra o arquivo <code>src/data/propostas.ts</code></li>
            <li>Copie o objeto <code>propostaPreamar</code> e altere o <code>slug</code> e os dados</li>
            <li>Adicione o novo objeto ao array <code>todasPropostas</code></li>
            <li>Acesse <code>/proposta/[slug]</code> e envie o link ao cliente</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
