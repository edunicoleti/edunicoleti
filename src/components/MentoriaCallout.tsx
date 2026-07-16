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
              Ecossistema de software com{' '}
              <span className="text-serif" style={{ fontStyle: 'italic' }}>IA</span>{' '}
              para sua empresa
            </h2>
            <p className="m-callout__desc">
              Desenvolva o ecossistema da sua empresa com Claude Code: sistema de
              gestão próprio, agentes de IA 24h e integrações via MCP. Mentoria
              individual, presencial em Chapecó/SC ou online.
            </p>
          </div>
          <span className="m-callout__action">
            Conhecer o ecossistema
            <ArrowRight size={18} strokeWidth={2} />
          </span>
        </Link>
      </div>
    </section>
  )
}
