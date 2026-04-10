import './About.css'

// Inline SVG icons for social platforms
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

export default function About() {
  return (
    <section className="about" id="sobre" aria-label="Sobre Eduardo Nicoleti">
      <div className="container">
        <div className="about__inner">
          <div className="about__left reveal">
            <p className="text-label">Sobre</p>
          </div>

          <div className="about__right">
            <h2 className="about__heading reveal">
              Seu site deveria ser seu melhor{' '}
              <span className="text-serif" style={{ fontStyle: 'italic' }}>vendedor.</span>
            </h2>

            <p className="about__text reveal">
              Sou Eduardo Nicoleti, Webdesigner e especialista em{' '}
              <strong>UX/UI Design e desenvolvimento de produtos digitais.</strong>{' '}
              Há mais de 10 anos, ajudo empresas a conquistar espaço no mundo digital com projetos
              que unem estética apurada, tecnologia robusta e estratégia de posicionamento.
            </p>

            <p className="about__text reveal">
              Cada projeto começa com um briefing profundo. Entendo o negócio, o público e os
              objetivos reais. A partir daí, construo experiências digitais que geram autoridade,
              trazem tráfego orgânico e convertem visitantes em clientes.
            </p>

            <div className="about__pills reveal">
              {[
                'UX Research',
                'UI Design',
                'Design System',
                'React / Next.js',
                'SEO Técnico',
                'Performance Web',
                'Responsividade',
                'Acessibilidade',
              ].map((skill) => (
                <span className="tag" key={skill}>{skill}</span>
              ))}
            </div>

            <div className="about__social reveal">
              <a
                href="https://www.linkedin.com/in/edunicoleti/"
                target="_blank"
                rel="noopener noreferrer"
                className="about__social-btn"
                id="about-linkedin-btn"
                aria-label="LinkedIn de Eduardo Nicoleti"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/edunicoleti/"
                target="_blank"
                rel="noopener noreferrer"
                className="about__social-btn about__social-btn--instagram"
                id="about-instagram-btn"
                aria-label="Instagram de Eduardo Nicoleti"
              >
                <InstagramIcon />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
