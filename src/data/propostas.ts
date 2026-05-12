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
    nome: 'Maristela Montagner',
    empresa: 'Clínica Fonoaudiologia Avançada',
    cargo: '',
    email: '',
    telefone: '',
  },

  projeto: {
    titulo: 'Gestão de Tráfego Pago para a AudioTao',
    tipo: 'Google Ads + Meta Ads',
    descricao:
      'A AudioTao já tem uma base importante pronta: campanha ativa no Google Ads, painel do Meta Ads organizado e Pixel configurado no site. Hoje, a campanha do Google está em uma configuração mais automática. A próxima etapa é criar campanhas mais segmentadas, com páginas de conversão e foco em agendamentos e oportunidades reais para aparelhos auditivos, avaliação auditiva, terapia para zumbido e CPAP.',
    tags: ['Google Ads', 'Meta Ads', 'Landing Pages', 'Leads qualificados'],
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

  planejamentoVisual: {
    situacaoAtual: [
      {
        titulo: 'Google Ads ativo',
        descricao: 'A conta já gera cliques para o site, mas ainda trabalha em uma lógica mais automática.',
      },
      {
        titulo: 'Meta Ads organizado',
        descricao: 'O painel está estruturado para iniciar campanhas com mais controle e leitura dos resultados.',
      },
      {
        titulo: 'Pixel configurado',
        descricao: 'A base de rastreamento já permite criar públicos e acompanhar o comportamento no site.',
      },
      {
        titulo: 'Site como apoio',
        descricao: 'As campanhas podem ganhar páginas mais focadas para transformar acessos em contatos.',
      },
    ],
    roadmap: [
      {
        titulo: 'Mês 1',
        descricao: 'Reorganizar Google Ads, criar campanhas por serviço e preparar landing pages para aparelhos auditivos, zumbido, avaliação auditiva e CPAP.',
      },
      {
        titulo: 'Mês 2',
        descricao: 'Acompanhar termos de busca, acessos, conversões e qualidade dos leads que chegam para atendimento comercial.',
      },
      {
        titulo: 'Mês 3',
        descricao: 'Direcionar verba para campanhas com melhores sinais e melhorar o volume de oportunidades de agendamento.',
      },
    ],
    cenarios: [
      {
        titulo: 'Campanhas por serviço',
        destaque: 'Mais controle sobre a procura',
        descricao: 'Anúncios separados para aparelhos auditivos, terapia de zumbido e buscas locais, com mensagens alinhadas à intenção de cada pessoa.',
        nivel: 'conservador',
      },
      {
        titulo: 'Leads mais qualificados',
        destaque: 'Menos clique solto, mais conversa útil',
        descricao: 'Páginas e anúncios focados em levar para o WhatsApp pessoas com maior chance de interesse real nos serviços da clínica.',
        nivel: 'realista',
      },
      {
        titulo: 'Mais agendamentos',
        destaque: 'Oportunidades para o comercial',
        descricao: 'Com rastreamento e otimização mensal, a meta é transformar campanhas em contatos que possam virar avaliações e consultas.',
        nivel: 'otimista',
      },
    ],
  },

  prazoEntrega: 'Organização inicial em até 7 dias úteis após aprovação e acessos liberados',

  valorTotal: 800,
  mensalidade: 0,

  investimento: {
    titulo: 'Mensalidade de gestão',
    descricao:
      'Mensalidade de R$ 800,00 para gestão, acompanhamento e otimização das campanhas no Google Ads, Meta Ads e landing pages. A recomendação é manter o trabalho por pelo menos 3 meses para ter volume de dados, testar campanhas e buscar um resultado mais consistente.',
    recursos: [
      'Gestão mensal em Google Ads e Meta Ads',
      'Gestão do site e landing pages para campanhas',
      'Período mínimo recomendado de 3 meses',
      'Verba patrocinada recomendada de pelo menos R$ 1.000,00 por mês, depositada direto nas contas de anúncio',
      'Relatório mensal de acessos, conversões e desempenho das campanhas',
    ],
  },

  pagamento: {
    entrada: 0,
    saldo: 0,
    descricao: 'Mensalidade de R$ 800,00, com período mínimo recomendado de 3 meses. Recomendo pelo menos R$ 1.000,00 mensais de verba patrocinada, depositada diretamente nas contas de anúncio.',
  },

  validade: '30 dias',

  observacoes: '',
  mostrarDetalhesComerciais: false,

  criadoEm: '2026-05-11T12:00:00-03:00',
}

// Mapa de todas as propostas disponíveis (para o dashboard)
export const todasPropostas: PropostaData[] = [
  propostaAudioTao,
  propostaPreamar,
]
