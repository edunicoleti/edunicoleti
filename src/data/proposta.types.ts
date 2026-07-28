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

export interface PropostaVisualItem {
  titulo: string
  descricao: string
}

export interface PropostaCenario {
  titulo: string
  destaque: string
  descricao: string
  nivel: 'conservador' | 'realista' | 'otimista'
}

export interface PropostaPlanejamentoVisual {
  situacaoAtual?: PropostaVisualItem[]
  situacaoAtualDescricao?: string
  roadmap?: PropostaVisualItem[]
  planoExecucaoDescricao?: string
  cenarios?: PropostaCenario[]
}

export interface PropostaMensalidadeInfo {
  titulo?: string
  descricao?: string
  recursos?: string[]
}

/* Escopos alternativos apresentados lado a lado. Quando preenchido, substitui o
   par "Passo 1 / Passo 2" por uma comparação — o cliente escolhe o escopo, e
   cada opção carrega seu próprio setup e sua própria mensalidade. */
export interface PropostaOpcao {
  id: string
  titulo: string
  resumo?: string
  valorTotal: number
  mensalidade?: number
  recomendada?: boolean
  destaques?: string[]
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
  opcoes?: PropostaOpcao[]
  tecnologias: string[]
  tecnologiasTitulo?: string
  planejamentoVisual?: PropostaPlanejamentoVisual
  prazoEntrega: string
  valorTotal: number
  mensalidade?: number
  mensalidadeInfo?: PropostaMensalidadeInfo
  investimento?: PropostaInvestimento
  opcoesHospedagem?: { titulo: string; valorFormatado: string; descricao?: string }[]
  pagamento: PropostaPagamento
  validade: string // ex: "30 dias"
  observacoes?: string
  mostrarDetalhesComerciais?: boolean
  criadoEm: string // ISO date string
}
