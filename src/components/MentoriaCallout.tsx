import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './MentoriaCallout.css'

export default function MentoriaCallout() {
  return (
    <section className="m-callout" aria-label="Mentoria de Claude Code">
      <div className="container">
        <Link to="/mentoria" className="m-callout__card reveal" id="home-mentoria-callout">
          <div className="m-callout__content">
            <span className="m-callout__badge">Novo</span>
            <h2 className="m-callout__title">
              Mentoria de{' '}
              <span className="text-serif" style={{ fontStyle: 'italic' }}>Claude Code</span>
            </h2>
            <p className="m-callout__desc">
              Pra empreendedores que já usam Claude Code e querem transformar o chat em
              operação: automações, integrações e soluções sob medida, com acompanhamento
              individual.
            </p>
          </div>
          <span className="m-callout__action">
            Conhecer a mentoria
            <ArrowRight size={18} strokeWidth={2} />
          </span>
        </Link>
      </div>
    </section>
  )
}
