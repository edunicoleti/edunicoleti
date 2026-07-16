import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const cloudEnabled = Boolean(url && anonKey)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!cloudEnabled) throw new Error('Supabase não configurado')
    client = createClient(url!, anonKey!)
  }
  return client
}

/* Conta única do sistema; a senha digitada ganha sufixo para atender o
   mínimo de 6 caracteres do Supabase Auth */
export const LOGIN_EMAIL = 'edunicoleti@gmail.com'
export const PASSWORD_SUFFIX = '#financeiro'

const LOCAL_GATE_KEY = 'financeiro:auth'
const LOCAL_PASSWORD = '0800'

export async function isAuthenticated(): Promise<boolean> {
  if (cloudEnabled) {
    const { data } = await getSupabase().auth.getSession()
    return Boolean(data.session)
  }
  return sessionStorage.getItem(LOCAL_GATE_KEY) === 'ok'
}

export async function login(password: string): Promise<{ ok: boolean; error?: string }> {
  if (cloudEnabled) {
    const { error } = await getSupabase().auth.signInWithPassword({
      email: LOGIN_EMAIL,
      password: password + PASSWORD_SUFFIX,
    })
    if (error) return { ok: false, error: 'Senha incorreta' }
    return { ok: true }
  }
  if (password === LOCAL_PASSWORD) {
    sessionStorage.setItem(LOCAL_GATE_KEY, 'ok')
    return { ok: true }
  }
  return { ok: false, error: 'Senha incorreta' }
}

export async function logout(): Promise<void> {
  if (cloudEnabled) await getSupabase().auth.signOut()
  sessionStorage.removeItem(LOCAL_GATE_KEY)
}
