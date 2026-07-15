import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './MentoriaCallout.css'

export default function MentoriaCallout() {
  return (
    <section className="m-callout" aria-label="Mentoria de Claude Code">
      <div className="container">
        <Link to="/mentoria" className="m-callout__card reveal" id="home-mentoria-callout">
          <div className="m-callout__content">
            <span className="m-callout__badge">Agenda aberta</span>
            <h2 className="m-callout__title">
              Claude Code como{' '}
              <span className="text-serif" style={{ fontStyle: 'italic' }}>sistema operacional</span>{' '}
              da sua empresa
            </h2>
            <p className="m-callout__desc">
              Eu analiso o contexto do seu negócio e implanto automações de gestão:
              relatórios, propostas, financeiro e follow-ups rodando sem depender
              de você. Consultoria e mentoria 1:1.
            </p>
          </div>
          <span className="m-callout__action">
            Conhecer a consultoria
            <ArrowRight size={18} strokeWidth={2} />
          </span>
        </Link>
      </div>
    </section>
  )
}
