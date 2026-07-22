import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { isAuthenticated, login, logout } from '../financeiro/supabase'
import './AuthGate.css'

/*
 * Portão de acesso reusável para as áreas privadas (propostas, CRM). Usa a MESMA
 * autenticação do /financeiro (conta única no Supabase; a senha "0800" ganha o
 * sufixo internamente). Enquanto o Supabase não está configurado, cai no modo
 * local (sessionStorage) — igual ao financeiro.
 */
export function AuthGate({
  subtitle,
  children,
}: {
  subtitle: string
  children: (ctx: { logout: () => void }) => ReactNode
}) {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    isAuthenticated().then(setAuthed)
  }, [])

  if (authed === null) return <div className="authgate__loading" />
  if (!authed) return <LockCard subtitle={subtitle} onUnlock={() => setAuthed(true)} />
  return <>{children({ logout: () => logout().then(() => setAuthed(false)) })}</>
}

function LockCard({ subtitle, onUnlock }: { subtitle: string; onUnlock: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!password || busy) return
    setBusy(true)
    setError(null)
    const result = await login(password)
    setBusy(false)
    if (result.ok) onUnlock()
    else setError(result.error ?? 'Senha incorreta')
  }

  return (
    <div className="authgate">
      <form className="authgate__card" onSubmit={handleSubmit}>
        <div className="authgate__icon">
          <Lock size={20} />
        </div>
        <h1>Área restrita</h1>
        <p>{subtitle}</p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          aria-label="Senha"
        />
        {error && <span className="authgate__error">{error}</span>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
