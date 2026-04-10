import { useEffect, useRef } from 'react'
import './Hero.css'

// Words that cycle on line 3 of the heading
const words = [
  'converte.',
  'posiciona.',
  'escala.',
  'conecta.',
  'transforma.',
]

// Inline SVG social icons
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

export default function Hero() {
  const wordRef = useRef<HTMLSpanElement>(null)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = wordRef.current
    if (!el) return

    el.textContent = words[0]

    function cycle() {
      if (!el) return

      // Exit: slide up + blur + fade
      el.style.transition = 'transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.3s ease, filter 0.3s ease'
      el.style.transform = 'translateY(-70%) scale(0.92)'
      el.style.opacity = '0'
      el.style.filter = 'blur(8px)'

      timerRef.current = setTimeout(() => {
        if (!el) return
        // Swap text while invisible
        indexRef.current = (indexRef.current + 1) % words.length
        el.textContent = words[indexRef.current]

        // Position below, no transition
        el.style.transition = 'none'
        el.style.transform = 'translateY(60%) scale(1.08)'
        el.style.opacity = '0'
        el.style.filter = 'blur(8px)'

        // Enter with spring bounce
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition =
              'transform 0.52s cubic-bezier(0.34,1.56,0.64,1), opacity 0.38s ease, filter 0.38s ease'
            el.style.transform = 'translateY(0) scale(1)'
            el.style.opacity = '1'
            el.style.filter = 'blur(0px)'
          })
        })

        timerRef.current = setTimeout(cycle, 2600)
      }, 360)
    }

    timerRef.current = setTimeout(cycle, 2600)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <section className="hero" id="inicio" aria-label="Apresentação">
      <div className="ambient-orbs" aria-hidden="true">
        <div className="orb orb--blue" />
        <div className="orb orb--indigo" />
        <div className="orb orb--teal" />
      </div>
      <div className="grid-lines" aria-hidden="true" />

      <div className="container hero__container">
        <div className="hero__inner">

          {/* Badge */}
          <div className="hero__badge reveal">
            <span className="hero__dot" aria-hidden="true" />
            <span className="text-label">Disponível para novos projetos</span>
          </div>

          {/* 3-line heading: the last word is the animated star */}
          <h1 className="hero__heading reveal" aria-label={`Presença digital que ${words[0]}`}>
            <span className="hero__heading-top">Presença</span>
            <span className="hero__heading-mid">digital que</span>
            {/* Animated word container with fixed overflow clip */}
            <span className="hero__word-clip" aria-live="polite">
              <span ref={wordRef} className="hero__word" />
            </span>
          </h1>

          {/* Static subtitle */}
          <p className="hero__sub reveal">
            Crio produtos digitais que encantam usuários, geram autoridade
            e impulsionam resultados reais para o seu negócio.
          </p>

          {/* CTAs */}
          <div className="hero__actions reveal">
            <a
              href="https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Quero%20falar%20sobre%20um%20projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--accent hero__btn"
              id="hero-whatsapp-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Iniciar um projeto
            </a>
            <a
              href="#servicos"
              className="btn btn--outline"
              id="hero-services-btn"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#servicos')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Ver serviços
            </a>
          </div>

          {/* Stats + Social */}
          <div className="hero__bottom reveal">
            <div className="hero__stats" aria-label="Números">
              <div className="hero__stat">
                <span className="hero__stat-value">10+</span>
                <span className="hero__stat-label">Anos de experiência</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-value">50+</span>
                <span className="hero__stat-label">Projetos entregues</span>
              </div>
            </div>

            <div className="hero__social" aria-label="Redes sociais">
              <a href="https://www.linkedin.com/in/edunicoleti/" target="_blank"
                 rel="noopener noreferrer" className="hero__social-link"
                 id="hero-linkedin-btn" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://www.instagram.com/edunicoleti/" target="_blank"
                 rel="noopener noreferrer" className="hero__social-link"
                 id="hero-instagram-btn" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Right: CSS digital product visual */}
        <div className="hero__visual reveal" aria-hidden="true">
          <div className="hero__product">

            {/* Main browser card */}
            <div className="hero__browser">
              <div className="hero__browser-bar">
                <div className="hero__browser-dots">
                  <span /><span /><span />
                </div>
                <div className="hero__browser-url">edunicoleti.com.br</div>
              </div>
              <div className="hero__browser-body">
                {/* Chart */}
                <div className="hero__chart">
                  <svg viewBox="0 0 160 70" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2047C9"/>
                        <stop offset="100%" stopColor="#7C3AED"/>
                      </linearGradient>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2047C9" stopOpacity="0.18"/>
                        <stop offset="100%" stopColor="#2047C9" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,60 20,52 40,44 70,30 100,18 130,10 160,3 L160,70 L0,70 Z"
                      fill="url(#areaGrad)"
                    />
                    <polyline
                      points="0,60 20,52 40,44 70,30 100,18 130,10 160,3"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="hero__chart-line"
                    />
                  </svg>
                </div>

                {/* Metric row */}
                <div className="hero__metrics">
                  <div className="hero__metric-block">
                    <span className="hero__metric-num">+127%</span>
                    <span className="hero__metric-lbl">Conversão</span>
                  </div>
                  <div className="hero__metric-block">
                    <span className="hero__metric-num">2.4s</span>
                    <span className="hero__metric-lbl">Load time</span>
                  </div>
                  <div className="hero__metric-block">
                    <span className="hero__metric-num">100</span>
                    <span className="hero__metric-lbl">PageSpeed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification */}
            <div className="hero__notif">
              <span className="hero__notif-dot" />
              <span className="hero__notif-text">Nova conversão · agora</span>
            </div>

            {/* Floating device badge */}
            <div className="hero__device-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <line x1="12" x2="12.01" y1="18" y2="18"/>
              </svg>
              Mobile first
            </div>

            {/* Google Badge */}
            <div className="hero__google-badge">
              <span className="hero__google-logo">
                <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </span>
              SEO Otimizado
            </div>

            {/* Performance ring */}
            <div className="hero__perf-ring-wrap">
              <svg viewBox="0 0 64 64" width="64" height="64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#E4E2DC" strokeWidth="5"/>
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke="url(#ringGrad)" strokeWidth="5"
                  strokeDasharray="163.4" strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                  className="hero__perf-arc"
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2047C9"/>
                    <stop offset="100%" stopColor="#7C3AED"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="hero__perf-num">100</span>
            </div>

            {/* Connection nodes (decorative) */}
            <div className="hero__nodes" aria-hidden="true">
              <div className="hero__node hero__node--1" />
              <div className="hero__node hero__node--2" />
              <div className="hero__node hero__node--3" />
              <svg className="hero__connectors" viewBox="0 0 300 300">
                <line className="hero__connector-line" x1="150" y1="150" x2="40" y2="80"/>
                <line className="hero__connector-line" x1="150" y1="150" x2="260" y2="70"/>
                <line className="hero__connector-line" x1="150" y1="150" x2="250" y2="230"/>
              </svg>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
