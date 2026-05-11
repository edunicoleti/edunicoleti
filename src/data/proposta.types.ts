// Tipagem base para propostas de orçamento
export interface PropostaItem {
  descricao: string
  incluido: boolean
}

export interface PropostaPagamento {
  entrada: number
  saldo: number
  descricao: string
}

export interface PropostaInvestimento {
  titulo?: string
  descricao?: string
  recursos?: string[]
}

export interface PropostaData {
  slug: string
  cliente: {
    nome: string
    empresa: string
    cargo?: string
    email?: string
    telefone?: string
  }
  projeto: {
    titulo: string
    tipo: string
    descricao: string
    tags: string[]
  }
  escopo: PropostaItem[]
  tecnologias: string[]
  tecnologiasTitulo?: string
  prazoEntrega: string
  valorTotal: number
  mensalidade?: number
  investimento?: PropostaInvestimento
  opcoesHospedagem?: { titulo: string; valorFormatado: string; descricao?: string }[]
  pagamento: PropostaPagamento
  validade: string // ex: "30 dias"
  observacoes?: string
  criadoEm: string // ISO date string
}
