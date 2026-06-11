-- ============================================
-- Migration 001: Schema Inicial
-- Cyber Informática - B2B Laminação OCA
-- ============================================
-- Como executar:
-- 1. Abra Supabase Dashboard
-- 2. Vá em SQL Editor → New Query
-- 3. Cole TODO este arquivo
-- 4. Clique RUN (Ctrl+Enter)
-- ============================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- Tabela: leads
-- ============================================
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

-- ============================================
-- Tabela: cotacoes (anônimas, da LP)
-- ============================================
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

-- ============================================
-- Tabela: modelos_preco (catálogo)
-- ============================================
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

-- ============================================
-- Tabela: configuracao_precos (faixas)
-- ============================================
create table if not exists public.configuracao_precos (
  id int primary key default 1,
  ativo boolean not null default true,
  faixas jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- ============================================
-- Trigger genérico para updated_at
-- ============================================
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
