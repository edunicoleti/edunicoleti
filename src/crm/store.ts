import { useCallback, useEffect, useState } from 'react'
import type { Activity, ActivityTipo, CrmData, Lead, Stage } from './types'
import { EMPTY_CRM, uid } from './types'
import { createCrmAdapter } from './storage'

export type NewLeadInput = {
  nome: string
  empresa: string | null
  email: string | null
  telefone: string | null
  origem: string
  valorEstCents: number
  stage: Stage
  notas: string | null
}

export function useCrmStore() {
  /* Instância única e estável do adaptador, sem ler ref durante o render */
  const [adapter] = useState(() => createCrmAdapter())
  const [data, setData] = useState<CrmData>(EMPTY_CRM)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const guard = useCallback((p: Promise<void>) => {
    p.catch((e: unknown) => setError(e instanceof Error ? e.message : 'Falha ao salvar'))
  }, [])

  useEffect(() => {
    let cancelled = false
    adapter
      .loadAll()
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Falha ao carregar')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [adapter])

  const addLead = useCallback(
    (input: NewLeadInput): Lead => {
      const now = new Date().toISOString()
      const lead: Lead = { id: uid(), ...input, createdAt: now, updatedAt: now }
      setData((d) => ({ ...d, leads: [...d.leads, lead] }))
      guard(adapter.upsertLead(lead))
      return lead
    },
    [adapter, guard],
  )

  const updateLead = useCallback(
    (lead: Lead) => {
      const updated = { ...lead, updatedAt: new Date().toISOString() }
      setData((d) => ({ ...d, leads: d.leads.map((l) => (l.id === updated.id ? updated : l)) }))
      guard(adapter.upsertLead(updated))
    },
    [adapter, guard],
  )

  const moveLead = useCallback(
    (lead: Lead, stage: Stage) => {
      if (lead.stage === stage) return
      const updated = { ...lead, stage, updatedAt: new Date().toISOString() }
      setData((d) => ({ ...d, leads: d.leads.map((l) => (l.id === lead.id ? updated : l)) }))
      guard(adapter.upsertLead(updated))
    },
    [adapter, guard],
  )

  const deleteLead = useCallback(
    (id: string) => {
      setData((d) => ({
        leads: d.leads.filter((l) => l.id !== id),
        activities: d.activities.filter((a) => a.leadId !== id),
      }))
      guard(adapter.deleteLead(id))
    },
    [adapter, guard],
  )

  const addActivity = useCallback(
    (leadId: string, tipo: ActivityTipo, descricao: string, dueAt: string | null): Activity => {
      const activity: Activity = {
        id: uid(),
        leadId,
        tipo,
        descricao,
        dueAt,
        done: false,
        createdAt: new Date().toISOString(),
      }
      setData((d) => ({ ...d, activities: [...d.activities, activity] }))
      guard(adapter.upsertActivity(activity))
      return activity
    },
    [adapter, guard],
  )

  const toggleActivity = useCallback(
    (activity: Activity) => {
      const updated = { ...activity, done: !activity.done }
      setData((d) => ({
        ...d,
        activities: d.activities.map((a) => (a.id === updated.id ? updated : a)),
      }))
      guard(adapter.upsertActivity(updated))
    },
    [adapter, guard],
  )

  const deleteActivity = useCallback(
    (id: string) => {
      setData((d) => ({ ...d, activities: d.activities.filter((a) => a.id !== id) }))
      guard(adapter.deleteActivity(id))
    },
    [adapter, guard],
  )

  return {
    leads: data.leads,
    activities: data.activities,
    loading,
    error,
    mode: adapter.mode,
    dismissError: () => setError(null),
    addLead,
    updateLead,
    moveLead,
    deleteLead,
    addActivity,
    toggleActivity,
    deleteActivity,
  }
}
