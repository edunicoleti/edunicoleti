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
    { descricao: 'Webdesign estrutural responsivo', incluido: true },
    { descricao: 'Desenvolvimento Front-end e Back-end veloz (React/Vite)', incluido: true },
    { descricao: 'Botão flutuante de WhatsApp para contato instantâneo', incluido: true },
    { descricao: 'Otimização avançada para os buscadores (SEO Técnico)', incluido: true },
    { descricao: 'Hospedagem em servidor de alta performance (Cloud Hosting)', incluido: true },
    { descricao: 'Rotinas semanais automáticas de Backup de Segurança', incluido: true },
    { descricao: 'Atualizações técnicas preventivas (Plugins, dependências e SSL)', incluido: true },
    { descricao: 'Solicitações de atualizações simples de conteúdo do site', incluido: true },
  ],

  tecnologias: ['React', 'Vite', 'Cloud Hosting', 'Infraestrutura Otimizada'],

  prazoEntrega: 'Cerca de 20 dias após etapa de briefing e receber arquivos e conteúdos da empresa',
  
  valorTotal: 6000,
  mensalidade: 280,

  pagamento: {
    entrada: 0,
    saldo: 0,
    descricao: 'Forma de pagamento negociável. A manutenção e hospedagem inicia somente com o projeto concluído, ao publicar o site.',
  },

  validade: '30 dias',

  observacoes: '',

  criadoEm: new Date().toISOString(),
}

// Mapa de todas as propostas disponíveis (para o dashboard)
export const todasPropostas: PropostaData[] = [
  propostaPreamar,
]
