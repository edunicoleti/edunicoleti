import { Globe, TrendingUp, Layers } from 'lucide-react'
import './Services.css'

const services = [
  {
    id: 'sites',
    Icon: Globe,
    title: 'Sites Institucionais',
    description:
      'Sites profissionais que transmitem credibilidade, apresentam o negócio com clareza e posicionam a empresa nas primeiras posições do Google.',
    tags: ['SEO', 'Performance', 'Responsivo'],
  },
  {
    id: 'landing',
    Icon: TrendingUp,
    title: 'Landing Pages',
    description:
      'Páginas de conversão altamente focadas, projetadas para transformar visitantes em leads ou vendas com copy estratégico e design que guia a decisão do cliente.',
    tags: ['Tráfego', 'Conversão', 'Resultados'],
  },
  {
    id: 'custom',
    Icon: Layers,
    title: 'Projetos Personalizados',
    description:
      'Plataformas, WebApps, PWAs e dashboards sob medida. Da concepção à entrega, com tecnologia moderna, experiência mobile completa e documentação completa.',
    tags: ['WebApp', 'PWA', 'Next.js'],
  },
]

export default function Services() {
  return (
    <section className="services" id="servicos" aria-label="Serviços">
      <div className="container">
        <div className="services__header reveal">
          <p className="text-label">Serviços</p>
          <h2 className="services__heading">
            O que posso{' '}
            <span className="text-serif" style={{ fontStyle: 'italic' }}>criar</span>{' '}
            para você
          </h2>
        </div>

        <div className="services__grid">
          {services.map((s, i) => (
            <article
              className="service-card reveal"
              key={s.id}
              id={`service-${s.id}`}
              style={{ transitionDelay: `${i * 80}ms` }}
              aria-label={s.title}
            >
              <div className="service-card__icon-wrap" aria-hidden="true">
                <s.Icon size={24} strokeWidth={1.5} />
              </div>
              {/* body wrapper for horizontal layout on mobile */}
              <div className="service-card__body">
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.description}</p>
                <div className="service-card__tags">
                  {s.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
