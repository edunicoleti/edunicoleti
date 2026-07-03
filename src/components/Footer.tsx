import { useNavigate } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const navigate = useNavigate()

  const handleAnchorClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/' + href
    }
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="footer__logo">
              edunicoleti<span className="footer__dot">.</span>
            </span>
            <p className="footer__tagline">
              Webdesigner · UX/UI Design · Produtos Digitais
            </p>
          </div>

          <div className="footer__links">
            <a href="#servicos" className="footer__link" onClick={handleAnchorClick('#servicos')}>Serviços</a>
            <a href="#metodologia" className="footer__link" onClick={handleAnchorClick('#metodologia')}>Metodologia</a>
            <a href="/mentoria" className="footer__link" onClick={(e) => {
              e.preventDefault()
              navigate('/mentoria')
            }}>Mentoria</a>
            <a href="#contato" className="footer__link" onClick={handleAnchorClick('#contato')}>Contato</a>
          </div>

          <div className="footer__contact">
            <a
              href="https://wa.me/5549999531382"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__contact-link"
              id="footer-whatsapp-link"
            >
              +55 (49) 99953-1382
            </a>
            <a
              href="mailto:edunicoleti@gmail.com"
              className="footer__contact-link"
              id="footer-email-link"
            >
              edunicoleti@gmail.com
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} Eduardo Nicoleti. Todos os direitos reservados.
          </p>
          <p className="footer__credit">
            Design & desenvolvimento por Eduardo Nicoleti
          </p>
        </div>
      </div>
    </footer>
  )
}
