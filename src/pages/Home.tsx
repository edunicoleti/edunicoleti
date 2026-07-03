import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import MentoriaCallout from '../components/MentoriaCallout'
import Methodology from '../components/Methodology'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
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

    // Rola até a âncora quando a Home é aberta com hash (ex.: /#servicos vindo de outra página)
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView()
    }

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <MentoriaCallout />
        <Methodology />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
