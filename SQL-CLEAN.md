# MIGRATIONS — Copiar e Colar SEM os ```sql

> **ATENÇÃO**: copie cada bloco **inteiro** e cole no Supabase SQL Editor.
> NÃO copie as linhas com ``` (três crases) — elas são só visualização aqui.

---

## QUERY 1 — Schema Inicial

Cole exatamente isto (começando em "create extension..."):

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  razao_social text not null,
  cnpj text not null unique,
  email text not null,
  telefone text not null,
  volume_semanal text not null check (volume_semanal in
    ('1-10', '11-50', '51-100', '101-500', '500+')),
  marca text not null check (marca in
    ('apple', 'samsung', 'xiaomi', 'motorola', 'outros')),
  modelo_display text not null,
  valor_display_novo numeric(10,2) not null,
  preco_servico numeric(10,2) not null,
  faixa_aplicada text not null,
  ip_origem inet,
  user_agent text,
  status text not null default 'novo' check (status in
    ('novo', 'contatado', 'qualificado', 'cliente', 'recusado')),
  observacoes text,
  assigned_to uuid references auth.users(id)
);

create index if not exists idx_leads_cnpj on public.leads(cnpj);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_leads_marca on public.leads(marca);

create table if not exists public.cotacoes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  marca text not null,
  modelo text not null,
  valor_display_novo numeric(10,2) not null,
  preco_servico numeric(10,2) not null,
  faixa_aplicada text not null,
  ip_origem inet,
  user_agent text,
  referrer text
);

create index if not exists idx_cotacoes_created_at on public.cotacoes(created_at desc);
create index if not exists idx_cotacoes_marca on public.cotacoes(marca);
create index if not exists idx_cotacoes_modelo on public.cotacoes(modelo);

create table if not exists public.modelos_preco (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  valor_display_novo numeric(10,2) not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(marca, modelo)
);

create index if not exists idx_modelos_marca on public.modelos_preco(marca);

create table if not exists public.configuracao_precos (
  id int primary key default 1,
  ativo boolean not null default true,
  faixas jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

create trigger trg_modelos_updated_at
  before update on public.modelos_preco
  for each row execute function public.handle_updated_at();

create trigger trg_config_updated_at
  before update on public.configuracao_precos
  for each row execute function public.handle_updated_at();

---

## QUERY 2 — RLS Policies

alter table public.leads enable row level security;
alter table public.cotacoes enable row level security;
alter table public.modelos_preco enable row level security;
alter table public.configuracao_precos enable row level security;

drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated
  with check (true);

drop policy if exists "leads_admin_select" on public.leads;
create policy "leads_admin_select" on public.leads
  for select to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

drop policy if exists "leads_admin_update" on public.leads;
create policy "leads_admin_update" on public.leads
  for update to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

drop policy if exists "cotacoes_public_insert" on public.cotacoes;
create policy "cotacoes_public_insert" on public.cotacoes
  for insert to anon
  with check (true);

drop policy if exists "cotacoes_admin_select" on public.cotacoes;
create policy "cotacoes_admin_select" on public.cotacoes
  for select to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

drop policy if exists "modelos_public_read" on public.modelos_preco;
create policy "modelos_public_read" on public.modelos_preco
  for select to anon, authenticated
  using (ativo = true);

drop policy if exists "modelos_admin_write" on public.modelos_preco;
create policy "modelos_admin_write" on public.modelos_preco
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

drop policy if exists "config_public_read" on public.configuracao_precos;
create policy "config_public_read" on public.configuracao_precos
  for select to anon, authenticated
  using (ativo = true);

drop policy if exists "config_admin_write" on public.configuracao_precos;
create policy "config_admin_write" on public.configuracao_precos
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create or replace function public.make_admin(user_email text)
returns void
language plpgsql
security definer
as $$
begin
  update auth.users
  set raw_user_meta_data =
    coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
  where email = user_email;
end;
$$;

---

## QUERY 3 — Seed Inicial

insert into public.configuracao_precos (id, ativo, faixas) values (
  1,
  true,
  '[
    {"min": 0, "max": 500, "preco": 80, "label": "Econômico"},
    {"min": 500, "max": 1000, "preco": 120, "label": "Intermediário"},
    {"min": 1000, "max": 2000, "preco": 180, "label": "Premium"},
    {"min": 2000, "max": 3500, "preco": 250, "label": "Top"},
    {"min": 3500, "max": 999999, "preco": 320, "label": "Flagship"}
  ]'::jsonb
) on conflict (id) do nothing;

insert into public.modelos_preco (marca, modelo, valor_display_novo) values
  ('apple', 'iPhone 15 Pro Max', 5400.00),
  ('apple', 'iPhone 15 Pro', 4400.00),
  ('apple', 'iPhone 15 Plus', 3800.00),
  ('apple', 'iPhone 15', 3200.00),
  ('apple', 'iPhone 14 Pro Max', 4200.00),
  ('apple', 'iPhone 14 Pro', 3500.00),
  ('apple', 'iPhone 14 Plus', 2900.00),
  ('apple', 'iPhone 14', 2400.00),
  ('apple', 'iPhone 13 Pro Max', 3200.00),
  ('apple', 'iPhone 13 Pro', 2700.00),
  ('apple', 'iPhone 13', 1900.00),
  ('apple', 'iPhone 13 mini', 1700.00),
  ('apple', 'iPhone 12 Pro Max', 2500.00),
  ('apple', 'iPhone 12 Pro', 2100.00),
  ('apple', 'iPhone 12', 1500.00),
  ('apple', 'iPhone 12 mini', 1300.00),
  ('apple', 'iPhone 11 Pro Max', 1800.00),
  ('apple', 'iPhone 11 Pro', 1500.00),
  ('apple', 'iPhone 11', 1100.00),
  ('apple', 'iPhone SE (3ª geração)', 900.00),
  ('apple', 'iPhone SE (2ª geração)', 600.00),
  ('apple', 'iPhone XR', 700.00),
  ('apple', 'iPhone XS Max', 900.00),
  ('samsung', 'Galaxy S24 Ultra', 4800.00),
  ('samsung', 'Galaxy S24+', 3500.00),
  ('samsung', 'Galaxy S24', 2700.00),
  ('samsung', 'Galaxy S23 Ultra', 3800.00),
  ('samsung', 'Galaxy S23+', 2800.00),
  ('samsung', 'Galaxy S23', 2100.00),
  ('samsung', 'Galaxy S22 Ultra', 3000.00),
  ('samsung', 'Galaxy S22+', 2200.00),
  ('samsung', 'Galaxy S22', 1700.00),
  ('samsung', 'Galaxy S21 Ultra', 2500.00),
  ('samsung', 'Galaxy S21+', 1800.00),
  ('samsung', 'Galaxy S21', 1400.00),
  ('samsung', 'Galaxy A55', 900.00),
  ('samsung', 'Galaxy A35', 700.00),
  ('samsung', 'Galaxy A15', 500.00),
  ('samsung', 'Galaxy Z Fold 5', 4200.00),
  ('samsung', 'Galaxy Z Flip 5', 2800.00),
  ('xiaomi', 'Xiaomi 14 Pro', 2800.00),
  ('xiaomi', 'Xiaomi 14', 2100.00),
  ('xiaomi', 'Xiaomi 13T Pro', 1700.00),
  ('xiaomi', 'Redmi Note 13 Pro', 800.00),
  ('xiaomi', 'Redmi Note 12', 500.00),
  ('xiaomi', 'Poco X6 Pro', 900.00),
  ('xiaomi', 'Poco F6 Pro', 1600.00),
  ('motorola', 'Edge 50 Pro', 1600.00),
  ('motorola', 'Edge 40 Neo', 1100.00),
  ('motorola', 'Moto G84', 700.00),
  ('motorola', 'Moto G54', 500.00),
  ('motorola', 'Moto G24', 400.00),
  ('motorola', 'Razr 40 Ultra', 3200.00),
  ('motorola', 'Razr 40', 2200.00)
on conflict (marca, modelo) do nothing;

---

## COMO EXECUTAR (passo a passo)

1. Abra o Supabase → SQL Editor → New Query
2. Copie APENAS o conteúdo da Query 1 (começando em "create extension...")
3. Cole no editor
4. Clique RUN (Ctrl+Enter)
5. Espere aparecer "Success"
6. Repita para Query 2 e Query 3
