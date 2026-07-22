import type { PropostaData } from './proposta.types'

// =============================================================================
// As propostas dos clientes agora vivem no Supabase (tabela `crm_proposals`) e
// são lidas por slug via `propostaStore.ts`. Antes ficavam aqui, estáticas, e
// iam inteiras no bundle — o que expunha os dados e valores de todos os clientes
// a qualquer visitante de uma proposta. Este arquivo ficou só como ponto de
// fallback para desenvolvimento local SEM Supabase configurado: preencha o array
// abaixo se precisar testar a página de proposta offline. Em produção ele fica
// vazio e nada de cliente trafega no bundle.
//
// Para criar/editar propostas de verdade, use o painel em /propostas.
// =============================================================================

export const todasPropostas: PropostaData[] = []
