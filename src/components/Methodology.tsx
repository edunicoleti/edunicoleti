import { FileText, LayoutTemplate, Palette, Terminal, Gauge, Send } from 'lucide-react'
import './Methodology.css'

const steps = [
  {
    number: '01',
    title: 'Briefing',
    Icon: FileText,
    description: 'Entendimento profundo do negócio, público e objetivos.',
  },
  {
    number: '02',
    title: 'Arquitetura',
    Icon: LayoutTemplate,
    description: 'Estrutura de informação, fluxos e wireframes.',
  },
  {
    number: '03',
    title: 'Design',
    Icon: Palette,
    description: 'Interface visual, identidade e protótipo navegável.',
  },
  {
    number: '04',
    title: 'Desenvolvimento',
    Icon: Terminal,
    description: 'Código limpo, semântico, responsivo e performático.',
  },
  {
    number: '05',
    title: 'SEO & QA',
    Icon: Gauge,
    description: 'Otimização técnica, testes e auditoria de qualidade.',
  },
  {
    number: '06',
    title: 'Entrega',
    Icon: Send,
    description: 'Deploy, treinamento e suporte pós-lançamento.',
  },
]

export default function Methodology() {
  return (
    <section className="methodology" id="metodologia" aria-label="Metodologia de trabalho">
      <div className="container">
        <div className="methodology__header reveal">
          <p className="text-label">Metodologia</p>
          <h2 className="methodology__heading">
            Do briefing à entrega,{' '}
            <span className="text-serif" style={{ fontStyle: 'italic' }}>sem surpresas.</span>
          </h2>
          <p className="methodology__sub">
            Um processo claro e colaborativo que garante resultado consistente.
          </p>
        </div>

        <div className="timeline" role="list" aria-label="Etapas do processo">
          {steps.map((step, i) => (
            <div
              className="timeline__item reveal"
              key={step.number}
              style={{ transitionDelay: `${i * 80}ms` }}
              role="listitem"
              id={`timeline-step-${step.number}`}
            >
              {i < steps.length - 1 && (
                <div className="timeline__connector" aria-hidden="true" />
              )}

              <div className="timeline__node" aria-hidden="true">
                <step.Icon size={22} strokeWidth={1.5} />
                <div className="timeline__node-ring" />
              </div>

              <div className="timeline__content">
                <span className="timeline__step-num">{step.number}</span>
                <h3 className="timeline__title">{step.title}</h3>
                <p className="timeline__desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
