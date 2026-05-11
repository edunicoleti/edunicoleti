import type { PropostaData } from './proposta.types'

// =============================================
// TEMPLATE DE PROPOSTA — Preamar Serviços Marítimos
// Preencha os campos marcados com [PREENCHER]
// =============================================

export const propostaPreamar: PropostaData = {
  slug: 'preamar',

  cliente: {
    nome: 'Jouber',
    empresa: 'Preamar Serviços Marítimos Ltda',
    cargo: '',
    email: '',
    telefone: '',
  },

  projeto: {
    titulo: 'Novo Site Institucional da Preamar',
    tipo: 'Projeto Web + Manutenção',
    descricao:
      'Desenvolvimento de um novo site institucional profissional para a Preamar Serviços Marítimos Ltda. O projeto contempla design limpo, focado em credibilidade e apresentação de serviços institucionais, integrando rapidamente o cliente aos canais de contato via WhatsApp. Esta proposta inclui manutenção contínua e hospedagem segura para garantir a estabilidade do site na internet.',
    tags: ['Site institucional', 'Hospedagem', 'Manutenção contínua', 'Backups e Segurança'],
  },

  escopo: [
    { descricao: 'Desenvolvimento web completo do site institucional', incluido: true },
    { descricao: 'Botão flutuante de WhatsApp para contato instantâneo', incluido: true },
    { descricao: 'Otimização para os buscadores e recomendações de IA (SEO Técnico)', incluido: true },
    { descricao: 'Hospedagem com rotinas de Backup de Segurança', incluido: true },
  ],

  tecnologias: ['React', 'Vite', 'Cloud Hosting', 'Infraestrutura Otimizada'],

  prazoEntrega: 'Cerca de 20 dias após etapa de briefing e receber arquivos e conteúdos da empresa',
  
  valorTotal: 3000,
  mensalidade: 0,
  opcoesHospedagem: [
    { titulo: '1 Ano de Hospedagem', valorFormatado: 'R$ 650,00' },
    { titulo: '2 Anos de Hospedagem', valorFormatado: 'R$ 1.000,00' },
    { titulo: 'Sem hospedagem', valorFormatado: 'Isento', descricao: 'Você recebe os arquivos do site para hospedar por conta própria.' },
  ],

  pagamento: {
    entrada: 0,
    saldo: 0,
    descricao: 'Parcelamento em 4x, fatura gerada automaticamente todo dia 10 de cada mês.',
  },

  validade: '30 dias',

  observacoes: '',

  criadoEm: new Date().toISOString(),
}

export const propostaAudioTao: PropostaData = {
  slug: 'audiotao',

  cliente: {
    nome: 'Dra. Maristela Montagner',
    empresa: 'AudioTao',
    cargo: 'Responsável',
    email: '',
    telefone: '',
  },

  projeto: {
    titulo: 'Gestão de Tráfego Pago para a AudioTao',
    tipo: 'Google Ads + Meta Ads',
    descricao:
      'Oi, Dra. Maristela! Conforme analisamos inicialmente, a AudioTao já possui uma campanha ativa no Google Ads, hoje configurada de forma mais automática, gerando cliques para o site. Esse é um bom ponto de partida, mas ainda existe oportunidade de organizar melhor a estrutura para que o investimento seja direcionado para pessoas com maior intenção de agendar uma consulta. Também já avançamos na estrutura do Meta Ads, com o painel de anúncios organizado e o Pixel configurado no site. A proposta agora é cuidar da gestão mensal dos anúncios da AudioTao no Google Ads e Meta Ads, com foco em gerar contatos pelo WhatsApp, aumentar oportunidades de agendamento e acompanhar quais campanhas realmente trazem resultado.',
    tags: ['Google Ads', 'Meta Ads', 'WhatsApp', 'Chapecó e região'],
  },

  escopo: [
    { descricao: 'Revisão da campanha atual do Google Ads', incluido: true },
    { descricao: 'Ajuste da estrutura automática para uma configuração mais estratégica', incluido: true },
    { descricao: 'Criação de campanhas separadas por serviço e intenção de busca', incluido: true },
    { descricao: 'Campanha específica para aparelhos auditivos', incluido: true },
    { descricao: 'Campanha específica para terapia de zumbido', incluido: true },
    { descricao: 'Campanha para buscas locais em Chapecó e região', incluido: true },
    { descricao: 'Revisão de palavras-chave e termos de pesquisa', incluido: true },
    { descricao: 'Inclusão de palavras negativas para evitar cliques sem intenção de compra', incluido: true },
    { descricao: 'Criação ou ajuste de anúncios com textos mais direcionados', incluido: true },
    { descricao: 'Uso do Pixel da Meta para análise e criação de públicos', incluido: true },
    { descricao: 'Configuração de campanhas no Facebook e Instagram', incluido: true },
    { descricao: 'Campanhas com foco em WhatsApp e geração de contatos', incluido: true },
    { descricao: 'Segmentação local para Chapecó e região', incluido: true },
    { descricao: 'Acompanhamento dos resultados e otimizações mensais', incluido: true },
  ],

  tecnologiasTitulo: 'Canais e ferramentas',
  tecnologias: ['Google Ads', 'Meta Ads', 'Pixel da Meta', 'WhatsApp', 'Site da clínica', 'Relatórios de desempenho'],

  prazoEntrega: 'Organização inicial em até 7 dias úteis após aprovação e acessos liberados',

  valorTotal: 0,
  mensalidade: 0,

  investimento: {
    titulo: 'Gestão mensal de tráfego pago',
    descricao:
      'Valor mensal referente à gestão, acompanhamento e otimização das campanhas no Google Ads e Meta Ads. O investimento direto em mídia será definido separadamente conforme a verba aprovada para anúncios.',
    recursos: [
      'Google Ads organizado por serviço e intenção de busca',
      'Meta Ads com foco em WhatsApp e geração de contatos',
      'Acompanhamento de contatos, consultas e oportunidades comerciais',
    ],
  },

  pagamento: {
    entrada: 0,
    saldo: 0,
    descricao: 'Honorário mensal de gestão a definir. Verba de mídia paga separadamente e diretamente nas plataformas de anúncios.',
  },

  validade: '30 dias',

  observacoes:
    'O objetivo não é apenas gerar cliques, mas atrair pessoas com real interesse em avaliação auditiva, aparelhos auditivos e terapia para zumbido, transformando o investimento em mais oportunidades comerciais para a AudioTao.',

  criadoEm: '2026-05-11T12:00:00-03:00',
}

// Mapa de todas as propostas disponíveis (para o dashboard)
export const todasPropostas: PropostaData[] = [
  propostaAudioTao,
  propostaPreamar,
]
