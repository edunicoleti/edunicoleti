import { useEffect, useRef } from 'react'
import {
  Search,
  Layers,
  Wrench,
  Check,
  ArrowRight,
  MessageCircle,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Mentoria.css'

/*
 * Link da página de agendamento (Google Calendar / Cal.com).
 * Enquanto vazio, os botões de agendamento caem no WhatsApp.
 */
const SCHEDULING_URL = ''

const WHATSAPP_URL =
  'https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Quero%20agendar%20o%20diagn%C3%B3stico%20gratuito%20da%20Mentoria%20de%20Claude%20Code.'

const agendaHref = SCHEDULING_URL || WHATSAPP_URL

const momentos = [
  'Já usa o Claude no dia a dia, mas tudo vive no chat. Nada vira um processo que roda sem você.',
  'Sabe que dá pra fazer muito mais, mas não sabe o que priorizar nem em que ordem.',
  'Suas automações funcionam às vezes, e você não consegue explicar por quê.',
  'Quer conectar a IA aos sistemas reais da empresa, com segurança.',
  'Está resolvendo na tentativa e erro o que um bom mapa encurtaria em semanas.',
]

const pilares = [
  {
    id: 'diagnostico',
    Icon: Search,
    title: 'Diagnóstico do que já existe',
    description:
      'Revisão do seu uso atual de Claude Code: o que manter, o que refazer e o que priorizar primeiro.',
  },
  {
    id: 'infra',
    Icon: Layers,
    title: 'Estruturação da infra',
    description:
      'Projetos organizados, automações que rodam sozinhas e integrações com os sistemas que sua empresa já usa.',
  },
  {
    id: 'solucoes',
    Icon: Wrench,
    title: 'Soluções sob medida',
    description:
      'Construção guiada das ferramentas que o seu negócio realmente precisa, do rascunho ao uso diário.',
  },
]

const saltos = [
  {
    antes: 'Peço um relatório no chat toda segunda',
    depois: 'O relatório chega pronto no seu e-mail, toda segunda, sozinho',
  },
  {
    antes: 'Colo dados do cliente na conversa',
    depois: 'Claude conectado ao seu CRM e planilhas, com contexto permanente',
  },
  {
    antes: 'Cada proposta é um prompt novo',
    depois: 'Sistema de propostas no padrão da empresa, gerado em minutos',
  },
  {
    antes: 'Arquivos e prompts espalhados',
    depois: 'Projetos organizados que qualquer pessoa da equipe consegue usar',
  },
]

const passos = [
  {
    number: '01',
    title: 'Diagnóstico gratuito',
    description:
      '30 minutos no Meet. Você me mostra como usa Claude Code hoje e eu já aponto os primeiros destravamentos na própria conversa.',
  },
  {
    number: '02',
    title: 'Plano personalizado',
    description:
      'Definimos juntos os desafios prioritários e o que vamos construir, na ordem que gera resultado mais rápido.',
  },
  {
    number: '03',
    title: 'Sessões de mentoria',
    description:
      'Encontros individuais via Meet, mão na massa, dentro do contexto real da sua empresa.',
  },
  {
    number: '04',
    title: 'Suporte entre sessões',
    description:
      'Canal direto comigo no WhatsApp pra destravar dúvidas sem esperar o próximo encontro.',
  },
]

const faqs = [
  {
    q: 'Já uso Claude Code no dia a dia. O que a mentoria acrescenta?',
    a: 'Direção e estrutura. Você deixa de aprender por tentativa e erro: eu reviso o que você já montou, mostro o que priorizar e como transformar usos pontuais em processos que rodam sozinhos.',
  },
  {
    q: 'Você faz por mim ou me ensina a fazer?',
    a: 'Os dois, na medida certa. Construímos juntos dentro do seu contexto, e o objetivo final é a sua autonomia: você sai operando e evoluindo as próprias soluções.',
  },
  {
    q: 'Funciona com os sistemas que já uso, como ERP, CRM e planilhas?',
    a: 'Sim. Parte do trabalho é justamente conectar o Claude Code com segurança às ferramentas que sua empresa já usa no dia a dia.',
  },
  {
    q: 'Quanto tempo até ver resultado?',
    a: 'O primeiro destravamento acontece já na conversa de diagnóstico. Nas primeiras sessões o foco é colocar uma automação real pra rodar, pra você sentir o ganho logo no início.',
  },
  {
    q: 'Quanto custa?',
    a: 'O investimento depende do formato e da profundidade do acompanhamento. Na conversa de diagnóstico eu apresento as opções, sem compromisso.',
  },
  {
    q: 'Qual plano do Claude eu preciso ter?',
    a: 'Um plano pago da Anthropic que dê acesso ao Claude Code. Na primeira conversa eu te oriento sobre qual faz mais sentido pro seu volume de uso.',
  },
]

const pills = [
  'Claude Code',
  'Agentes de IA',
  'MCPs e integrações',
  'Automações',
  'UX/UI Design',
  'Produtos digitais',
]

function useMeta() {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''

    document.title = 'Mentoria de Claude Code para Empreendedores | Eduardo Nicoleti'
    metaDesc?.setAttribute(
      'content',
      'Mentoria individual para empreendedores que já usam Claude Code e querem ir além: automações que rodam sozinhas, infraestrutura organizada e soluções sob medida. Diagnóstico gratuito via Meet.'
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

  useEffect(() => {
    window.scrollTo(0, 0)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  const scrollTo = (selector: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header />
      <main className="mentoria">
        {/* ---- Hero ---- */}
        <section className="m-hero" id="inicio" aria-label="Mentoria de Claude Code">
          <div className="ambient-orbs" aria-hidden="true">
            <div className="orb orb--blue" />
            <div className="orb orb--indigo" />
            <div className="orb orb--teal" />
          </div>
          <div className="grid-lines" aria-hidden="true" />

          <div className="container m-hero__container">
            <div className="m-hero__content">
              <div className="m-hero__badge reveal">
                <span className="m-hero__dot" aria-hidden="true" />
                <span className="text-label">Mentoria individual · Online via Meet</span>
              </div>

              <h1 className="m-hero__heading reveal">
                Você já usa Claude Code. Agora faça ele{' '}
                <span className="text-serif" style={{ fontStyle: 'italic' }}>
                  rodar a sua empresa.
                </span>
              </h1>

              <p className="m-hero__sub reveal">
                Mentoria individual para empreendedores que já estão aplicando Claude Code
                e querem ir além: automações que rodam sozinhas, infraestrutura organizada
                e soluções sob medida para o negócio.
              </p>

              <div className="m-hero__actions reveal">
                <a
                  href={agendaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--accent m-hero__btn"
                  id="mentoria-hero-agendar-btn"
                >
                  Agendar diagnóstico gratuito
                </a>
                <a
                  href="#como-funciona"
                  className="btn btn--outline"
                  id="mentoria-hero-como-btn"
                  onClick={scrollTo('#como-funciona')}
                >
                  Como funciona
                </a>
              </div>

              <p className="m-hero__note reveal">
                Primeira conversa gratuita, 30 minutos, sem compromisso.
              </p>
            </div>

            {/* Terminal visual */}
            <div className="m-hero__visual reveal" aria-hidden="true">
              <div className="m-terminal">
                <div className="m-terminal__bar">
                  <div className="m-terminal__dots">
                    <span /><span /><span />
                  </div>
                  <span className="m-terminal__title">claude code · sua-empresa</span>
                </div>
                <div className="m-terminal__body">
                  <p className="m-terminal__line m-terminal__line--prompt">
                    <span className="m-terminal__caret">&gt;</span>
                    Gere o relatório semanal de vendas e envie para a diretoria
                  </p>
                  <p className="m-terminal__line">
                    <span className="m-terminal__check">✓</span> Lendo planilha de vendas
                  </p>
                  <p className="m-terminal__line">
                    <span className="m-terminal__check">✓</span> Montando relatório com indicadores
                  </p>
                  <p className="m-terminal__line">
                    <span className="m-terminal__check">✓</span> E-mail enviado para 3 destinatários
                  </p>
                  <p className="m-terminal__line m-terminal__line--muted">
                    Concluído em 42s · sem intervenção manual
                  </p>
                </div>
              </div>

              <div className="m-hero__chip m-hero__chip--schedule">
                <span className="m-hero__chip-dot" />
                Toda segunda, 07h00 · automático
              </div>
              <div className="m-hero__chip m-hero__chip--mcp">
                MCP · CRM + planilhas conectados
              </div>
            </div>
          </div>
        </section>

        {/* ---- Identificação ---- */}
        <section className="m-momento" id="momento" aria-label="Para quem é a mentoria">
          <div className="container">
            <div className="m-section-header reveal">
              <p className="text-label">Pra quem é</p>
              <h2 className="m-section-heading">
                Você provavelmente{' '}
                <span className="text-serif" style={{ fontStyle: 'italic' }}>está aqui.</span>
              </h2>
            </div>

            <ul className="m-momento__list" role="list">
              {momentos.map((item, i) => (
                <li
                  className="m-momento__item reveal"
                  key={i}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <span className="m-momento__icon" aria-hidden="true">
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>

            <p className="m-momento__closing reveal">
              Se você se reconheceu em dois ou mais itens, a mentoria foi desenhada pra você.
            </p>
          </div>
        </section>

        {/* ---- A mentoria ---- */}
        <section className="m-pilares" id="mentoria-formato" aria-label="Como a mentoria funciona">
          <div className="container">
            <div className="m-section-header reveal">
              <p className="text-label">A mentoria</p>
              <h2 className="m-section-heading">
                Um facilitador,{' '}
                <span className="text-serif" style={{ fontStyle: 'italic' }}>não um curso.</span>
              </h2>
              <p className="m-section-sub">
                Nada de aulas gravadas nem introdução à ferramenta. Eu entro no contexto real
                da sua empresa, entendo seus objetivos e acelero o que você já começou.
              </p>
            </div>

            <div className="m-pilares__grid">
              {pilares.map((p, i) => (
                <article
                  className="m-pilar reveal"
                  key={p.id}
                  id={`mentoria-pilar-${p.id}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="m-pilar__icon" aria-hidden="true">
                    <p.Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="m-pilar__title">{p.title}</h3>
                  <p className="m-pilar__desc">{p.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Do chat à infraestrutura ---- */}
        <section className="m-salto" id="salto" aria-label="Do chat à infraestrutura">
          <div className="container">
            <div className="m-section-header reveal">
              <p className="text-label">O salto</p>
              <h2 className="m-section-heading">
                Do chat à{' '}
                <span className="text-serif" style={{ fontStyle: 'italic' }}>infraestrutura.</span>
              </h2>
              <p className="m-section-sub">
                A diferença entre usar Claude Code e operar a empresa com ele.
              </p>
            </div>

            <div className="m-salto__rows">
              {saltos.map((s, i) => (
                <div
                  className="m-salto__row reveal"
                  key={i}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="m-salto__cell m-salto__cell--antes">
                    <span className="m-salto__tag">Hoje</span>
                    <p>{s.antes}</p>
                  </div>
                  <span className="m-salto__arrow" aria-hidden="true">
                    <ArrowRight size={18} strokeWidth={2} />
                  </span>
                  <div className="m-salto__cell m-salto__cell--depois">
                    <span className="m-salto__tag m-salto__tag--depois">Com a mentoria</span>
                    <p>{s.depois}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Mentor ---- */}
        <section className="m-mentor" id="mentor" aria-label="Sobre Eduardo Nicoleti">
          <div className="container">
            <div className="m-mentor__inner">
              <div className="m-mentor__left reveal">
                <div className="m-mentor__avatar-wrap">
                  <img
                    src="/memoji.png"
                    alt="Eduardo Nicoleti"
                    className="m-mentor__avatar"
                    width={180}
                    height={180}
                  />
                </div>
                <div className="m-mentor__stats">
                  <div className="m-mentor__stat">
                    <span className="m-mentor__stat-value">10+</span>
                    <span className="m-mentor__stat-label">Anos em produtos digitais</span>
                  </div>
                  <div className="m-mentor__stat">
                    <span className="m-mentor__stat-value">50+</span>
                    <span className="m-mentor__stat-label">Projetos entregues</span>
                  </div>
                </div>
              </div>

              <div className="m-mentor__right">
                <p className="text-label reveal">Seu mentor</p>
                <h2 className="m-section-heading reveal">
                  Quem vai te{' '}
                  <span className="text-serif" style={{ fontStyle: 'italic' }}>acompanhar.</span>
                </h2>

                <p className="m-mentor__text reveal">
                  Sou <strong>Eduardo Nicoleti</strong>, webdesigner e especialista em UX/UI e
                  produtos digitais há mais de 10 anos. Uso Claude Code todos os dias na minha
                  própria operação: agentes, MCPs, automações agendadas e integrações com os
                  sistemas que sustentam o meu negócio.
                </p>

                <p className="m-mentor__text reveal">
                  Também sou empresário. Participo da JCI e de Associações Comerciais, e conheço
                  de perto a rotina de quem toca uma empresa. Já percorri o caminho que você está
                  tentando percorrer, e é exatamente isso que encurta o seu.
                </p>

                <div className="m-mentor__pills reveal">
                  {pills.map((skill) => (
                    <span className="tag" key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="m-mentor__social reveal">
                  <a
                    href="https://www.linkedin.com/in/edunicoleti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline"
                    id="mentoria-linkedin-btn"
                  >
                    Ver LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Como funciona ---- */}
        <section className="m-passos" id="como-funciona" aria-label="Como funciona a mentoria">
          <div className="container">
            <div className="m-section-header reveal">
              <p className="text-label">Como funciona</p>
              <h2 className="m-section-heading">
                Simples, direto e{' '}
                <span className="text-serif" style={{ fontStyle: 'italic' }}>no seu contexto.</span>
              </h2>
            </div>

            <div className="m-passos__grid" role="list">
              {passos.map((step, i) => (
                <div
                  className="m-passo reveal"
                  key={step.number}
                  role="listitem"
                  id={`mentoria-passo-${step.number}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="m-passo__num">{step.number}</span>
                  <h3 className="m-passo__title">{step.title}</h3>
                  <p className="m-passo__desc">{step.description}</p>
                </div>
              ))}
            </div>

            <p className="m-passos__note reveal">
              Mentoria individual, 100% online, com agenda flexível.
            </p>
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="m-faq" id="faq" aria-label="Perguntas frequentes">
          <div className="container">
            <div className="m-section-header reveal">
              <p className="text-label">Dúvidas</p>
              <h2 className="m-section-heading">
                Perguntas{' '}
                <span className="text-serif" style={{ fontStyle: 'italic' }}>frequentes.</span>
              </h2>
            </div>

            <div className="m-faq__list">
              {faqs.map((f, i) => (
                <details
                  className="m-faq__item reveal"
                  key={i}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <summary className="m-faq__question">
                    {f.q}
                    <span className="m-faq__marker" aria-hidden="true" />
                  </summary>
                  <p className="m-faq__answer">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---- CTA final ---- */}
        <section className="m-cta" id="agendar" aria-label="Agendar diagnóstico">
          <div className="container">
            <div className="m-cta__inner reveal">
              <div className="m-cta__text">
                <p className="text-label" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Diagnóstico gratuito
                </p>
                <h2 className="m-cta__heading">
                  Me mostre como você usa Claude Code{' '}
                  <span className="text-serif" style={{ fontStyle: 'italic' }}>hoje.</span>
                </h2>
                <p className="m-cta__sub">
                  Em 30 minutos no Meet, eu te mostro o que dá pra destravar.
                  Conversa gratuita e sem compromisso.
                </p>
              </div>

              <div className="m-cta__actions">
                <a
                  href={agendaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--accent m-cta__btn"
                  id="mentoria-cta-agendar-btn"
                >
                  Agendar diagnóstico
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn m-cta__btn m-cta__btn--wa"
                  id="mentoria-cta-whatsapp-btn"
                >
                  <MessageCircle size={18} strokeWidth={2} />
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
