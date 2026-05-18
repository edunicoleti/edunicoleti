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
    { descricao: 'Criar landing pages para os principais serviços: aparelhos auditivos, terapia de zumbido, CPAP e avaliação auditiva', incluido: true },
    { descricao: 'Criar campanhas específicas no Google Ads para pessoas que já estão buscando solução no momento', incluido: true },
    { descricao: 'Separar campanhas, palavras-chave e anúncios por serviço para aumentar a intenção de conversão', incluido: true },
    { descricao: 'Criar campanhas na Meta para qualificação de leads, geração de mensagens e remarketing', incluido: true },
    { descricao: 'Configurar públicos e acompanhamento pelo Pixel da Meta para medir acessos e conversões', incluido: true },
    { descricao: 'Acompanhar leads, mensagens e oportunidades de agendamento para orientar as otimizações mensais', incluido: true },
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
        descricao: 'Criar landing pages dos serviços principais e estruturar campanhas específicas no Google Ads para buscas com intenção imediata.',
      },
      {
        titulo: 'Mês 2',
        descricao: 'Ativar campanhas na Meta para qualificar leads, gerar mensagens e criar públicos de remarketing com base nos acessos.',
      },
      {
        titulo: 'Mês 3',
        descricao: 'Otimizar termos de busca, anúncios, páginas e públicos para melhorar a qualidade dos contatos e oportunidades de agendamento.',
      },
    ],
    cenarios: [
      {
        titulo: 'Landing pages por serviço',
        destaque: 'Páginas focadas em conversão',
        descricao: 'Cada serviço principal terá uma página direcionada para explicar a solução, orientar o contato e facilitar o agendamento.',
        nivel: 'conservador',
      },
      {
        titulo: 'Google Ads segmentado',
        destaque: 'Demanda de quem está buscando agora',
        descricao: 'Campanhas separadas por serviço para atrair pessoas que pesquisam por aparelhos auditivos, zumbido, CPAP ou avaliação auditiva.',
        nivel: 'realista',
      },
      {
        titulo: 'Meta Ads e remarketing',
        destaque: 'Mensagens de interessados qualificados',
        descricao: 'Campanhas para qualificar leads, gerar mensagens de interessados com potencial de agendamento e reimpactar pessoas que acessaram as páginas dos serviços.',
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

export const propostaLucia: PropostaData = {
  slug: 'lucia-cardapios',

  cliente: {
    nome: 'Lucia Chaise Borjes',
    empresa: 'Cardápios: Um Livro Vivo',
    cargo: '',
    email: '',
    telefone: '',
  },

  projeto: {
    titulo: 'Crescimento Digital do Livro Vivo',
    tipo: 'Meta Ads + Conteúdo + Plataforma de Cursos',
    descricao:
      'O Livro Vivo já tem produto desenvolvido, landing page publicada e presença construída no Instagram. A próxima etapa é transformar essa base em um canal de vendas recorrente: tráfego pago no Meta Ads para gerar vendas constantes do livro digital, conteúdo semanal para manter a autoridade orgânica e uma plataforma de cursos em vídeo que amplia o produto e abre uma nova fonte de receita para nutricionistas.',
    tags: ['Meta Ads', 'Conteúdo Orgânico', 'Plataforma de Cursos', 'Edição de Vídeos'],
  },

  escopo: [
    { descricao: 'Criação e configuração do painel de anúncios no Meta Ads com instalação do Pixel na landing page', incluido: true },
    { descricao: 'Definição de estratégia de venda e estruturação de públicos-alvo para nutricionistas e estudantes', incluido: true },
    { descricao: 'Criação de criativos (imagens e textos) para as campanhas de tráfego pago', incluido: true },
    { descricao: 'Gerenciamento mensal das campanhas com relatórios e ajustes de otimização', incluido: true },
    { descricao: '4 posts mensais no Instagram (@cardapioslivrovivo) para manutenção da presença orgânica', incluido: true },
    { descricao: 'Estruturação da plataforma de cursos em vídeo com acesso integrado ao Livro Vivo no Notion', incluido: true },
    { descricao: 'Edição dos vídeos gravados pela Lucia e upload na plataforma de cursos', incluido: true },
  ],

  tecnologiasTitulo: 'Canais e ferramentas',
  tecnologias: ['Meta Ads', 'Instagram', 'Pixel da Meta', 'Plataforma de Cursos', 'Notion', 'Landing Page', 'Relatórios de desempenho'],

  planejamentoVisual: {
    situacaoAtualDescricao: 'A base já está construída. Produto pronto, landing page no ar e 3 meses de conteúdo orgânico. O próximo passo é criar o motor de vendas com tráfego pago e expandir o produto com uma plataforma de cursos.',
    situacaoAtual: [
      {
        titulo: 'Produto digital pronto',
        descricao: 'O Livro Vivo está desenvolvido no Notion com acesso vitalício disponível para venda na landing page.',
      },
      {
        titulo: 'Landing page publicada',
        descricao: 'A página de apresentação e compra do livro está no ar em cardapiosumlivrovivo.com.br, pronta para receber tráfego.',
      },
      {
        titulo: '3 meses de conteúdo',
        descricao: 'O @cardapioslivrovivo foi construído com lançamento e conteúdo que apresenta o produto e gera autoridade.',
      },
      {
        titulo: 'Sem tráfego pago ainda',
        descricao: 'As vendas ainda dependem do alcance orgânico. Nenhuma campanha paga foi rodada — há espaço para crescer.',
      },
    ],
    planoExecucaoDescricao: 'O trabalho será dividido em 3 meses para estruturar o tráfego pago, lançar a plataforma de cursos e consolidar um ecossistema digital que gera vendas de forma consistente.',
    roadmap: [
      {
        titulo: 'Mês 1',
        descricao: 'Criar painel Meta Ads, instalar Pixel na landing page, definir públicos-alvo, criar primeiros criativos. Estruturar a plataforma de cursos e configurar o acesso integrado ao Livro Vivo no Notion.',
      },
      {
        titulo: 'Mês 2',
        descricao: 'Ativar campanhas de tráfego pago com foco em vendas do livro digital. Publicar os primeiros vídeos na plataforma de cursos. Relatório de primeiros resultados com ajustes de campanha.',
      },
      {
        titulo: 'Mês 3',
        descricao: 'Otimizar campanhas com base nos dados: ajuste de públicos, criativos e orçamento. Ampliar conteúdo na plataforma de cursos. Relatório completo de desempenho para decisão de continuidade.',
      },
    ],
    cenarios: [
      {
        titulo: 'Tráfego pago ativo',
        destaque: 'Vendas além do orgânico',
        descricao: 'Campanhas no Meta Ads levando nutricionistas diretamente à landing page com intenção de compra do Livro Vivo.',
        nivel: 'conservador',
      },
      {
        titulo: 'Plataforma de cursos',
        destaque: 'Novo produto, nova receita',
        descricao: 'Cursos em vídeo complementando o Livro Vivo, tornando o produto mais completo e abrindo um novo canal de monetização.',
        nivel: 'realista',
      },
      {
        titulo: 'Ecossistema digital',
        destaque: 'Instagram + Anúncios + Curso',
        descricao: 'Os três canais funcionando juntos: conteúdo orgânico gerando autoridade, tráfego pago gerando vendas e a plataforma de cursos fidelizando nutricionistas.',
        nivel: 'otimista',
      },
    ],
  },

  prazoEntrega: 'Início em até 5 dias úteis após aprovação e acessos liberados',

  valorTotal: 800,
  mensalidade: 1300,

  investimento: {
    titulo: 'Implantação',
    descricao:
      'Valor único de setup para criação do painel Meta Ads, instalação do Pixel na landing page, estruturação da plataforma de cursos e configuração do acesso integrado ao Livro Vivo no Notion.',
    recursos: [
      'Criação e configuração do painel Meta Ads',
      'Instalação do Pixel na landing page',
      'Estruturação da plataforma de cursos em vídeo',
      'Configuração do acesso integrado ao Notion',
      'Definição da estratégia inicial de públicos e criativos',
    ],
  },

  pagamento: {
    entrada: 0,
    saldo: 0,
    descricao:
      'Implantação de R$ 800,00 cobrada na aprovação + mensalidade de R$ 1.300,00 a partir do primeiro mês de gestão. Contrato mínimo de 3 meses com renovação automática para mais 3 meses. Verba de anúncios de pelo menos R$ 500,00/mês depositada diretamente na conta Meta Ads da Lucia — separada da mensalidade de gestão.',
  },

  validade: '30 dias',

  observacoes: '',
  mostrarDetalhesComerciais: true,

  criadoEm: '2026-05-17T12:00:00-03:00',
}

// Mapa de todas as propostas disponíveis (para o dashboard)
export const todasPropostas: PropostaData[] = [
  propostaLucia,
  propostaAudioTao,
  propostaPreamar,
]
