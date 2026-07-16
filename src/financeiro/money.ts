const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatBRL(cents: number): string {
  return brl.format(cents / 100)
}

/* Converte texto digitado ("1.611,86", "920", "R$ 45,00") em centavos */
export function parseBRL(input: string): number | null {
  const cleaned = input.replace(/[^\d,.-]/g, '')
  if (!cleaned) return null
  // Última vírgula é o separador decimal; pontos são milhar
  const normalized = cleaned.replace(/\./g, '').replace(',', '.')
  const value = Number(normalized)
  if (!Number.isFinite(value)) return null
  return Math.round(value * 100)
}

/* Máscara progressiva: dígitos viram centavos (digitar 92000 → 920,00) */
export function maskDigitsToBRL(digits: string): { cents: number; display: string } {
  const onlyDigits = digits.replace(/\D/g, '').slice(0, 12)
  const cents = onlyDigits ? parseInt(onlyDigits, 10) : 0
  return { cents, display: formatBRL(cents) }
}
