import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import './Mentoria.css'

/*
 * Link da página de agendamento (Google Calendar / Cal.com).
 * Enquanto vazio, os botões de agendamento caem no WhatsApp.
 */
const SCHEDULING_URL = ''

const WHATSAPP_URL =
  'https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Quero%20agendar%20o%20diagn%C3%B3stico%20gratuito%20da%20Mentoria%20de%20Claude%20Code.'

const agendaHref = SCHEDULING_URL || WHATSAPP_URL

/* ---- Terminal: cenários que digitam em loop ---- */
const scenarios = [
  {
    cmd: 'Gere o relatório semanal e envie pra diretoria',
    out: ['Lendo planilha de vendas', 'Montando indicadores', 'E-mail enviado · 3 destinatários'],
  },
  {
    cmd: 'Monte a proposta do cliente novo no nosso padrão',
    out: ['Buscando dados no CRM', 'Aplicando template da empresa', 'Proposta pronta · PDF gerado'],
  },
  {
    cmd: 'Concilie os pagamentos e me avise das pendências',
    out: ['Cruzando extrato com contas a receber', '2 pendências encontradas', 'Resumo enviado no WhatsApp'],
  },
]

const marqueeItems = [
  'Relatórios automáticos',
  'Propostas em minutos',
  'CRM conectado',
  'Agentes de IA',
  'MCPs',
  'Rotinas agendadas',
  'Planilhas que se atualizam',
  'Follow-up sem esquecer',
]

const dores = [
  'Tudo vive no chat. Nada roda sozinho.',
  'Você sabe que dá pra fazer mais. Não sabe por onde.',
  'Suas automações funcionam… às vezes.',
  'Conectar a IA nos sistemas reais dá medo.',
  'Tentativa e erro está comendo suas semanas.',
]

const diffs = [
  { antes: 'Pede o relatório toda segunda', depois: 'O relatório chega sozinho, 07h00' },
  { antes: 'Cola dados do cliente no chat', depois: 'CRM e planilhas conectados' },
  { antes: 'Cada proposta, um prompt novo', depois: 'Propostas no padrão, em minutos' },
  { antes: 'Prompts espalhados em 40 conversas', depois: 'Sistema que a equipe inteira usa' },
]

const movimentos = [
  {
    num: '01',
    title: 'Diagnóstico',
    desc: 'Reviso o que você já montou. O que fica, o que sai, o que vem primeiro.',
  },
  {
    num: '02',
    title: 'Infraestrutura',
    desc: 'Automações que rodam sozinhas, conectadas aos sistemas da sua empresa.',
  },
  {
    num: '03',
    title: 'Autonomia',
    desc: 'Você sai operando e evoluindo tudo sem depender de mim.',
  },
]

const passos = [
  { num: '01', title: 'Diagnóstico gratuito', desc: '30 min no Meet. Você mostra, eu destravo na hora.' },
  { num: '02', title: 'Plano', desc: 'Prioridades definidas. Sem enrolação.' },
  { num: '03', title: 'Sessões 1:1', desc: 'Mão na massa, no seu contexto real.' },
  { num: '04', title: 'Suporte direto', desc: 'WhatsApp aberto entre as sessões.' },
]

const faqs = [
  {
    q: 'Já uso Claude Code todo dia. O que a mentoria acrescenta?',
    a: 'Direção. Eu reviso o que você montou, aponto o que priorizar e transformo usos pontuais em processos que rodam sozinhos.',
  },
  {
    q: 'Você faz por mim ou me ensina?',
    a: 'Os dois. Construímos juntos, no seu contexto. O objetivo final é você operar tudo sem mim.',
  },
  {
    q: 'Funciona com ERP, CRM e planilhas que já uso?',
    a: 'Sim. Conectar o Claude Code com segurança aos seus sistemas é parte central do trabalho.',
  },
  {
    q: 'Quanto tempo até ver resultado?',
    a: 'O primeiro destravamento acontece no próprio diagnóstico. A primeira automação real, nas primeiras sessões.',
  },
  {
    q: 'Quanto custa?',
    a: 'Depende do formato e da profundidade. Apresento as opções no diagnóstico, sem compromisso.',
  },
  {
    q: 'Qual plano do Claude eu preciso?',
    a: 'Um plano pago com acesso ao Claude Code. Te oriento sobre qual, no seu volume de uso.',
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

function useMeta() {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''

    document.title = 'Mentoria de Claude Code para Empreendedores | Eduardo Nicoleti'
    metaDesc?.setAttribute(
      'content',
      'Mentoria individual para empreendedores que já usam Claude Code: automações que rodam sozinhas, sistemas conectados e soluções sob medida. Diagnóstico gratuito via Meet.'
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

      {/* ---- Nav ---- */}
      <nav className={`mt-nav ${navSolid ? 'mt-nav--solid' : ''}`}>
        <div className="mt-container mt-nav__inner">
          <Link to="/" className="mt-nav__logo">
            edunicoleti<span>.</span>
          </Link>
          <div className="mt-nav__right">
            <span className="mt-nav__tag">mentoria de claude code</span>
            <a
              href="#agendar"
              onClick={scrollToAgendar}
              className="mt-btn mt-btn--sm"
              id="mentoria-nav-agendar-btn"
            >
              Agendar
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* ---- Hero ---- */}
        <section className="mt-hero" aria-label="Mentoria de Claude Code">
          <div className="mt-hero__glow" aria-hidden="true" />
          <div className="mt-container mt-hero__inner">
            <div className="mt-hero__eyebrow mt-load" style={{ animationDelay: '0.05s' }}>
              <span className="mt-mono">mentoria 1:1 · online via meet</span>
              <span className="mt-hero__avail">
                <span className="mt-hero__avail-dot" /> vagas abertas
              </span>
            </div>

            <h1 className="mt-hero__heading">
              <span className="mt-hero__line">
                <span className="mt-load" style={{ animationDelay: '0.15s' }}>Você já usa</span>
              </span>
              <span className="mt-hero__line">
                <span className="mt-load" style={{ animationDelay: '0.25s' }}>Claude Code.</span>
              </span>
              <span className="mt-hero__line mt-hero__line--serif">
                <span className="mt-load" style={{ animationDelay: '0.38s' }}>
                  Agora faça ele rodar<br />a sua empresa.
                </span>
              </span>
            </h1>

            <div className="mt-hero__bottom">
              <div className="mt-hero__cta mt-load" style={{ animationDelay: '0.55s' }}>
                <p className="mt-hero__sub">
                  Mentoria individual pra transformar o chat em operação:
                  automações, integrações e soluções sob medida.
                </p>
                <div className="mt-hero__actions">
                  <a
                    href={agendaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-btn"
                    id="mentoria-hero-agendar-btn"
                  >
                    Agendar diagnóstico gratuito
                    <ArrowRight size={18} strokeWidth={2} />
                  </a>
                  <span className="mt-mono mt-hero__note">30 min · gratuito · sem compromisso</span>
                </div>
              </div>

              <div className="mt-hero__terminal mt-load" style={{ animationDelay: '0.7s' }}>
                <LiveTerminal />
              </div>
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

        {/* ---- Dores ---- */}
        <section className="mt-dores" id="momento" aria-label="Te parece familiar">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">01 — o travamento</span>
              <h2 className="mt-h2">
                Te parece <em>familiar?</em>
              </h2>
            </div>

            <div className="mt-dores__list">
              {dores.map((d, i) => (
                <div className="mt-dor mr" key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                  <span className="mt-dor__num mt-mono">0{i + 1}</span>
                  <p className="mt-dor__text">{d}</p>
                </div>
              ))}
            </div>

            <p className="mt-dores__closing mr">
              Se você assentiu duas vezes, <em>continua lendo.</em>
            </p>
          </div>
        </section>

        {/* ---- Diff: do chat à operação ---- */}
        <section className="mt-diff" id="salto" aria-label="Do chat à operação">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">02 — o salto</span>
              <h2 className="mt-h2">
                Do chat <em>à operação.</em>
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

        {/* ---- Movimentos ---- */}
        <section className="mt-mov" id="mentoria-formato" aria-label="A mentoria">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">03 — a mentoria</span>
              <h2 className="mt-h2">
                Não é curso. É um facilitador<br />
                <em>dentro da sua operação.</em>
              </h2>
            </div>

            <div className="mt-mov__grid">
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
                  src="/memoji.png"
                  alt="Eduardo Nicoleti"
                  className="mt-mentor__avatar"
                  width={160}
                  height={160}
                />
              </div>
            </div>

            <div className="mt-mentor__right">
              <span className="mt-mono mt-kicker mr">04 — seu mentor</span>
              <blockquote className="mt-mentor__quote mr">
                “Eu já percorri o caminho que você está <em>tentando percorrer.</em>”
              </blockquote>
              <p className="mt-mentor__bio mr">
                <strong>Eduardo Nicoleti.</strong> 10+ anos criando produtos digitais.
                Claude Code todos os dias na própria operação: agentes, MCPs, automações
                e integrações. Empresário, membro da JCI e de Associações Comerciais.
              </p>
              <div className="mt-mentor__meta mr">
                <span className="mt-mono">10+ anos</span>
                <span className="mt-mentor__sep">·</span>
                <span className="mt-mono">50+ projetos</span>
                <span className="mt-mentor__sep">·</span>
                <span className="mt-mono">claude code diário</span>
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
              <span className="mt-mono mt-kicker">05 — como funciona</span>
              <h2 className="mt-h2">
                Simples, direto, <em>no seu contexto.</em>
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
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="mt-faq" id="faq" aria-label="Perguntas frequentes">
          <div className="mt-container">
            <div className="mt-section-head mr">
              <span className="mt-mono mt-kicker">06 — dúvidas</span>
              <h2 className="mt-h2">
                Perguntas <em>frequentes.</em>
              </h2>
            </div>

            <div className="mt-faq__list">
              {faqs.map((f, i) => (
                <details className="mt-faq__item mr" key={i} style={{ transitionDelay: `${i * 40}ms` }}>
                  <summary className="mt-faq__q">
                    {f.q}
                    <span className="mt-faq__marker" aria-hidden="true" />
                  </summary>
                  <p className="mt-faq__a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---- CTA final ---- */}
        <section className="mt-cta" id="agendar" aria-label="Agendar diagnóstico">
          <div className="mt-container">
            <span className="mt-mono mt-kicker mr">diagnóstico gratuito</span>
            <h2 className="mt-cta__heading mr">
              Me mostre como você usa Claude Code <em>hoje.</em>
            </h2>
            <p className="mt-cta__sub mr">
              30 minutos no Meet. Eu te mostro o que dá pra destravar.
            </p>
            <div className="mt-cta__actions mr">
              <a
                href={agendaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-btn mt-btn--lg"
                id="mentoria-cta-agendar-btn"
              >
                Agendar diagnóstico
                <ArrowRight size={20} strokeWidth={2} />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-link"
                id="mentoria-cta-whatsapp-btn"
              >
                ou chama no WhatsApp <ArrowUpRight size={16} strokeWidth={2} />
              </a>
            </div>
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
