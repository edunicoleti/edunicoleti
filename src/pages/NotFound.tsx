import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './NotFound.css'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página não encontrada — edunicoleti'
    return () => {
      document.title = 'Eduardo Nicoleti — Webdesigner & UX/UI Design | Produtos Digitais'
    }
  }, [])

  return (
    <div className="notfound">
      <div className="notfound__inner">
        <p className="notfound__code">404</p>
        <h1 className="notfound__title">Esta página não existe</h1>
        <p className="notfound__sub">
          O endereço pode ter mudado ou o link estar incompleto.
        </p>
        <Link to="/" className="btn btn--primary">Voltar ao início</Link>
      </div>
    </div>
  )
}
