import { useEffect } from 'react'

/*
 * Injeta <meta name="robots" content="noindex, nofollow"> enquanto a rota estiver
 * montada, e remove ao sair. Usado nas áreas privadas (propostas, CRM) — o mesmo
 * padrão que o /financeiro já aplicava inline. O robots.txt e o X-Robots-Tag do
 * .htaccess cobrem os crawlers que não executam JS; esta meta cobre o resto.
 */
export function useNoindex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      meta.remove()
    }
  }, [])
}
