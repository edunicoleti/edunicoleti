import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Cable,
  CalendarClock,
  FileText,
  Landmark,
  MessagesSquare,
} from 'lucide-react'
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import './Mentoria.css'

/*
 * Link da página de agendamento (Google Calendar / Cal.com).
 * Enquanto vazio, os botões de agendamento caem no WhatsApp.
 */
const SCHEDULING_URL = ''

/* Slot de foto real: trocar por ex. '/eduardo.jpg' quando a foto chegar. */
const MENTOR_PHOTO = '/memoji.png'

const WHATSAPP_URL =
  'https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Vi%20que%20a%20agenda%20est%C3%A1%20aberta%20e%20quero%20reservar%20um%20diagn%C3%B3stico.'

const agendaHref = SCHEDULING_URL || WHATSAPP_URL

/* ---- Terminal: cenários que digitam em loop ---- */
const scenarios = [
  {
    cmd: 'Feche o caixa de hoje e me mande o resumo',
    out: ['Conciliando extrato com contas a receber', '2 pendências sinalizadas', 'Resumo enviado no WhatsApp'],
  },
  {
    cmd: 'Gere o relatório da semana pra reunião de segunda',
    out: ['Lendo planilha de vendas', 'Montando indicadores', 'PDF pronto no seu e-mail'],
  },
  {
    cmd: 'Prepare a proposta do cliente novo no nosso padrão',
    out: ['Buscando dados no CRM', 'Aplicando template da empresa', 'Proposta gerada em 4 min'],
  },
]

/* Barra de prova: sem clientes nomeados por decisão da Fase 0 */
const marqueeItems = [
  '10+ anos em produtos digitais',
  '50+ projetos entregues',
  'operação própria rodando em claude code',
  'mentoria e consultoria 1:1',
]

const modulos = [
  { icon: BarChart3, title: 'Relatórios e indicadores', desc: 'Chegam prontos, no horário, sem ninguém pedir.' },
  { icon: FileText, title: 'Propostas e orçamentos', desc: 'Geradas no padrão da empresa, em minutos.' },
  { icon: Landmark, title: 'Financeiro', desc: 'Conciliação automática, pendências sinalizadas.' },
  { icon: MessagesSquare, title: 'Atendimento e follow-up', desc: 'Nenhum cliente esquecido na fila.' },
  { icon: Cable, title: 'Integrações', desc: 'CRM, planilhas e ERP conversando entre si.' },
  { icon: CalendarClock, title: 'Rotinas agendadas', desc: 'O que é recorrente roda sozinho, todo dia.' },
]

const dores = [
  'O relatório de segunda que rouba o domingo.',
  'A proposta que só sai se você montar.',
  'O financeiro conferido linha por linha.',
  'O follow-up que depende da sua memória.',
]

const diffs = [
  { antes: 'Relatório montado à mão toda segunda', depois: 'Chega pronto no e-mail, 07h00' },
  { antes: 'Proposta refeita a cada cliente', depois: 'Gerada no padrão, em minutos' },
  { antes: 'Financeiro conferido planilha por planilha', depois: 'Conciliação automática com alertas' },
  { antes: 'A operação depende de você', depois: 'A operação roda. Você decide.' },
]

const movimentos = [
  {
    num: '01',
    title: 'Análise',
    desc: 'Mergulho no seu negócio: processos, sistemas, gargalos. Saio com o mapa do que automatizar primeiro.',
  },
  {
    num: '02',
    title: 'Implantação',
    desc: 'Construímos juntos, módulo a módulo, dentro da sua operação real. Cada sessão termina com algo rodando.',
  },
  {
    num: '03',
    title: 'Comando',
    desc: 'Você aprende a operar e evoluir o sistema. A empresa fica com o ativo, não com a dependência.',
  },
]

const passos = [
  { num: '01', title: 'Diagnóstico', desc: '30 min no Meet. Você me mostra a operação, eu já aponto onde o sistema entra.' },
  { num: '02', title: 'Mapa', desc: 'Proposta com módulos priorizados, prazo e investimento. Preto no branco.' },
  { num: '03', title: 'Implantação 1:1', desc: 'Sessões de trabalho na sua operação real. Nada de aula gravada.' },
  { num: '04', title: 'Acompanhamento', desc: 'Canal direto comigo enquanto o sistema ganha corpo.' },
]

const faqs = [
  {
    q: 'Preciso já usar Claude Code?',
    a: 'Não. Se você já usa, eu profissionalizo o que começou. Se nunca abriu, eu implanto do zero. O ponto de partida muda, o destino não.',
  },
  {
    q: 'Serve pro meu ramo?',
    a: 'Se a sua gestão tem rotina repetitiva (relatório, proposta, cobrança, planilha), serve. O sistema é desenhado no seu contexto, não é pacote pronto.',
  },
  {
    q: 'Você faz por mim ou me ensina?',
    a: 'Os dois, nessa ordem. Implanto com você e te deixo operando sozinho. O ativo fica na empresa.',
  },
  {
    q: 'Em quanto tempo vejo resultado?',
    a: 'A primeira automação entra em produção nas primeiras sessões. O diagnóstico já sai com destravamento.',
  },
  {
    q: 'Quanto custa?',
    a: 'Depende do escopo do mapa. Apresento o investimento no diagnóstico, sem compromisso. O diagnóstico é gratuito.',
  },
  {
    q: 'O que preciso ter?',
    a: 'Uma assinatura do Claude com acesso ao Claude Code e acesso aos sistemas da sua empresa. Eu te oriento na configuração.',
  },
]

/* ---- Terminal com digitação ao vivo ---- */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function LiveTerminal() {
  // Com reduced-motion, mostra o primeiro cenário estático em vez de animar
  const [cmd, setCmd] = useState(() => (prefersReducedMotion() ? scenarios[0].cmd : ''))
  const [lines, setLines] = useState<string[]>(() => (prefersReducedMotion() ? scenarios[0].out : []))
  const [done, setDone] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms))
      })

    async function run() {
      let i = 0
      while (!cancelled) {
        const s = scenarios[i % scenarios.length]
        setCmd('')
        setLines([])
        setDone(false)
        await wait(600)

        for (let c = 1; c <= s.cmd.length; c++) {
          if (cancelled) return
          setCmd(s.cmd.slice(0, c))
          await wait(34)
        }
        await wait(500)

        for (const line of s.out) {
          if (cancelled) return
          setLines((prev) => [...prev, line])
          await wait(520)
        }

        if (cancelled) return
        setDone(true)
        await wait(3000)
        i++
      }
    }

    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="mt-terminal" aria-hidden="true">
      <div className="mt-terminal__bar">
        <div className="mt-terminal__dots"><span /><span /><span /></div>
        <span className="mt-terminal__title">claude · sua-empresa</span>
        <span className="mt-terminal__live">
          <span className="mt-terminal__live-dot" /> rodando
        </span>
      </div>
      <div className="mt-terminal__body">
        <p className="mt-terminal__cmd">
          <span className="mt-terminal__caret">&gt;</span>
          <span>
            {cmd}
            <span className="mt-terminal__cursor" />
          </span>
        </p>
        <div className="mt-terminal__out">
          {lines.map((line, i) => (
            <p className="mt-terminal__line" key={i}>
              <span className="mt-terminal__check">✓</span> {line}
            </p>
          ))}
          {done && (
            <p className="mt-terminal__done">concluído · sem intervenção manual</p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---- Progress bar de leitura (terracota, topo) ---- */
function ReadingProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  if (reduced) return null
  return <motion.div className="mt-progress" style={{ scaleX }} aria-hidden="true" />
}

/* ---- Item do segundo turno: acende ao cruzar o centro da viewport ---- */
function DorItem({ d, i }: { d: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inCenter = useInView(ref, { margin: '-45% 0px -45% 0px' })
  return (
    <div
      ref={ref}
      className={`mt-dor mr ${inCenter ? 'mt-dor--active' : ''}`}
      style={{ transitionDelay: `${i * 60}ms` }}
    >
      <span className="mt-dor__num mt-mono">0{i + 1}</span>
      <p className="mt-dor__text">{d}</p>
    </div>
  )
}

/* ---- Stat com count-up ao entrar na viewport ---- */
function CountUpStat({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduced = useReducedMotion()
  // Com reduced-motion o initializer já entrega o valor final, sem animar
  const [display, setDisplay] = useState(() => (reduced ? value : 0))

  useEffect(() => {
    if (!inView || reduced) return
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduced, value])

  return (
    <span ref={ref} className="mt-mono">
      {display}{suffix}
    </span>
  )
}

/* ---- FAQ controlado: abertura anima via grid-template-rows ---- */
function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`mt-faq__item mr ${open ? 'mt-faq__item--open' : ''}`}
      style={{ transitionDelay: `${i * 40}ms` }}
    >
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
    </div>
  )
}

function useMeta() {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''

    document.title = 'Consultoria e Mentoria de Claude Code para Empresas | Eduardo Nicoleti'
    metaDesc?.setAttribute(
      'content',
      'Claude Code como sistema operacional da sua empresa: eu analiso o contexto do negócio e implanto automações de gestão. Agenda aberta, diagnóstico gratuito.'
    )

    return () => {
      document.title = prevTitle
      metaDesc?.setAttribute('content', prevDesc)
    }
  }, [])
}

export default function Mentoria() {
  useMeta()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [navSolid, setNavSolid] = useState(false)
  const reduced = useReducedMotion()

  // Parallax sutil do terminal no hero
  const { scrollY } = useScroll()
  const terminalY = useTransform(scrollY, [0, 700], [0, -40])

  // Linha conectora do método desenha conforme o scroll
  const movRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: movProgress } = useScroll({
    target: movRef,
    offset: ['start 0.85', 'start 0.35'],
  })
  const movLine = useSpring(movProgress, { stiffness: 120, damping: 28 })

  // O quote anima clip-path; observar o wrapper (não-clipado) evita que o
  // IntersectionObserver nunca dispare (elemento clipado tem interseção zero)
  const quoteWrapRef = useRef<HTMLDivElement>(null)
  const quoteInView = useInView(quoteWrapRef, { once: true, amount: 0.5 })

  useEffect(() => {
    window.scrollTo(0, 0)

    const onScroll = () => setNavSolid(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )

    document.querySelectorAll('.mr').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observerRef.current?.disconnect()
    }
  }, [])

  const scrollToAgendar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector('#agendar')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mentoria">
      <div className="mentoria__grain" aria-hidden="true" />
      <ReadingProgress />

      {/* ---- Nav ---- */}
      <nav className={`mt-nav ${navSolid ? 'mt-nav--solid' : ''}`}>
        <div className="mt-container mt-nav__inner">
          <Link to="/" className="mt-nav__logo">
            edunicoleti<span>.</span>
          </Link>
          <div className="mt-nav__right">
            <span className="mt-nav__tag">consultoria · claude code</span>
            <a
              href="#agendar"
              onClick={scrollToAgendar}
              className="mt-btn mt-btn--sm"
              id="mentoria-nav-agendar-btn"
            >
              Reservar horário
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* ---- Hero ---- */}
        <section className="mt-hero" aria-label="Consultoria e mentoria de Claude Code">
          <div className="mt-hero__glow" aria-hidden="true" />
          <div className="mt-container mt-hero__inner">
            <div className="mt-hero__eyebrow mt-load" style={{ animationDelay: '0.05s' }}>
              <span className="mt-mono">agenda aberta · mentoria e consultoria 1:1</span>
              <span className="mt-hero__avail">
                <span className="mt-hero__avail-dot" /> poucas vagas por mês
              </span>
            </div>

            <h1 className="mt-hero__heading">
              <span className="mt-hero__line">
                <span className="mt-load" style={{ animationDelay: '0.15s' }}>Sua empresa</span>
              </span>
              <span className="mt-hero__line">
                <span className="mt-load" style={{ animationDelay: '0.25s' }}>rodando sozinha.</span>
              </span>
              <span className="mt-hero__line mt-hero__line--serif">
                <span className="mt-load" style={{ animationDelay: '0.38s' }}>
                  Claude Code como sistema<br />operacional do negócio.
                </span>
              </span>
            </h1>

            <div className="mt-hero__bottom">
              <div className="mt-hero__cta mt-load" style={{ animationDelay: '0.55s' }}>
                <p className="mt-hero__sub">
                  Eu entro no contexto do seu negócio, desenho a operação e implanto
                  as automações: relatórios, propostas, financeiro e follow-ups
                  rodando sem depender de você.
                </p>
                <div className="mt-hero__actions">
                  <a
                    href={agendaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-btn"
                    id="mentoria-hero-agendar-btn"
                  >
                    Reservar horário na agenda
                    <ArrowRight size={18} strokeWidth={2} />
                  </a>
                  <span className="mt-mono mt-hero__note">diagnóstico de 30 min · gratuito · via meet</span>
                </div>
              </div>

              <motion.div
                className="mt-hero__terminal mt-load"
                style={{ animationDelay: '0.7s', y: reduced ? 0 : terminalY }}
              >
                <LiveTerminal />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---- Marquee ---- */}
        <div className="mt-marquee" aria-hidden="true">
          <div className="mt-marquee__track">
            {[0, 1].map((dup) => (
              <div className="mt-marquee__group" key={dup}>
                {marqueeItems.map((item) => (
                  <span className="mt-marquee__item" key={item}>
                    {item} <span className="mt-marquee__star">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---- O segundo turno ---- */}
        <section className="mt-dores" id="problema" aria-label="O segundo turno invisível">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">01 — o problema</span>
              <h2 className="mt-h2">
                Toda empresa tem um <em>segundo turno</em> invisível.
              </h2>
            </div>

            <div className="mt-dores__intro mr">
              <p>
                Depois do expediente, alguém ainda monta relatório, confere planilha,
                cobra retorno, formata proposta. Quase sempre esse alguém é o dono.
              </p>
              <p>
                Esse turno não aparece no organograma, mas consome as melhores horas
                de quem decide. É ele que eu elimino.
              </p>
            </div>

            <div className="mt-dores__list">
              {dores.map((d, i) => (
                <DorItem d={d} i={i} key={i} />
              ))}
            </div>

            <p className="mt-dores__closing mr">
              Nada disso precisa mais <em>de você.</em>
            </p>
          </div>
        </section>

        {/* ---- O sistema (módulos) ---- */}
        <section className="mt-mods" id="sistema" aria-label="O que eu implanto">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">02 — o sistema</span>
              <h2 className="mt-h2">
                Um sistema operacional <em>pra gestão inteira.</em>
              </h2>
              <p className="mt-section-sub">
                Cada módulo é desenhado no seu contexto e implantado comigo, um a um.
              </p>
            </div>

            <div className="mt-mods__grid">
              {modulos.map((m, i) => {
                const Icon = m.icon
                return (
                  <div className="mt-mod mr" key={m.title} style={{ transitionDelay: `${i * 60}ms` }}>
                    <span className="mt-mod__icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-mod__title">{m.title}</h3>
                    <p className="mt-mod__desc">{m.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ---- Diff: da rotina manual à operação ---- */}
        <section className="mt-diff" id="antes-e-depois" aria-label="Antes e depois">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">03 — antes e depois</span>
              <h2 className="mt-h2">
                Da rotina manual <em>à operação.</em>
              </h2>
            </div>

            <div className="mt-diff__card mr">
              <div className="mt-diff__bar">
                <span className="mt-mono">sua-empresa.diff</span>
              </div>
              {diffs.map((d, i) => (
                <div className="mt-diff__pair mr" key={i} style={{ transitionDelay: `${i * 70}ms` }}>
                  <p className="mt-diff__row mt-diff__row--del">
                    <span className="mt-diff__sign">−</span> {d.antes}
                  </p>
                  <p className="mt-diff__row mt-diff__row--add">
                    <span className="mt-diff__sign">+</span> {d.depois}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- O método ---- */}
        <section className="mt-mov" id="metodo" aria-label="O método">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">04 — o método</span>
              <h2 className="mt-h2">
                Consultoria completa.<br />
                <em>Mentoria no processo.</em>
              </h2>
              <p className="mt-section-sub">
                Eu não entrego um curso nem um sistema fechado. Analiso seu contexto,
                implanto com você e te deixo no comando.
              </p>
            </div>

            <motion.div
              className="mt-mov__line"
              style={{ scaleX: reduced ? 1 : movLine }}
              aria-hidden="true"
            />

            <div className="mt-mov__grid" ref={movRef}>
              {movimentos.map((m, i) => (
                <div className="mt-mov__item mr" key={m.num} style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="mt-mono mt-mov__num">{m.num}</span>
                  <h3 className="mt-mov__title">{m.title}</h3>
                  <p className="mt-mov__desc">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Mentor ---- */}
        <section className="mt-mentor" id="mentor" aria-label="Sobre Eduardo Nicoleti">
          <div className="mt-container mt-mentor__inner">
            <div className="mt-mentor__left mr">
              <div className="mt-mentor__avatar-wrap">
                <img
                  src={MENTOR_PHOTO}
                  alt="Eduardo Nicoleti"
                  className="mt-mentor__avatar"
                  width={160}
                  height={160}
                />
              </div>
            </div>

            <div className="mt-mentor__right">
              <span className="mt-mono mt-kicker mr">05 — quem implanta</span>
              <div ref={quoteWrapRef}>
                <motion.blockquote
                  className="mt-mentor__quote"
                  initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                  animate={
                    reduced || !quoteInView
                      ? undefined
                      : { clipPath: 'inset(0 0 0% 0)', opacity: 1 }
                  }
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  “Eu não vendo a ferramenta. Eu construo a operação <em>em cima dela.</em>”
                </motion.blockquote>
              </div>
              <p className="mt-mentor__bio mr">
                <strong>Sou Eduardo Nicoleti.</strong> Há mais de 10 anos desenho e
                desenvolvo produtos digitais para empresas da região: sites, sistemas
                e operações que rodam todos os dias. Minha própria operação roda em
                Claude Code: o sistema de propostas que meus clientes recebem foi
                construído com ele e está neste site, em produção. Sou empresário,
                membro da JCI e de Associações Comerciais. Conheço a rotina de quem
                decide porque vivo ela.
              </p>
              <div className="mt-mentor__meta mr">
                <span className="mt-mono"><CountUpStat value={10} suffix="+" /> anos</span>
                <span className="mt-mentor__sep">·</span>
                <span className="mt-mono"><CountUpStat value={50} suffix="+" /> projetos</span>
                <span className="mt-mentor__sep">·</span>
                <span className="mt-mono">operação própria em claude code</span>
              </div>
              <a
                href="https://www.linkedin.com/in/edunicoleti/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-link mr"
                id="mentoria-linkedin-btn"
              >
                Ver LinkedIn <ArrowUpRight size={16} strokeWidth={2} />
              </a>
            </div>
          </div>
        </section>

        {/* ---- Como funciona ---- */}
        <section className="mt-passos" id="como-funciona" aria-label="Como funciona">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">06 — como funciona</span>
              <h2 className="mt-h2">
                Do primeiro papo <em>à empresa rodando.</em>
              </h2>
            </div>

            <div className="mt-passos__grid">
              {passos.map((p, i) => (
                <div className="mt-passo mr" key={p.num} style={{ transitionDelay: `${i * 70}ms` }}>
                  <span className="mt-mono mt-passo__num">{p.num}</span>
                  <h3 className="mt-passo__title">{p.title}</h3>
                  <p className="mt-passo__desc">{p.desc}</p>
                </div>
              ))}
            </div>

            <p className="mt-mono mt-passos__note mr">individual · online · agenda limitada</p>
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="mt-faq" id="faq" aria-label="Perguntas frequentes">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">07 — dúvidas</span>
              <h2 className="mt-h2">
                Perguntas <em>frequentes.</em>
              </h2>
            </div>

            <div className="mt-faq__list">
              {faqs.map((f, i) => (
                <FaqItem q={f.q} a={f.a} i={i} key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ---- CTA final ---- */}
        <section className="mt-cta" id="agendar" aria-label="Agendar diagnóstico">
          <div className="mt-container">
            <motion.div
              className="mt-cta__card"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mt-mono mt-kicker mt-kicker--dark">agenda aberta</span>
              <h2 className="mt-cta__heading">
                Poucas vagas. Atendimento <em>é 1:1.</em>
              </h2>
              <p className="mt-cta__sub">
                Diagnóstico gratuito de 30 minutos. Se eu não enxergar ganho real,
                eu te falo na call.
              </p>
              <div className="mt-cta__actions">
              <a
                href={agendaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-btn mt-btn--lg mt-btn--onDark"
                id="mentoria-cta-agendar-btn"
              >
                Reservar horário
                <ArrowRight size={20} strokeWidth={2} />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-link mt-link--onDark"
                id="mentoria-cta-whatsapp-btn"
              >
                ou chama no WhatsApp <ArrowUpRight size={16} strokeWidth={2} />
              </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ---- Footer ---- */}
      <footer className="mt-footer">
        <div className="mt-container mt-footer__inner">
          <Link to="/" className="mt-footer__logo">
            edunicoleti<span>.</span>
          </Link>
          <span className="mt-mono mt-footer__copy">
            © {new Date().getFullYear()} eduardo nicoleti
          </span>
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
