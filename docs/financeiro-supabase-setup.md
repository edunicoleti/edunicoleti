# Financeiro — Configurar sincronização na nuvem (Supabase)

O painel `/financeiro` funciona de dois modos:

- **Sem configuração:** os dados ficam salvos no navegador (localStorage). Funciona,
  mas não sincroniza entre PC e celular. O selo no topo mostra "Neste navegador".
- **Com Supabase:** os dados vão para um banco na nuvem, gratuito, e a senha vira
  autenticação de verdade. O selo muda para "Sincronizado".

## Passo a passo (~5 minutos)

### 1. Criar o projeto

1. Acesse [supabase.com](https://supabase.com) → **Start your project** → login com GitHub.
2. **New project** → nome `edunicoleti-financeiro`, região `South America (São Paulo)`,
   e uma senha forte para o banco (guarde, mas não vai usar no dia a dia).

### 2. Criar as tabelas

No painel do projeto, abra **SQL Editor** → **New query**, cole o SQL abaixo e clique **Run**:

```sql
create table fin_categories (
  id uuid primary key,
  name text not null,
  color text not null
);

create table fin_cards (
  id uuid primary key,
  name text not null
);

create table fin_series (
  id uuid primary key,
  type text not null,
  name text not null,
  category_id uuid,
  card_id uuid,
  amount_cents bigint not null,
  due_day int,
  start_month text not null,
  end_month text,
  skip_months text[] not null default '{}'
);

create table fin_entries (
  id uuid primary key,
  month text not null,
  type text not null,
  name text not null,
  category_id uuid,
  card_id uuid,
  amount_cents bigint not null,
  due_day int,
  paid boolean not null default false,
  installment_current int,
  installment_total int,
  series_id uuid
);

create index fin_entries_month_idx on fin_entries (month);

-- Só usuário logado acessa
alter table fin_categories enable row level security;
alter table fin_cards enable row level security;
alter table fin_series enable row level security;
alter table fin_entries enable row level security;

create policy "authenticated_all" on fin_categories
  for all to authenticated using (true) with check (true);
create policy "authenticated_all" on fin_cards
  for all to authenticated using (true) with check (true);
create policy "authenticated_all" on fin_series
  for all to authenticated using (true) with check (true);
create policy "authenticated_all" on fin_entries
  for all to authenticated using (true) with check (true);
```

### 3. Criar o usuário de acesso

1. **Authentication → Users → Add user → Create new user**
2. E-mail: `edunicoleti@gmail.com`
3. Senha: `0800#financeiro` — o app adiciona o sufixo `#financeiro` automaticamente,
   então **no site você digita só `0800`**.
4. Marque **Auto Confirm User**.

Recomendado: em **Authentication → Sign In / Up**, desative **Allow new users to sign up**
para ninguém criar conta no seu projeto.

### 4. Colar as chaves no deploy

1. No Supabase: **Project Settings → API** → copie a **Project URL** e a chave **anon public**.
2. No painel do provedor de deploy (Vercel/Netlify/Cloudflare), adicione as variáveis
   de ambiente e faça um novo deploy:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Para desenvolvimento local, crie um arquivo `.env.local` na raiz com as mesmas linhas
(ele já é ignorado pelo git).

### 5. Migrar os dados do navegador (se já usou o modo local)

Antes de ativar as variáveis: no `/financeiro`, clique em **Exportar backup**.
Depois do deploy com Supabase: entre de novo e use **Importar backup**.
Se nunca lançou nada além do seed, não precisa — o seed é recriado sozinho.
