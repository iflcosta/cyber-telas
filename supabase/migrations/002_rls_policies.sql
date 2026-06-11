-- ============================================
-- Migration 002: Row Level Security
-- Cyber Informática - B2B Laminação OCA
-- ============================================
-- Como executar:
-- 1. Abra Supabase Dashboard
-- 2. Vá em SQL Editor → New Query
-- 3. Cole TODO este arquivo
-- 4. Clique RUN (Ctrl+Enter)
-- ============================================

-- Habilitar RLS em todas as tabelas
alter table public.leads enable row level security;
alter table public.cotacoes enable row level security;
alter table public.modelos_preco enable row level security;
alter table public.configuracao_precos enable row level security;

-- ============================================
-- LEADS
-- Público pode criar (validação está no app)
-- Apenas admin pode ver/atualizar
-- ============================================
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "leads_admin_select" on public.leads;
create policy "leads_admin_select" on public.leads
  for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

drop policy if exists "leads_admin_update" on public.leads;
create policy "leads_admin_update" on public.leads
  for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- COTAÇÕES
-- Público pode inserir (analytics anônimo)
-- Apenas admin pode ver
-- ============================================
drop policy if exists "cotacoes_public_insert" on public.cotacoes;
create policy "cotacoes_public_insert" on public.cotacoes
  for insert
  to anon
  with check (true);

drop policy if exists "cotacoes_admin_select" on public.cotacoes;
create policy "cotacoes_admin_select" on public.cotacoes
  for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- MODELOS_PRECO
-- Leitura pública (apenas ativos)
-- Escrita apenas admin
-- ============================================
drop policy if exists "modelos_public_read" on public.modelos_preco;
create policy "modelos_public_read" on public.modelos_preco
  for select
  to anon, authenticated
  using (ativo = true);

drop policy if exists "modelos_admin_write" on public.modelos_preco;
create policy "modelos_admin_write" on public.modelos_preco
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- CONFIGURACAO_PRECOS
-- Leitura pública (apenas ativos)
-- Escrita apenas admin
-- ============================================
drop policy if exists "config_public_read" on public.configuracao_precos;
create policy "config_public_read" on public.configuracao_precos
  for select
  to anon, authenticated
  using (ativo = true);

drop policy if exists "config_admin_write" on public.configuracao_precos;
create policy "config_admin_write" on public.configuracao_precos
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Função helper: promote user to admin
-- Uso: select public.make_admin('email@exemplo.com');
-- ============================================
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
