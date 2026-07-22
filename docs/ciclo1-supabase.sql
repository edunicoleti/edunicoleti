-- =============================================================================
-- CICLO 1 — CRM + propostas no Supabase (projeto agcfjutjukuaqomtmxhd)
-- Rode este arquivo INTEIRO no SQL Editor do Supabase (New query -> colar -> Run).
-- É idempotente: pode rodar de novo sem duplicar (usa IF NOT EXISTS / ON CONFLICT).
--
-- O que ele cria:
--   1. crm_leads       — os leads do funil
--   2. crm_activities  — atividades/follow-ups de cada lead
--   3. crm_proposals   — as propostas (saem do código e passam a viver aqui)
--   4. RPCs de leitura pública da proposta (com a tabela negada ao anônimo)
--   5. Migração das 3 propostas que já existiam (Preamar, AudioTao, Lucia)
-- =============================================================================

-- Bump automático de updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. LEADS
-- ---------------------------------------------------------------------------
create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  empresa text,
  email text,
  telefone text,
  origem text not null default 'manual',
  valor_est_cents bigint not null default 0,
  stage text not null default 'novo',
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_crm_leads_updated on public.crm_leads;
create trigger trg_crm_leads_updated before update on public.crm_leads
  for each row execute function public.set_updated_at();

alter table public.crm_leads enable row level security;
drop policy if exists "authenticated_all" on public.crm_leads;
create policy "authenticated_all" on public.crm_leads
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 2. ACTIVITIES (follow-ups) — apagam junto com o lead (cascade)
-- ---------------------------------------------------------------------------
create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  tipo text not null default 'nota',
  descricao text not null,
  due_at timestamptz,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists crm_activities_lead_idx on public.crm_activities (lead_id);

alter table public.crm_activities enable row level security;
drop policy if exists "authenticated_all" on public.crm_activities;
create policy "authenticated_all" on public.crm_activities
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 3. PROPOSALS — a fonte da verdade das propostas
--    token: string não sequencial (privacidade futura do link)
--    status: rascunho | enviada | vista | aceita | recusada
-- ---------------------------------------------------------------------------
create table if not exists public.crm_proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.crm_leads(id) on delete set null,
  slug text unique not null,
  token text not null default replace(gen_random_uuid()::text, '-', ''),
  status text not null default 'enviada',
  data jsonb not null,
  first_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_crm_proposals_updated on public.crm_proposals;
create trigger trg_crm_proposals_updated before update on public.crm_proposals
  for each row execute function public.set_updated_at();

-- RLS: só o usuário logado (você) lê/escreve direto na tabela.
-- O anônimo NÃO ganha policy nenhuma -> não consegue ler a base inteira.
alter table public.crm_proposals enable row level security;
drop policy if exists "authenticated_all" on public.crm_proposals;
create policy "authenticated_all" on public.crm_proposals
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 4. RPCs de leitura pública (security definer: driblam a RLS de forma controlada)
--    O cliente abre /proposta/:slug sem login; a função devolve SÓ aquela linha.
-- ---------------------------------------------------------------------------
create or replace function public.get_proposta_publica(p_slug text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select data from public.crm_proposals
  where slug = p_slug and status <> 'rascunho'
  limit 1;
$$;

-- Marca o 1º acesso do cliente e promove 'enviada' -> 'vista'
create or replace function public.registrar_visita_proposta(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.crm_proposals
  set first_seen_at = coalesce(first_seen_at, now()),
      status = case when status = 'enviada' then 'vista' else status end
  where slug = p_slug;
$$;

grant execute on function public.get_proposta_publica(text) to anon, authenticated;
grant execute on function public.registrar_visita_proposta(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. MIGRAÇÃO das propostas que estavam no código (src/data/propostas.ts)
--    Idempotente: rodar de novo só atualiza os dados.
-- ---------------------------------------------------------------------------
insert into public.crm_proposals (slug, status, data) values
(
  'preamar', 'enviada',
  $json$
  {
    "slug": "preamar",
    "cliente": { "nome": "Jouber", "empresa": "Preamar Serviços Marítimos Ltda", "cargo": "", "email": "", "telefone": "" },
    "projeto": {
      "titulo": "Novo Site Institucional da Preamar",
      "tipo": "Projeto Web + Manutenção",
      "descricao": "Desenvolvimento de um novo site institucional profissional para a Preamar Serviços Marítimos Ltda. O projeto contempla design limpo, focado em credibilidade e apresentação de serviços institucionais, integrando rapidamente o cliente aos canais de contato via WhatsApp. Esta proposta inclui manutenção contínua e hospedagem segura para garantir a estabilidade do site na internet.",
      "tags": ["Site institucional", "Hospedagem", "Manutenção contínua", "Backups e Segurança"]
    },
    "escopo": [
      { "descricao": "Desenvolvimento web completo do site institucional", "incluido": true },
      { "descricao": "Botão flutuante de WhatsApp para contato instantâneo", "incluido": true },
      { "descricao": "Otimização para os buscadores e recomendações de IA (SEO Técnico)", "incluido": true },
      { "descricao": "Hospedagem com rotinas de Backup de Segurança", "incluido": true }
    ],
    "tecnologias": ["React", "Vite", "Cloud Hosting", "Infraestrutura Otimizada"],
    "prazoEntrega": "Cerca de 20 dias após etapa de briefing e receber arquivos e conteúdos da empresa",
    "valorTotal": 3000,
    "mensalidade": 0,
    "opcoesHospedagem": [
      { "titulo": "1 Ano de Hospedagem", "valorFormatado": "R$ 650,00" },
      { "titulo": "2 Anos de Hospedagem", "valorFormatado": "R$ 1.000,00" },
      { "titulo": "Sem hospedagem", "valorFormatado": "Isento", "descricao": "Você recebe os arquivos do site para hospedar por conta própria." }
    ],
    "pagamento": { "entrada": 0, "saldo": 0, "descricao": "Parcelamento em 4x, fatura gerada automaticamente todo dia 10 de cada mês." },
    "validade": "30 dias",
    "observacoes": "",
    "criadoEm": "2026-07-01T12:00:00-03:00"
  }
  $json$::jsonb
),
(
  'audiotao', 'enviada',
  $json$
  {
    "slug": "audiotao",
    "cliente": { "nome": "Maristela Montagner", "empresa": "Clínica Fonoaudiologia Avançada", "cargo": "", "email": "", "telefone": "" },
    "projeto": {
      "titulo": "Gestão de Tráfego Pago para a AudioTao",
      "tipo": "Google Ads + Meta Ads",
      "descricao": "A AudioTao já tem uma base importante pronta: campanha ativa no Google Ads, painel do Meta Ads organizado e Pixel configurado no site. Hoje, a campanha do Google está em uma configuração mais automática. A próxima etapa é criar campanhas mais segmentadas, com páginas de conversão e foco em agendamentos e oportunidades reais para aparelhos auditivos, avaliação auditiva, terapia para zumbido e CPAP.",
      "tags": ["Google Ads", "Meta Ads", "Landing Pages", "Leads qualificados"]
    },
    "escopo": [
      { "descricao": "Criar landing pages para os principais serviços: aparelhos auditivos, terapia de zumbido, CPAP e avaliação auditiva", "incluido": true },
      { "descricao": "Criar campanhas específicas no Google Ads para pessoas que já estão buscando solução no momento", "incluido": true },
      { "descricao": "Separar campanhas, palavras-chave e anúncios por serviço para aumentar a intenção de conversão", "incluido": true },
      { "descricao": "Criar campanhas na Meta para qualificação de leads, geração de mensagens e remarketing", "incluido": true },
      { "descricao": "Configurar públicos e acompanhamento pelo Pixel da Meta para medir acessos e conversões", "incluido": true },
      { "descricao": "Acompanhar leads, mensagens e oportunidades de agendamento para orientar as otimizações mensais", "incluido": true }
    ],
    "tecnologiasTitulo": "Canais e ferramentas",
    "tecnologias": ["Google Ads", "Meta Ads", "Pixel da Meta", "WhatsApp", "Landing pages", "Relatórios de desempenho"],
    "planejamentoVisual": {
      "situacaoAtual": [
        { "titulo": "Google Ads ativo", "descricao": "A conta já gera cliques para o site, mas ainda trabalha em uma lógica mais automática." },
        { "titulo": "Meta Ads organizado", "descricao": "O painel está estruturado para iniciar campanhas com mais controle e leitura dos resultados." },
        { "titulo": "Pixel configurado", "descricao": "A base de rastreamento já permite criar públicos e acompanhar o comportamento no site." },
        { "titulo": "Site como apoio", "descricao": "As campanhas podem ganhar páginas mais focadas para transformar acessos em contatos." }
      ],
      "roadmap": [
        { "titulo": "Mês 1", "descricao": "Criar landing pages dos serviços principais e estruturar campanhas específicas no Google Ads para buscas com intenção imediata." },
        { "titulo": "Mês 2", "descricao": "Ativar campanhas na Meta para qualificar leads, gerar mensagens e criar públicos de remarketing com base nos acessos." },
        { "titulo": "Mês 3", "descricao": "Otimizar termos de busca, anúncios, páginas e públicos para melhorar a qualidade dos contatos e oportunidades de agendamento." }
      ],
      "cenarios": [
        { "titulo": "Landing pages por serviço", "destaque": "Páginas focadas em conversão", "descricao": "Cada serviço principal terá uma página direcionada para explicar a solução, orientar o contato e facilitar o agendamento.", "nivel": "conservador" },
        { "titulo": "Google Ads segmentado", "destaque": "Demanda de quem está buscando agora", "descricao": "Campanhas separadas por serviço para atrair pessoas que pesquisam por aparelhos auditivos, zumbido, CPAP ou avaliação auditiva.", "nivel": "realista" },
        { "titulo": "Meta Ads e remarketing", "destaque": "Mensagens de interessados qualificados", "descricao": "Campanhas para qualificar leads, gerar mensagens de interessados com potencial de agendamento e reimpactar pessoas que acessaram as páginas dos serviços.", "nivel": "otimista" }
      ]
    },
    "prazoEntrega": "Organização inicial em até 7 dias úteis após aprovação e acessos liberados",
    "valorTotal": 800,
    "mensalidade": 0,
    "investimento": {
      "titulo": "Mensalidade de gestão",
      "descricao": "Mensalidade de R$ 800,00 para gestão, acompanhamento e otimização das campanhas no Google Ads, Meta Ads e landing pages. A recomendação é manter o trabalho por pelo menos 3 meses para ter volume de dados, testar campanhas e buscar um resultado mais consistente.",
      "recursos": [
        "Gestão mensal em Google Ads e Meta Ads",
        "Gestão do site e landing pages para campanhas",
        "Período mínimo recomendado de 3 meses",
        "Verba patrocinada recomendada de pelo menos R$ 1.000,00 por mês, depositada direto nas contas de anúncio",
        "Relatório mensal de acessos, conversões e desempenho das campanhas"
      ]
    },
    "pagamento": { "entrada": 0, "saldo": 0, "descricao": "Mensalidade de R$ 800,00, com período mínimo recomendado de 3 meses. Recomendo pelo menos R$ 1.000,00 mensais de verba patrocinada, depositada diretamente nas contas de anúncio." },
    "validade": "30 dias",
    "observacoes": "",
    "mostrarDetalhesComerciais": false,
    "criadoEm": "2026-05-11T12:00:00-03:00"
  }
  $json$::jsonb
),
(
  'lucia-cardapios', 'enviada',
  $json$
  {
    "slug": "lucia-cardapios",
    "cliente": { "nome": "Lucia Chaise Borjes", "empresa": "Cardápios: Um Livro Vivo", "cargo": "", "email": "", "telefone": "" },
    "projeto": {
      "titulo": "Cardápios: Um Livro Vivo, o Produto Completo",
      "tipo": "Meta Ads + Conteúdo + Plataforma de Cursos",
      "descricao": "O Cardápios: Um Livro Vivo ganha uma nova dimensão com os cursos em vídeo da Lucia, onde o Livro Vivo funciona como o material de referência permanente e sempre atualizado. Nutricionistas aprendem com as aulas e consultam o livro no dia a dia. Para colocar esse produto no mercado, a proposta inclui a estruturação da plataforma de cursos, tráfego pago no Meta Ads para gerar vendas consistentes e presença semanal no Instagram.",
      "tags": ["Meta Ads", "Conteúdo Orgânico", "Plataforma de Cursos", "Edição de Vídeos"]
    },
    "escopo": [
      { "descricao": "Estruturação da plataforma de cursos em vídeo com o Livro Vivo como material de referência do curso", "incluido": true },
      { "descricao": "Edição dos vídeos gravados pela Lucia e upload na plataforma de cursos", "incluido": true },
      { "descricao": "Criação e configuração do painel de anúncios no Meta Ads com instalação do Pixel na landing page", "incluido": true },
      { "descricao": "Definição de estratégia de venda e estruturação de públicos-alvo para nutricionistas e estudantes", "incluido": true },
      { "descricao": "Criação de criativos (imagens e textos) para as campanhas de tráfego pago", "incluido": true },
      { "descricao": "Gerenciamento mensal das campanhas com relatórios e ajustes de otimização", "incluido": true },
      { "descricao": "1 post semanal no Instagram (@cardapioslivrovivo) para manutenção da presença orgânica", "incluido": true }
    ],
    "tecnologiasTitulo": "Canais e ferramentas",
    "tecnologias": ["Meta Ads", "Instagram", "Pixel da Meta", "Plataforma de Cursos", "Landing Page", "Relatórios de desempenho"],
    "planejamentoVisual": {
      "situacaoAtual": [
        { "titulo": "Produto pronto para venda", "descricao": "O Livro Vivo está desenvolvido e disponível com acesso vitalício. A landing page está publicada e recebendo visitas." },
        { "titulo": "Base orgânica construída", "descricao": "Três meses de conteúdo no @cardapioslivrovivo apresentaram o produto, criaram contexto e geraram os primeiros seguidores." },
        { "titulo": "Sem tráfego pago ainda", "descricao": "Todas as vendas dependem do alcance orgânico. Nenhuma campanha paga foi rodada, e é aí que está o maior espaço para crescer." }
      ],
      "cenarios": [
        { "titulo": "O produto completo", "destaque": "Curso em vídeo + Livro Vivo", "descricao": "Nutricionistas aprendem com a Lucia nas aulas e têm o Livro Vivo como material de consulta permanente. Um produto mais completo, com mais valor percebido no mercado.", "nivel": "conservador" },
        { "titulo": "Vendas via tráfego pago", "destaque": "Campanhas ativas no Meta Ads", "descricao": "Anúncios segmentados para nutricionistas e estudantes levando direto à página de venda — compras independentes do alcance orgânico.", "nivel": "realista" },
        { "titulo": "Presença e receita contínuas", "destaque": "Instagram + Anúncios + Cursos", "descricao": "Conteúdo semanal gerando autoridade, tráfego pago gerando vendas e a plataforma de cursos entregando uma experiência que se diferencia no mercado.", "nivel": "otimista" }
      ]
    },
    "prazoEntrega": "1 mês de implantação após aprovação e acessos liberados",
    "valorTotal": 1500,
    "mensalidade": 1200,
    "investimento": {
      "titulo": "Implantação (Mês 1)",
      "descricao": "Cobrado na aprovação e executado ao longo do primeiro mês. Inclui a criação da plataforma de cursos, configuração do painel Meta Ads e elaboração dos criativos das campanhas.",
      "recursos": [
        "Estruturação da plataforma de cursos em vídeo",
        "Criação e configuração do painel Meta Ads",
        "Instalação do Pixel na landing page",
        "Elaboração dos criativos iniciais das campanhas",
        "Definição da estratégia de públicos-alvo"
      ]
    },
    "mensalidadeInfo": {
      "titulo": "Gestão Mensal (a partir do Mês 2)",
      "descricao": "Inicia no segundo mês, após a conclusão da implantação, com a plataforma de cursos pronta e os anúncios no ar. Contrato mínimo de 3 meses com renovação automática por mais 3 meses, tempo suficiente para acumular dados, otimizar campanhas e gerar resultado consistente.",
      "recursos": [
        "Gestão e otimização das campanhas Meta Ads",
        "1 post semanal no Instagram (@cardapioslivrovivo)",
        "Relatório mensal de tráfego pago e conversões",
        "Edição de vídeos gravados pela Lucia + upload na plataforma de cursos",
        "Verba de anúncios: mínimo R$ 500,00/mês depositada diretamente na conta Meta Ads"
      ]
    },
    "pagamento": { "entrada": 0, "saldo": 0, "descricao": "Implantação de R$ 1.500,00 cobrada na aprovação, com entrega ao longo do primeiro mês. Gestão mensal de R$ 1.200,00 a partir do segundo mês, com contrato de 3 meses e renovação automática por mais 3 meses. Verba de anúncios de pelo menos R$ 500,00/mês depositada diretamente na conta Meta Ads, valor separado da mensalidade." },
    "validade": "30 dias",
    "observacoes": "",
    "mostrarDetalhesComerciais": false,
    "criadoEm": "2026-05-17T12:00:00-03:00"
  }
  $json$::jsonb
)
on conflict (slug) do update
  set data = excluded.data, status = excluded.status;

-- =============================================================================
-- FIM. Depois de rodar, confira:
--   select slug, status, data->'cliente'->>'empresa' as empresa from crm_proposals;
-- e acesse /proposta/preamar no site (deve carregar do banco).
-- =============================================================================
