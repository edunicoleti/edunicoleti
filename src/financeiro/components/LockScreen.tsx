import { useState, type FormEvent } from 'react'
import { Lock } from 'lucide-react'
import { login } from '../supabase'

type Props = {
  onUnlock: () => void
}

export default function LockScreen({ onUnlock }: Props) {
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
    <div className="fin-lock">
      <form className="fin-lock__card" onSubmit={handleSubmit}>
        <div className="fin-lock__icon">
          <Lock size={20} />
        </div>
        <h1>Área restrita</h1>
        <p>Digite a senha para acessar o painel financeiro.</p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          aria-label="Senha"
        />
        {error && <span className="fin-lock__error">{error}</span>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
