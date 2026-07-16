import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Cable,
  Check,
  ClipboardCheck,
  Landmark,
  LayoutDashboard,
  LineChart,
  MapPin,
  MessageCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  Table2,
  Video,
  Zap,
} from 'lucide-react'
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'motion/react'
import './Mentoria.css'

/*
 * Link da página de agendamento (Google Calendar / Cal.com).
 * Enquanto vazio, os botões de agendamento caem no WhatsApp.
 */
const SCHEDULING_URL = ''

const WHATSAPP_URL =
  'https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Quero%20agendar%20um%20diagn%C3%B3stico%20do%20ecossistema%20da%20minha%20empresa.'

const agendaHref = SCHEDULING_URL || WHATSAPP_URL

/* ---- Dados ---- */

const integracoes = [
  { slug: 'meta', name: 'Meta' },
  { slug: 'google', name: 'Google' },
  { slug: 'googleanalytics', name: 'Google Analytics' },
  { slug: 'googlesheets', name: 'Google Sheets' },
  { slug: 'whatsapp', name: 'WhatsApp' },
  { slug: 'gmail', name: 'Gmail' },
  { slug: 'googlecalendar', name: 'Google Agenda' },
  { slug: 'instagram', name: 'Instagram' },
  { slug: 'googledrive', name: 'Google Drive' },
  { slug: 'stripe', name: 'Stripe' },
]

const agentFeed = [
  { time: '03:12', text: 'Conciliação do extrato concluída', ok: true },
  { time: '06:00', text: 'Relatório da semana gerado', ok: true },
  { time: '06:45', text: 'Follow-up de 4 clientes preparado', ok: true },
  { time: '07:30', text: 'Resumo enviado no seu WhatsApp', ok: true },
  { time: 'agora', text: 'Monitorando indicadores do dia', ok: false },
]

const faqs = [
  {
    q: 'Preciso entender de tecnologia?',
    a: 'Não. A mentoria existe justamente pra isso: eu guio a parte técnica e você mantém o comando do negócio.',
  },
  {
    q: 'Preciso já usar Claude Code?',
    a: 'Não. Se já usa, aceleramos. Se nunca abriu, começamos do zero, do jeito certo.',
  },
  {
    q: 'O que é um ecossistema de software?',
    a: 'O conjunto de sistema de gestão, agentes de IA e integrações trabalhando juntos, feito sob medida pro seu negócio. E que fica seu.',
  },
  {
    q: 'Serve pro meu ramo?',
    a: 'Se o seu negócio tem rotina, dados e decisões, serve. O ecossistema é desenhado na sua realidade, não é pacote pronto.',
  },
  {
    q: 'Quanto custa?',
    a: 'Depende da estratégia que desenharmos juntos. O diagnóstico é gratuito e você sai dele com clareza do caminho, com ou sem contrato.',
  },
  {
    q: 'O que preciso ter?',
    a: 'Uma assinatura do Claude com acesso ao Claude Code e vontade de evoluir a gestão. O resto a gente constrói.',
  },
]

/* ---- Motion primitives ---- */

/** Reveal palavra a palavra (padrão da referência: y 120% + blur → 0) */
function WordReveal({ text, accent }: { text: string; accent?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()

  let wordIndex = 0
  const renderWords = (str: string, keyPrefix: string) =>
    str.split(' ').map((word, i) => {
      const delay = wordIndex++ * 0.04
      return (
        <span key={`${keyPrefix}-${i}`}>
          <span className="wr">
            <motion.span
              className="wr__inner"
              initial={reduced ? false : { y: '120%', opacity: 0, filter: 'blur(10px)' }}
              animate={
                !reduced && inView
                  ? { y: '0%', opacity: 1, filter: 'blur(0px)' }
                  : undefined
              }
              transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>{' '}
        </span>
      )
    })

  return (
    <span ref={ref}>
      {renderWords(text, 't')}
      {accent && <span className="wr-accent">{renderWords(accent, 'a')}</span>}
    </span>
  )
}

/** Fade-up com blur (padrão da referência para blocos) */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { y: 40, opacity: 0, filter: 'blur(8px)' }}
      whileInView={reduced ? {} : { y: 0, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/* ---- Progress bar de leitura ---- */
function ReadingProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  if (reduced) return null
  return <motion.div className="mt-progress" style={{ scaleX }} aria-hidden="true" />
}

/* ---- Sticky CTA bar mobile ---- */
function MobileCtaBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('.mt-hero')
    const cta = document.querySelector('#agendar')
    if (!hero || !cta) return

    let heroGone = false
    let ctaVisible = false
    const update = () => setVisible(heroGone && !ctaVisible)

    const heroIO = new IntersectionObserver(([e]) => {
      heroGone = !e.isIntersecting
      update()
    })
    const ctaIO = new IntersectionObserver(([e]) => {
      ctaVisible = e.isIntersecting
      update()
    })
    heroIO.observe(hero)
    ctaIO.observe(cta)
    return () => {
      heroIO.disconnect()
      ctaIO.disconnect()
    }
  }, [])

  return (
    <div className={`mt-sticky-cta ${visible ? 'mt-sticky-cta--show' : ''}`}>
      <a
        href={agendaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-btn mt-sticky-cta__btn"
        id="mentoria-sticky-agendar-btn"
      >
        <span className="mt-btn__orb" aria-hidden="true" />
        <span className="mt-btn__label">Agendar diagnóstico</span>
        <span className="mt-btn__chip">
          <ArrowRight size={15} strokeWidth={2} />
        </span>
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-sticky-cta__wa"
        id="mentoria-sticky-whatsapp-btn"
        aria-label="Chamar no WhatsApp"
      >
        <MessageCircle size={22} strokeWidth={2} />
      </a>
    </div>
  )
}

/* ---- FAQ controlado (grid-template-rows 0fr→1fr) ---- */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <FadeUp className={`mt-faq__item ${open ? 'mt-faq__item--open' : ''}`}>
      <button
        type="button"
        className="mt-faq__q"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {q}
        <span className="mt-faq__marker" aria-hidden="true" />
      </button>
      <div className="mt-faq__body">
        <div className="mt-faq__body-inner">
          <p className="mt-faq__a">{a}</p>
        </div>
      </div>
    </FadeUp>
  )
}

/* ---- Feed do agente 24h ---- */
function AgentFeed() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduced = useReducedMotion()

  return (
    <div className="mt-agent__feed" ref={ref}>
      {agentFeed.map((e, i) => (
        <motion.div
          className="mt-agent__entry"
          key={e.time}
          initial={reduced ? false : { x: 24, opacity: 0 }}
          animate={!reduced && inView ? { x: 0, opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mt-agent__time">{e.time}</span>
          <span className={`mt-agent__dot ${e.ok ? '' : 'mt-agent__dot--live'}`} aria-hidden="true">
            {e.ok && <Check size={10} strokeWidth={3} />}
          </span>
          <span className="mt-agent__text">{e.text}</span>
        </motion.div>
      ))}
    </div>
  )
}

/* ---- Hub orbital do ecossistema ---- */
function OrbitalHub() {
  const chips = [
    { icon: BarChart3, label: 'Relatórios', pos: 'top' },
    { icon: Landmark, label: 'Financeiro', pos: 'right' },
    { icon: MessageCircle, label: 'WhatsApp', pos: 'bottom' },
    { icon: Table2, label: 'Planilhas', pos: 'left' },
    { icon: Bot, label: 'Agente de IA', pos: 'tr' },
    { icon: LineChart, label: 'Analytics', pos: 'bl' },
  ]
  return (
    <div className="mt-hub" aria-label="Ecossistema: sistema de gestão no centro, agentes e integrações conectados">
      <div className="mt-hub__grid" aria-hidden="true" />
      <div className="mt-hub__cross mt-hub__cross--v" aria-hidden="true" />
      <div className="mt-hub__cross mt-hub__cross--h" aria-hidden="true" />
      <div className="mt-hub__scene" aria-hidden="true">
        <div className="mt-hub__ring mt-hub__ring--outer" />
        <div className="mt-hub__ring mt-hub__ring--inner" />
      </div>
      <div className="mt-hub__core">
        <div className="mt-hub__aura" aria-hidden="true" />
        <div className="mt-hub__matrix" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className="mt-hub__core-label">seu sistema</span>
      </div>
      {chips.map((c) => {
        const Icon = c.icon
        return (
          <div className={`mt-hub__chip mt-hub__chip--${c.pos}`} key={c.label}>
            <Icon size={18} strokeWidth={1.8} />
            <span className="mt-hub__chip-label">{c.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function useMeta() {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''

    document.title =
      'Ecossistema de Software com IA para Empresas | Claude Code | Eduardo Nicoleti'
    metaDesc?.setAttribute(
      'content',
      'Desenvolva o ecossistema de software da sua empresa com Claude Code: sistema de gestão próprio, agentes de IA 24h e integrações via MCP. Mentoria individual, presencial em Chapecó/SC ou online.'
    )

    return () => {
      document.title = prevTitle
      metaDesc?.setAttribute('content', prevDesc)
    }
  }, [])
}

export default function Mentoria() {
  useMeta()
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const onScroll = () => setNavSolid(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToAgendar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector('#agendar')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mentoria">
      <ReadingProgress />
      <MobileCtaBar />

      {/* ---- Nav ---- */}
      <nav className={`mt-nav ${navSolid ? 'mt-nav--solid' : ''}`}>
        <div className="mt-container mt-nav__inner">
          <Link to="/" className="mt-nav__logo">
            edunicoleti<span>.</span>
          </Link>
          <div className="mt-nav__right">
            <span className="mt-nav__tag">claude code · agentes de ia</span>
            <a
              href="#agendar"
              onClick={scrollToAgendar}
              className="mt-btn mt-btn--sm"
              id="mentoria-nav-agendar-btn"
            >
              <span className="mt-btn__orb" aria-hidden="true" />
              <span className="mt-btn__label">Agendar diagnóstico</span>
              <span className="mt-btn__chip">
                <ArrowUpRight size={14} strokeWidth={2} />
              </span>
            </a>
          </div>
        </div>
      </nav>

      <main className="mt-shell">
        <div className="mt-shell__line mt-shell__line--left" aria-hidden="true" />
        <div className="mt-shell__line mt-shell__line--right" aria-hidden="true" />

        {/* ---- Hero ---- */}
        <section className="mt-hero" aria-label="Ecossistema de software com IA">
          <div className="mt-container mt-hero__inner">
            <div className="mt-hero__copy">
              <FadeUp className="mt-hero__kicker-wrap" delay={0}>
                <span className="mt-kicker">
                  <span className="mt-kicker__icon">
                    <Sparkles size={15} strokeWidth={2} />
                  </span>
                  ecossistema de software com ia
                </span>
              </FadeUp>

              <h1 className="mt-hero__heading">
                <WordReveal text="Escale sua operação" accent="com IA." />
              </h1>

              <FadeUp delay={0.25}>
                <p className="mt-hero__sub">
                  Te ajudo a desenvolver o ecossistema de software da sua empresa
                  com Claude Code: agentes de IA conectados ao cérebro do negócio,
                  executando tarefas e apoiando decisões 24 horas por dia.
                </p>
              </FadeUp>

              <FadeUp delay={0.35} className="mt-hero__actions">
                <a
                  href={agendaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-btn mt-btn--lg"
                  id="mentoria-hero-agendar-btn"
                >
                  <span className="mt-btn__orb" aria-hidden="true" />
                  <span className="mt-btn__label">Agendar diagnóstico</span>
                  <span className="mt-btn__chip">
                    <ArrowUpRight size={18} strokeWidth={2} />
                  </span>
                </a>
                <a
                  href="#ecossistema"
                  className="mt-btn mt-btn--ghost mt-btn--lg"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#ecossistema')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className="mt-btn__label">Como funciona</span>
                  <span className="mt-btn__chip mt-btn__chip--ghost">
                    <ArrowRight size={16} strokeWidth={2} />
                  </span>
                </a>
              </FadeUp>

              <FadeUp delay={0.45}>
                <p className="mt-hero__note">
                  <MapPin size={13} strokeWidth={2} />
                  presencial em chapecó/sc · online em todo o brasil
                </p>
              </FadeUp>
            </div>

            {/* Colagem de painéis (console da empresa) */}
            <FadeUp delay={0.3} className="mt-hero__visual">
              <div className="mt-collage" aria-hidden="true">
                <div className="mt-collage__glow" />

                {/* Painel principal: gestão */}
                <div className="mt-panel mt-collage__dash">
                  <div className="mt-panel__bar">
                    <span className="mt-panel__app">
                      <LayoutDashboard size={15} strokeWidth={2} />
                      Painel da sua empresa
                    </span>
                    <span className="mt-pill mt-pill--live">
                      <span className="mt-pill__dot" /> ao vivo
                    </span>
                  </div>
                  <div className="mt-collage__kpis">
                    <div className="mt-kpi">
                      <span className="mt-kpi__label">Vendas hoje</span>
                      <span className="mt-kpi__value">R$ 12,4k</span>
                      <span className="mt-kpi__delta">+18%</span>
                    </div>
                    <div className="mt-kpi">
                      <span className="mt-kpi__label">Propostas</span>
                      <span className="mt-kpi__value">8</span>
                      <span className="mt-kpi__delta mt-kpi__delta--blue">em curso</span>
                    </div>
                    <div className="mt-kpi">
                      <span className="mt-kpi__label">Pendências</span>
                      <span className="mt-kpi__value">2</span>
                      <span className="mt-kpi__delta mt-kpi__delta--dim">sinalizadas</span>
                    </div>
                  </div>
                  <div className="mt-collage__rows">
                    <div className="mt-collage__row">
                      <span className="mt-collage__row-icon">
                        <Zap size={14} strokeWidth={2} />
                      </span>
                      <div className="mt-collage__row-text">
                        <span className="sk sk--w24" />
                        <span className="sk sk--w16 anim-slide-1" />
                      </div>
                      <span className="mt-collage__row-check anim-pulse">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </div>
                    <div className="mt-collage__row">
                      <span className="mt-collage__row-icon mt-collage__row-icon--cyan">
                        <LineChart size={14} strokeWidth={2} />
                      </span>
                      <div className="mt-collage__row-text">
                        <span className="sk sk--w20" />
                        <span className="sk sk--w14 anim-slide-2" />
                      </div>
                      <span className="mt-collage__row-plus">
                        <Plus size={11} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card navy: agente */}
                <div className="mt-collage__agent anim-float">
                  <div className="mt-collage__agent-top">
                    <span className="mt-pill mt-pill--onNavy">
                      <span className="mt-pill__dot mt-pill__dot--cyan" /> agente ativo
                    </span>
                    <Bot size={22} strokeWidth={1.6} />
                  </div>
                  <p className="mt-collage__agent-title">Caixa fechado, resumo enviado.</p>
                  <p className="mt-collage__agent-sub">
                    3 tarefas executadas enquanto você dormia
                  </p>
                </div>

                {/* Mini card: gráfico */}
                <div className="mt-collage__chart anim-float-slow">
                  <div className="mt-collage__chart-head">
                    <span className="mt-collage__chart-dot">
                      <Check size={9} strokeWidth={3} />
                    </span>
                    Indicadores em dia
                  </div>
                  <div className="mt-collage__bars">
                    <span className="anim-bar-1" style={{ height: 26 }} />
                    <span className="anim-bar-2" style={{ height: 38 }} />
                    <span style={{ height: 22 }} />
                    <span className="anim-bar-3" style={{ height: 48 }} />
                    <span style={{ height: 30 }} />
                    <span className="anim-bar-4" style={{ height: 40 }} />
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ---- Marquee de integrações ---- */}
        <section className="mt-integra" aria-label="Integrações">
          <div className="mt-container">
            <FadeUp>
              <p className="mt-integra__label">
                seu sistema conectado às maiores plataformas do mercado · via mcp
              </p>
            </FadeUp>
            <div className="mt-marquee" aria-hidden="true">
              <div className="mt-marquee__track">
                {[0, 1].map((dup) => (
                  <div className="mt-marquee__group" key={dup}>
                    {integracoes.map((it) => (
                      <span className="mt-marquee__item" key={it.slug}>
                        <img
                          src={`https://api.iconify.design/simple-icons/${it.slug}.svg?color=%2394a3b8`}
                          alt={it.name}
                          width={28}
                          height={28}
                          loading="lazy"
                        />
                        {it.name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- O ecossistema (hub orbital) ---- */}
        <section className="mt-eco" id="ecossistema" aria-label="O ecossistema">
          <div className="mt-container">
            <div className="mt-section-head">
              <FadeUp>
                <span className="mt-kicker">
                  <span className="mt-kicker__icon">
                    <Cable size={15} strokeWidth={2} />
                  </span>
                  01 · o ecossistema
                </span>
              </FadeUp>
              <h2 className="mt-h2">
                <WordReveal text="Conheça, gerencie e" accent="automatize seu negócio." />
              </h2>
              <FadeUp delay={0.15}>
                <p className="mt-section-sub">
                  Um ecossistema de software próprio, desenhado para a sua realidade,
                  que cresce com a empresa. No centro, o seu sistema de gestão.
                  Em volta, agentes e integrações trabalhando por você.
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={0.1}>
              <OrbitalHub />
            </FadeUp>
          </div>
        </section>

        {/* ---- Pilares (grid 4 mini-UIs) ---- */}
        <section className="mt-pilares" id="pilares" aria-label="O que construímos">
          <div className="mt-container">
            <div className="mt-section-head mt-section-head--split">
              <div>
                <FadeUp>
                  <span className="mt-kicker">
                    <span className="mt-kicker__icon">
                      <Sparkles size={15} strokeWidth={2} />
                    </span>
                    02 · o que construímos
                  </span>
                </FadeUp>
                <h2 className="mt-h2">
                  <WordReveal text="Tudo que a sua gestão precisa," accent="construído sob medida." />
                </h2>
              </div>
              <FadeUp delay={0.15}>
                <p className="mt-section-sub">
                  Cada peça é desenvolvida no seu contexto e conectada às outras.
                  Nada de software de prateleira.
                </p>
              </FadeUp>
            </div>

            <div className="mt-pilares__grid">
              {/* 1. Sistema próprio */}
              <FadeUp className="mt-pilar" delay={0}>
                <div className="mt-pilar__visual">
                  <div className="mt-pilar__glow mt-pilar__glow--blue" aria-hidden="true" />
                  <div className="mt-pilar__texture" aria-hidden="true" />
                  <span className="mt-pill mt-pill--float anim-float">
                    <span className="mt-pill__dot" /> 100% seu
                  </span>
                  <div className="mt-pilar__ui">
                    <div className="mt-pilar__ui-head">
                      <span className="dot dot--blue" />
                      <span className="sk sk--w12" />
                      <span className="sk sk--w7 sk--faint" />
                    </div>
                    <div className="mt-pilar__ui-body">
                      <div className="mt-pilar__ui-row mt-pilar__hover-1">
                        <span className="chip chip--blue">
                          <LayoutDashboard size={13} strokeWidth={2} />
                        </span>
                        <span className="sk sk--w20" />
                      </div>
                      <div className="mt-pilar__ui-row mt-pilar__hover-2">
                        <span className="chip chip--cyan">
                          <Table2 size={13} strokeWidth={2} />
                        </span>
                        <span className="sk sk--w16 anim-slide-1" />
                      </div>
                    </div>
                    <div className="mt-pilar__ui-foot">
                      <span className="sk sk--w8 sk--blue" />
                      <span className="sk sk--w6 sk--cyan" />
                      <span className="sk sk--w10 sk--deep" />
                    </div>
                  </div>
                </div>
                <div className="mt-pilar__meta">
                  <div>
                    <h3 className="mt-pilar__title">Sistema de gestão próprio</h3>
                    <p className="mt-pilar__desc">
                      Personalizado para a sua realidade: suas rotinas, seus
                      indicadores, seu jeito de operar.
                    </p>
                  </div>
                  <span className="mt-pilar__arrow">
                    <ArrowRight size={15} strokeWidth={2} />
                  </span>
                </div>
              </FadeUp>

              {/* 2. Agentes (navy) */}
              <FadeUp className="mt-pilar" delay={0.08}>
                <div className="mt-pilar__visual mt-pilar__visual--navy">
                  <div className="mt-pilar__glow mt-pilar__glow--navy1" aria-hidden="true" />
                  <div className="mt-pilar__glow mt-pilar__glow--navy2" aria-hidden="true" />
                  <div className="mt-pilar__texture mt-pilar__texture--navy" aria-hidden="true" />
                  <span className="mt-pill mt-pill--float mt-pill--onNavy anim-float">
                    <span className="mt-pill__dot mt-pill__dot--cyan" /> 24h por dia
                  </span>
                  <div className="mt-pilar__ui mt-pilar__ui--navy">
                    <div className="mt-pilar__ui-head">
                      <span className="dot dot--cyan" />
                      <span className="sk sk--w12 sk--onNavy" />
                      <span className="sk sk--w7 sk--onNavyFaint" />
                    </div>
                    <div className="mt-pilar__ui-body">
                      <div className="mt-pilar__ui-row mt-pilar__ui-row--navy mt-pilar__hover-1">
                        <span className="chip chip--navy">
                          <Bot size={13} strokeWidth={2} />
                        </span>
                        <span className="sk sk--w18 sk--onNavy anim-slide-2" />
                        <span className="chip chip--check anim-pulse">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      </div>
                      <div className="mt-pilar__ui-row mt-pilar__ui-row--navy mt-pilar__hover-2">
                        <span className="chip chip--navy">
                          <Zap size={13} strokeWidth={2} />
                        </span>
                        <span className="sk sk--w14 sk--onNavy" />
                      </div>
                    </div>
                    <div className="mt-pilar__ui-foot">
                      <span className="sk sk--w10 sk--onNavyFaint anim-shimmer" />
                    </div>
                  </div>
                </div>
                <div className="mt-pilar__meta">
                  <div>
                    <h3 className="mt-pilar__title">Agentes de IA executando</h3>
                    <p className="mt-pilar__desc">
                      Conectados ao seu sistema, executam tarefas e apoiam decisões
                      enquanto você não está olhando.
                    </p>
                  </div>
                  <span className="mt-pilar__arrow">
                    <ArrowRight size={15} strokeWidth={2} />
                  </span>
                </div>
              </FadeUp>

              {/* 3. Visibilidade */}
              <FadeUp className="mt-pilar" delay={0.16}>
                <div className="mt-pilar__visual">
                  <div className="mt-pilar__glow mt-pilar__glow--cyan" aria-hidden="true" />
                  <div className="mt-pilar__texture" aria-hidden="true" />
                  <span className="mt-pill mt-pill--float anim-float">
                    <span className="mt-pill__dot mt-pill__dot--green" /> +24%
                  </span>
                  <div className="mt-pilar__ui">
                    <div className="mt-pilar__ui-head">
                      <span className="dot dot--blue" />
                      <span className="sk sk--w14" />
                    </div>
                    <div className="mt-pilar__chart">
                      <span className="anim-bar-1" style={{ height: 24 }} />
                      <span className="anim-bar-2" style={{ height: 40 }} />
                      <span style={{ height: 18 }} />
                      <span className="anim-bar-3" style={{ height: 52 }} />
                      <span style={{ height: 30 }} />
                      <span className="anim-bar-4" style={{ height: 44 }} />
                      <span className="anim-bar-5" style={{ height: 36 }} />
                    </div>
                  </div>
                </div>
                <div className="mt-pilar__meta">
                  <div>
                    <h3 className="mt-pilar__title">Visibilidade em tempo real</h3>
                    <p className="mt-pilar__desc">
                      Indicadores, rotinas e saúde do negócio num painel só,
                      sempre atualizado.
                    </p>
                  </div>
                  <span className="mt-pilar__arrow">
                    <ArrowRight size={15} strokeWidth={2} />
                  </span>
                </div>
              </FadeUp>

              {/* 4. Integrações MCP */}
              <FadeUp className="mt-pilar" delay={0.24}>
                <div className="mt-pilar__visual">
                  <div className="mt-pilar__glow mt-pilar__glow--blue" aria-hidden="true" />
                  <div className="mt-pilar__texture" aria-hidden="true" />
                  <span className="mt-pill mt-pill--float anim-float">
                    <span className="mt-pill__dot" /> via mcp
                  </span>
                  <div className="mt-pilar__tiles">
                    <span className="mt-tile mt-pilar__hover-1">
                      <BarChart3 size={18} strokeWidth={1.8} />
                    </span>
                    <span className="mt-tile mt-tile--cyan mt-pilar__hover-2">
                      <MessageCircle size={18} strokeWidth={1.8} />
                    </span>
                    <span className="mt-tile mt-pilar__hover-2">
                      <Table2 size={18} strokeWidth={1.8} />
                    </span>
                    <span className="mt-tile mt-tile--navy anim-pulse mt-pilar__hover-1">
                      <Plus size={18} strokeWidth={2} />
                    </span>
                  </div>
                </div>
                <div className="mt-pilar__meta">
                  <div>
                    <h3 className="mt-pilar__title">Integrações MCP</h3>
                    <p className="mt-pilar__desc">
                      Meta, Google, Analytics, planilhas e ERPs conversando direto
                      com o seu sistema.
                    </p>
                  </div>
                  <span className="mt-pilar__arrow">
                    <ArrowRight size={15} strokeWidth={2} />
                  </span>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ---- Agente 24h (painel navy) ---- */}
        <section className="mt-agent" id="agentes" aria-label="Agente de IA 24 horas">
          <div className="mt-container">
            <FadeUp>
              <div className="mt-agent__card">
                <div className="mt-agent__glow mt-agent__glow--1" aria-hidden="true" />
                <div className="mt-agent__glow mt-agent__glow--2" aria-hidden="true" />
                <div className="mt-agent__texture" aria-hidden="true" />
                <div className="mt-agent__copy">
                  <span className="mt-kicker mt-kicker--onNavy">
                    <span className="mt-kicker__icon mt-kicker__icon--onNavy">
                      <Bot size={15} strokeWidth={2} />
                    </span>
                    03 · agentes
                  </span>
                  <h2 className="mt-h2 mt-h2--onNavy">
                    <WordReveal text="Um agente de IA trabalhando" accent="24h no seu negócio." />
                  </h2>
                  <p className="mt-agent__sub">
                    Conectado ao seu sistema de gestão, o agente executa tarefas,
                    monitora indicadores, prepara relatórios e te avisa do que
                    importa. Você decide, ele executa.
                  </p>
                </div>
                <AgentFeed />
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ---- Como funciona (processo 01/02/03) ---- */}
        <section className="mt-proc" id="como-funciona" aria-label="Como funciona a mentoria">
          <div className="mt-container">
            <div className="mt-section-head">
              <FadeUp>
                <span className="mt-kicker">
                  <span className="mt-kicker__icon">
                    <ClipboardCheck size={15} strokeWidth={2} />
                  </span>
                  04 · a mentoria
                </span>
              </FadeUp>
              <h2 className="mt-h2">
                <WordReveal text="Avaliamos a sua realidade." accent="Construímos a sua estratégia." />
              </h2>
            </div>

            <div className="mt-proc__grid">
              {/* 01 Avaliação */}
              <FadeUp className="mt-proc__col" delay={0}>
                <div className="mt-proc__head">
                  <span className="mt-proc__num">01</span>
                  <span className="mt-proc__tag">Avaliação</span>
                </div>
                <div className="mt-panel mt-proc__panel">
                  <div className="mt-proc__check-head">
                    <ClipboardCheck size={15} strokeWidth={2} />
                    Diagnóstico
                  </div>
                  {['Seu negócio e rotina', 'Processos e sistemas', 'Projetos que você já tem em mente'].map(
                    (item) => (
                      <div className="mt-proc__check" key={item}>
                        {item}
                        <span className="mt-proc__check-dot" />
                      </div>
                    )
                  )}
                </div>
                <h3 className="mt-proc__title">Avaliamos a sua realidade.</h3>
                <p className="mt-proc__desc">
                  Diagnóstico gratuito, presencial ou no Meet. Entendemos a operação
                  e os projetos que você já imagina.
                </p>
              </FadeUp>

              {/* 02 Estratégia e construção (navy) */}
              <FadeUp className="mt-proc__col mt-proc__col--navy" delay={0.1}>
                <div className="mt-proc__head mt-proc__head--onNavy">
                  <span className="mt-proc__num">02</span>
                  <span className="mt-proc__tag mt-proc__tag--onNavy">Estratégia</span>
                </div>
                <div className="mt-proc__navy-card anim-float">
                  <span className="mt-proc__navy-kicker">Plano do ecossistema</span>
                  <span className="mt-proc__navy-status">
                    <span className="mt-pill__dot mt-pill__dot--green" /> aprovado
                  </span>
                  <p className="mt-proc__navy-big">1º módulo em produção</p>
                  <span className="mt-proc__navy-link">
                    construído com você <ArrowRight size={13} strokeWidth={2} />
                  </span>
                </div>
                <h3 className="mt-proc__title mt-proc__title--onNavy">
                  Estratégia personalizada, construção conjunta.
                </h3>
                <p className="mt-proc__desc mt-proc__desc--onNavy">
                  Plano priorizado com prazo e investimento. Sessões individuais
                  construindo o ecossistema dentro da sua operação real.
                </p>
              </FadeUp>

              {/* 03 Comando */}
              <FadeUp className="mt-proc__col" delay={0.2}>
                <div className="mt-proc__head">
                  <span className="mt-proc__num">03</span>
                  <span className="mt-proc__tag">Autonomia</span>
                </div>
                <div className="mt-panel mt-proc__panel">
                  <div className="mt-proc__monitor-head">
                    Operação
                    <span className="mt-proc__monitor-days">no ar</span>
                  </div>
                  <div className="mt-proc__monitor">
                    <div className="mt-proc__donut">
                      <span>98%</span>
                    </div>
                    <div className="mt-proc__monitor-list">
                      <span>rotinas no prazo</span>
                      <span>agente ativo</span>
                      <span>você no comando</span>
                    </div>
                  </div>
                </div>
                <h3 className="mt-proc__title">Você no comando, com autonomia.</h3>
                <p className="mt-proc__desc">
                  Você aprende a operar e evoluir o ecossistema sozinho. O ativo
                  fica na sua empresa, pronto pra escalar.
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={0.15}>
              <p className="mt-proc__closing">
                Meu objetivo é a sua autonomia: escalar o negócio para a
                <strong> nova realidade do mercado</strong> sem depender de ninguém.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ---- Formato: presencial ou online ---- */}
        <section className="mt-formato" id="formato" aria-label="Presencial ou online">
          <div className="mt-container">
            <div className="mt-section-head">
              <FadeUp>
                <span className="mt-kicker">
                  <span className="mt-kicker__icon">
                    <MapPin size={15} strokeWidth={2} />
                  </span>
                  05 · onde acontece
                </span>
              </FadeUp>
              <h2 className="mt-h2">
                <WordReveal text="Presencial em Chapecó." accent="Online em todo o Brasil." />
              </h2>
            </div>

            <div className="mt-formato__grid">
              <FadeUp className="mt-formato__card mt-formato__card--navy" delay={0}>
                <div className="mt-formato__icon mt-formato__icon--onNavy">
                  <MapPin size={20} strokeWidth={1.8} />
                </div>
                <h3 className="mt-formato__title">Chapecó/SC e região</h3>
                <p className="mt-formato__desc">
                  Reuniões presenciais com você e o time da sua empresa.
                  Mentoria dentro da sua operação real.
                </p>
                <span className="mt-formato__tag">
                  <span className="mt-pill__dot mt-pill__dot--cyan" /> diferencial local
                </span>
              </FadeUp>
              <FadeUp className="mt-formato__card" delay={0.1}>
                <div className="mt-formato__icon">
                  <Video size={20} strokeWidth={1.8} />
                </div>
                <h3 className="mt-formato__title mt-formato__title--ink">Demais regiões</h3>
                <p className="mt-formato__desc mt-formato__desc--ink">
                  Mesmo método, por videochamada. Sessões individuais e
                  acompanhamento direto comigo.
                </p>
                <span className="mt-formato__tag mt-formato__tag--ink">
                  <span className="mt-pill__dot" /> online via meet
                </span>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ---- Prova e contexto ---- */}
        <section className="mt-prova" id="prova" aria-label="Contexto de mercado e prova">
          <div className="mt-container">
            <div className="mt-prova__grid">
              <FadeUp className="mt-prova__stat" delay={0}>
                <span className="mt-prova__value">80%+</span>
                <p className="mt-prova__label">
                  das empresas planejam integrar agentes de IA em até 3 anos
                </p>
              </FadeUp>
              <FadeUp className="mt-prova__stat" delay={0.08}>
                <span className="mt-prova__value">15x</span>
                <p className="mt-prova__label">
                  crescimento projetado do mercado de agentes até 2034
                </p>
              </FadeUp>
              <FadeUp className="mt-prova__stat" delay={0.16}>
                <span className="mt-prova__value">10+</span>
                <p className="mt-prova__label">
                  anos construindo produtos digitais, com 50+ projetos entregues
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={0.1}>
              <div className="mt-prova__dogfood">
                <div className="mt-prova__avatar">
                  <img src="/memoji.png" alt="Eduardo Nicoleti" width={64} height={64} loading="lazy" decoding="async" />
                </div>
                <p>
                  <strong>Eu opero nesse modelo.</strong> O sistema de propostas que
                  meus clientes recebem foi construído com Claude Code e está em
                  produção neste site. Sou Eduardo Nicoleti, empresário, membro da
                  JCI e de Associações Comerciais. Conheço a rotina de quem decide
                  porque vivo ela.
                </p>
                <span className="mt-prova__shield">
                  <ShieldCheck size={18} strokeWidth={1.8} />
                </span>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="mt-faq" id="faq" aria-label="Perguntas frequentes">
          <div className="mt-container">
            <div className="mt-section-head">
              <FadeUp>
                <span className="mt-kicker">
                  <span className="mt-kicker__icon">
                    <MessageCircle size={15} strokeWidth={2} />
                  </span>
                  06 · dúvidas
                </span>
              </FadeUp>
              <h2 className="mt-h2">
                <WordReveal text="Perguntas" accent="frequentes." />
              </h2>
            </div>

            <div className="mt-faq__list">
              {faqs.map((f) => (
                <FaqItem q={f.q} a={f.a} key={f.q} />
              ))}
            </div>
          </div>
        </section>

        {/* ---- CTA final ---- */}
        <section className="mt-cta" id="agendar" aria-label="Agendar diagnóstico">
          <div className="mt-container">
            <FadeUp>
              <div className="mt-cta__card">
                <div className="mt-cta__glow mt-cta__glow--1" aria-hidden="true" />
                <div className="mt-cta__glow mt-cta__glow--2" aria-hidden="true" />
                <div className="mt-cta__texture" aria-hidden="true" />
                <span className="mt-kicker mt-kicker--onNavy mt-cta__kicker">
                  <span className="mt-kicker__icon mt-kicker__icon--onNavy">
                    <Sparkles size={15} strokeWidth={2} />
                  </span>
                  diagnóstico gratuito
                </span>
                <h2 className="mt-cta__heading">
                  <WordReveal text="Vamos desenhar o" accent="seu ecossistema?" />
                </h2>
                <p className="mt-cta__sub">
                  Presencial em Chapecó/SC ou online. Você sai com o mapa do
                  primeiro passo, com ou sem contrato.
                </p>
                <div className="mt-cta__actions">
                  <a
                    href={agendaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-btn mt-btn--lg mt-btn--onNavy"
                    id="mentoria-cta-agendar-btn"
                  >
                    <span className="mt-btn__orb" aria-hidden="true" />
                    <span className="mt-btn__label">Agendar diagnóstico</span>
                    <span className="mt-btn__chip">
                      <ArrowUpRight size={18} strokeWidth={2} />
                    </span>
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-cta__wa"
                    id="mentoria-cta-whatsapp-btn"
                  >
                    ou chama no WhatsApp <ArrowUpRight size={15} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* ---- Footer ---- */}
      <footer className="mt-footer">
        <div className="mt-container mt-footer__inner">
          <Link to="/" className="mt-footer__logo">
            edunicoleti<span>.</span>
          </Link>
          <span className="mt-footer__copy">© {new Date().getFullYear()} eduardo nicoleti</span>
          <div className="mt-footer__links">
            <a
              href="https://www.linkedin.com/in/edunicoleti/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-footer__link"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/edunicoleti/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-footer__link"
            >
              Instagram
            </a>
            <Link to="/" className="mt-footer__link">
              Portfólio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
