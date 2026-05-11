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
      'A AudioTao já tem uma base importante pronta: campanha ativa no Google Ads, painel do Meta Ads organizado e Pixel configurado no site. Hoje, a campanha do Google está em uma configuração mais automática. A próxima etapa é criar campanhas mais segmentadas, com páginas de conversão e foco em WhatsApp, agendamentos e oportunidades reais para aparelhos auditivos, avaliação auditiva e terapia para zumbido.',
    tags: ['Google Ads', 'Meta Ads', 'WhatsApp', 'Chapecó e região'],
  },

  escopo: [
    { descricao: 'Revisar a campanha automática atual do Google Ads e reorganizar a estrutura por serviço e intenção de busca', incluido: true },
    { descricao: 'Criar campanhas para aparelhos auditivos, terapia de zumbido e buscas locais em Chapecó e região', incluido: true },
    { descricao: 'Ajustar palavras-chave, termos de pesquisa, palavras negativas e textos dos anúncios', incluido: true },
    { descricao: 'Gerenciar o site e criar landing pages de conversão para as campanhas', incluido: true },
    { descricao: 'Usar o Pixel da Meta para públicos, remarketing e análise do comportamento no site', incluido: true },
    { descricao: 'Configurar campanhas no Facebook e Instagram com foco em WhatsApp e geração de contatos', incluido: true },
    { descricao: 'Acompanhar resultados e fazer otimizações mensais para melhorar o custo por contato qualificado', incluido: true },
  ],

  tecnologiasTitulo: 'Canais e ferramentas',
  tecnologias: ['Google Ads', 'Meta Ads', 'Pixel da Meta', 'WhatsApp', 'Landing pages', 'Relatórios de desempenho'],

  prazoEntrega: 'Organização inicial em até 7 dias úteis após aprovação e acessos liberados',

  valorTotal: 1200,
  mensalidade: 0,

  investimento: {
    titulo: 'Mensalidade de gestão',
    descricao:
      'Mensalidade de R$ 1.200,00 para gestão, acompanhamento e otimização das campanhas no Google Ads e Meta Ads. A recomendação é manter o trabalho por pelo menos 3 meses para ter volume de dados, testar campanhas e buscar um resultado mais consistente.',
    recursos: [
      'Gestão mensal em Google Ads e Meta Ads',
      'Gestão do site e landing pages para campanhas',
      'Período mínimo recomendado de 3 meses',
      'Relatório mensal de acessos, conversões e desempenho das campanhas',
    ],
  },

  pagamento: {
    entrada: 0,
    saldo: 0,
    descricao: 'Mensalidade de R$ 1.200,00, com período mínimo recomendado de 3 meses. A verba dos anúncios é paga separadamente e diretamente nas plataformas.',
  },

  validade: '30 dias',

  observacoes:
    'Hoje a estrutura já tem um bom ponto de partida. O foco da gestão será sair de uma campanha mais automática para campanhas segmentadas, medir quais anúncios e páginas geram contatos pelo WhatsApp e direcionar o investimento para pessoas com maior chance de agendar uma consulta.',

  criadoEm: '2026-05-11T12:00:00-03:00',
}

// Mapa de todas as propostas disponíveis (para o dashboard)
export const todasPropostas: PropostaData[] = [
  propostaAudioTao,
  propostaPreamar,
]
