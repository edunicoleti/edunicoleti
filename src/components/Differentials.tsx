import './Differentials.css'

const differentials = [
  {
    id: 'seo',
    icon: '↗',
    title: 'Posicionamento no Google',
    description:
      'SEO técnico completo desde a estrutura do código. Seu site aparece quando seu cliente pesquisa pelo serviço que você oferece.',
    metric: '90+',
    metricLabel: 'PageSpeed Score',
  },
  {
    id: 'design',
    icon: '◈',
    title: 'Design que gera autoridade',
    description:
      'Interface profissional que transmite confiança. Empresas com design premium são percebidas como mais sérias e cobram mais.',
    metric: '100%',
    metricLabel: 'Identidade consistente',
  },
  {
    id: 'responsive',
    icon: '◻',
    title: 'Responsivo em todos os dispositivos',
    description:
      'Mais de 60% do tráfego web vem do celular. Cada projeto é desenvolvido mobile-first, garantindo experiência perfeita em qualquer tela.',
    metric: '100%',
    metricLabel: 'Mobile-first',
  },
  {
    id: 'performance',
    icon: '⚡',
    title: 'Performance e velocidade',
    description:
      'Sites lentos perdem clientes. Otimização de imagens, carregamento assíncrono e CDN garantem velocidade que retém usuários.',
    metric: '<2s',
    metricLabel: 'Tempo de carregamento',
  },
  {
    id: 'briefing',
    icon: '✎',
    title: 'Briefing estratégico',
    description:
      'Não faço sites "genéricos". Estudo seu segmento, entendo sua persona e construo uma estratégia de conteúdo que comunica valor real.',
    metric: '100%',
    metricLabel: 'Personalizado',
  },
  {
    id: 'tech',
    icon: '⬡',
    title: 'Tecnologia robusta e escalável',
    description:
      'Uso React, Next.js e TypeScript — as mesmas tecnologias usadas por grandes empresas. Seu site cresce junto com o seu negócio.',
    metric: '∞',
    metricLabel: 'Escalabilidade',
  },
]

export default function Differentials() {
  return (
    <section className="differentials" id="diferenciais" aria-label="Diferenciais">
      <div className="container">
        <div className="differentials__header reveal">
          <p className="text-label">Diferenciais</p>
          <h2 className="differentials__heading">
            Por que um projeto{' '}
            <span className="text-serif" style={{ fontStyle: 'italic' }}>bem feito</span>{' '}
            faz diferença
          </h2>
        </div>

        <div className="differentials__grid">
          {differentials.map((d, i) => (
            <article
              className="diff-card reveal"
              key={d.id}
              id={`diff-${d.id}`}
              style={{ transitionDelay: `${i * 70}ms` }}
              aria-label={d.title}
            >
              <div className="diff-card__top">
                <span className="diff-card__icon" aria-hidden="true">{d.icon}</span>
                <div className="diff-card__metric" aria-label={`${d.metric} ${d.metricLabel}`}>
                  <span className="diff-card__metric-value">{d.metric}</span>
                  <span className="diff-card__metric-label">{d.metricLabel}</span>
                </div>
              </div>
              <h3 className="diff-card__title">{d.title}</h3>
              <p className="diff-card__desc">{d.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
