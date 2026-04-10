import { useState, useEffect } from 'react'
import './Header.css'

const navLinks = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#metodologia', label: 'Metodologia' },
  { href: '#contato', label: 'Contato' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    if (!href) return
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMenuOpen(false)
    }
  }

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`} id="header">
      <nav className="header__nav container">
        <a href="/" className="header__logo" aria-label="edunicoleti — Home">
          <span className="header__logo-name">edunicoleti</span>
          <span className="header__logo-dot">.</span>
        </a>

        <ul className="header__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="header__link"
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Gostaria%20de%20falar%20sobre%20um%20projeto."
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary header__cta"
          id="header-whatsapp-btn"
        >
          Falar no WhatsApp
        </a>



        <button
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          id="menu-toggle-btn"
        >
          <span /><span /><span />
        </button>
      </nav>

        {/* Mobile menu */}
      <div className={`header__mobile-menu ${menuOpen ? 'header__mobile-menu--open' : ''}`}>
        <button 
          className="header__mobile-menu-close" 
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={handleNavClick}>{link.label}</a>
            </li>
          ))}
          <li>
            <a
              href="https://wa.me/5549999531382"
              target="_blank"
              rel="noopener noreferrer"
              className="btn header__mobile-menu-wa"
            >
              Falar no WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </header>

    {/* Floating WhatsApp on Mobile - Place outside <header> to avoid CSS containing block issues with backdrop-filter */}
    <a
      href="https://wa.me/5549999531382?text=Ol%C3%A1%2C%20Eduardo!%20Gostaria%20de%20falar%20sobre%20um%20projeto."
      target="_blank"
      rel="noopener noreferrer"
      className="header__floating-wa"
      aria-label="WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    </a>
    </>
  )
}
