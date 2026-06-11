# GUIA DE SETUP — FASE 0
## Cyber Informática B2B · Supabase + Vercel + GitHub

**Subdomínio produção**: `telas.cyberinformatica.tech`
**GitHub**: github.com/iflcosta
**Email transacional**: contato@cyberinformatica.tech
**Data**: 11/06/2026

---

## 📋 CHECKLIST GERAL

- [ ] 1. Criar nova conta Supabase (pra ter free-tier limpo)
- [ ] 2. Criar projeto Supabase novo
- [ ] 3. Rodar migrations (schema + RLS + seed)
- [ ] 4. Pegar credenciais Supabase (URL + keys)
- [ ] 5. Criar repositório no GitHub
- [ ] 6. Conectar Vercel ao GitHub
- [ ] 7. Configurar variáveis de ambiente na Vercel
- [ ] 8. Configurar domínio `telas.cyberinformatica.tech` na Vercel
- [ ] 9. Configurar DNS no gerenciador do `cyberinformatica.tech`
- [ ] 10. Promover primeiro usuário a admin
- [ ] 11. Criar conta Resend
- [ ] 12. Configurar email de confirmação

---

## 1️⃣ CRIAR NOVA CONTA SUPABASE

**Por que outra conta?**
O free-tier do Supabase tem limite de **2 projetos por conta**. Sua conta atual já tá cheia.

**Como criar**:

1. Acesse: https://supabase.com/dashboard/sign-in
2. Clica em "Sign Up" (canto superior direito)
3. Escolha "Sign up with GitHub" (recomendado — integra com seu GitHub)
4. **Use o GitHub iflcosta** (a mesma que vai usar pros repos)
5. Confirme o e-mail se necessário
6. Faça login na nova conta

> 💡 **Dica**: se quiser, pode usar **GitHub Organizations** pra ter múltiplas contas. Mas criar conta pessoal nova é mais simples.

---

## 2️⃣ CRIAR PROJETO NO SUPABASE

1. No dashboard da nova conta: https://supabase.com/dashboard
2. Clica em **"New Project"**
3. Preenche:
   - **Name**: `cyber-laminacao` (ou `cyber-telas`)
   - **Database Password**: gere uma senha forte e **GUARDE** (vai usar depois)
   - **Region**: `South America (São Paulo)` ← **IMPORTANTE** pra latência BR
   - **Pricing Plan**: Free (default)
4. Clica **"Create new project"**
5. Aguarda ~2 minutos a provisionar

---

## 3️⃣ RODAR MIGRATIONS

Quando o projeto estiver pronto:

1. No menu lateral, clica em **"SQL Editor"**
2. Clica em **"New query"**
3. Cola e roda o SQL abaixo em **3 queries separadas** (uma por vez)

### Query 1: Schema inicial

```sql
-- ============================================
-- Migration 001: Initial Schema
-- ============================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Tabela: leads
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

-- Tabela: cotacoes (anônimas)
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

-- Tabela: modelos_preco
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

-- Tabela: configuracao_precos
create table if not exists public.configuracao_precos (
  id int primary key default 1,
  ativo boolean not null default true,
  faixas jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Triggers para updated_at
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
```

### Query 2: RLS Policies

```sql
-- ============================================
-- Migration 002: Row Level Security
-- ============================================

-- Habilitar RLS
alter table public.leads enable row level security;
alter table public.cotacoes enable row level security;
alter table public.modelos_preco enable row level security;
alter table public.configuracao_precos enable row level security;

-- ============================================
-- LEADS
-- ============================================
-- Público pode criar (a validação está no app)
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Apenas admin pode ver
drop policy if exists "leads_admin_select" on public.leads;
create policy "leads_admin_select" on public.leads
  for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- Apenas admin pode atualizar
drop policy if exists "leads_admin_update" on public.leads;
create policy "leads_admin_update" on public.leads
  for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- COTAÇÕES
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
```

### Query 3: Seed inicial

```sql
-- ============================================
-- Migration 003: Seed Inicial
-- ============================================

-- Tabela de faixas
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

-- Modelos (40+)
insert into public.modelos_preco (marca, modelo, valor_display_novo) values
  -- Apple
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
  -- Samsung
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
  -- Xiaomi
  ('xiaomi', 'Xiaomi 14 Pro', 2800.00),
  ('xiaomi', 'Xiaomi 14', 2100.00),
  ('xiaomi', 'Xiaomi 13T Pro', 1700.00),
  ('xiaomi', 'Redmi Note 13 Pro', 800.00),
  ('xiaomi', 'Redmi Note 12', 500.00),
  ('xiaomi', 'Poco X6 Pro', 900.00),
  ('xiaomi', 'Poco F6 Pro', 1600.00),
  -- Motorola
  ('motorola', 'Edge 50 Pro', 1600.00),
  ('motorola', 'Edge 40 Neo', 1100.00),
  ('motorola', 'Moto G84', 700.00),
  ('motorola', 'Moto G54', 500.00),
  ('motorola', 'Moto G24', 400.00),
  ('motorola', 'Razr 40 Ultra', 3200.00),
  ('motorola', 'Razr 40', 2200.00)
on conflict (marca, modelo) do nothing;
```

---

## 4️⃣ PEGAR CREDENCIAIS DO SUPABASE

Quando o projeto estiver pronto:

1. No menu lateral do Supabase, clica em **"Settings" → "API"**
2. Copie os 3 valores (guarde em local seguro):

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...  (public, segura)
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...      (SECRET, server-only)
```

3. **NUNCA exponha a service_role_key** no front-end. Use só em serverless functions.

---

## 5️⃣ CRIAR REPOSITÓRIO NO GITHUB

> **ATUALIZAÇÃO IMPORTANTE**: Como você já tem um site (`cyberinformatica.tech`) rodando na Vercel, vamos usar **monorepo com multi-app** no mesmo repositório.

**Estrutura no GitHub**: 
- Repo: `iflcosta/cyberinformatica` (ou nome similar — você decide)
- Apps: `apps/site-principal/` (seu site atual) + `apps/telas/` (novo projeto B2B)

**Como fazer (escolha uma das opções)**:

### Opção A: Repo NOVO separado (mais simples pra começar)

1. Acesse: https://github.com/new
2. Preencha:
   - **Owner**: iflcosta
   - **Repository name**: `cyber-telas` (ou outro)
   - **Description**: "Cyber Informática · Landing page B2B para laminação OCA"
   - **Visibilidade**: Private
3. Clica em **"Create repository"**
4. Anote a URL: `https://github.com/iflcosta/cyber-telas.git`

**Vantagem**: zero risco de quebrar o site atual
**Desvantagem**: 2 repos separados pra gerenciar

### Opção B: Monorepo (recomendado pra longo prazo)

1. Você já tem o repo do site principal
2. Vamos **adicionar** o `apps/telas/` dentro dele
3. Configurar Vercel pra detectar as 2 apps e fazer deploy independente

**Vantagem**: 1 lugar só, gestão unificada
**Desvantagem**: requer mover o site atual pra estrutura monorepo (mais trabalho)

**Minha recomendação**: vai de **Opção A** (repo separado) pra começar. Quando estiver tudo funcionando, a gente migra pra monorepo.

---

## 6️⃣ CONECTAR VERCEL AO GITHUB

> Se você já tem conta Vercel e o site principal conectado, pule pra **Opção A: Adicionar novo projeto ao Vercel existente**.

### Opção A: Vercel já tem o site principal (recomendado)

1. Acesse: https://vercel.com/dashboard
2. **"Add New..." → "Project"**
3. Selecione **"Import Git Repository"**
4. Procure por `cyber-telas` (ou o nome que você escolheu)
5. Clica **"Import"**
6. Configure o projeto (próximo passo)

### Opção B: Criar conta nova Vercel

1. Acesse: https://vercel.com/signup
2. **"Continue with GitHub"** (use a conta iflcosta)
3. Autorize Vercel
4. Pule o welcome

---

## 6️⃣ CONECTAR VERCEL AO GITHUB

1. Acesse: https://vercel.com/signup
2. **"Continue with GitHub"** (use a conta iflcosta)
3. Autorize Vercel a acessar seus repos
4. Pule o "Welcome" por enquanto

---

## 7️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE NA VERCEL

Quando o repositório estiver conectado e importado:

1. No projeto da Vercel (Vá em **Settings** → **Environment Variables**)
2. Adiciona cada variável abaixo:

| Key | Value | Ambiente |
|-----|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://telas.cyberinformatica.tech` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://cyber-telas-xxx.vercel.app` | Preview |
| `RESEND_API_KEY` | `re_...` | Production, Preview, Development |
| `RESEND_FROM_EMAIL` | `noreply@cyberinformatica.tech` | Production, Preview, Development |

3. Clica **"Save"** em cada uma
4. **NÃO** clica Deploy ainda (vai falhar pq ainda não tem código)

---

## 8️⃣ CONFIGURAR DOMÍNIO `telas.cyberinformatica.tech`

### No Vercel:

1. No projeto na Vercel, vai em **"Settings" → "Domains"**
2. Digita: `telas.cyberinformatica.tech`
3. Clica **"Add"**
4. Vercel vai mostrar os **DNS records** que você precisa adicionar:
   - Tipo `CNAME` apontando para `cname.vercel-dns.com`
   - OU tipo `A` apontando para `76.76.21.21`

### No gerenciador de DNS do `cyberinformatica.tech`:

Você vai precisar criar o subdomínio no provedor onde está registrado o domínio (Registro.br, Cloudflare, GoDaddy, etc):

**Se usa Cloudflare** (recomendado):
1. Adiciona o site `cyberinformatica.tech` no Cloudflare
2. Vai em **DNS** → **Records**
3. Clica **"Add record"**:
   - **Type**: CNAME
   - **Name**: `telas`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy**: DNS only (não proxied)
4. Salva
5. Volta na Vercel e clica **"Refresh"** pra verificar o DNS
6. SSL/HTTPS é automático via Vercel

**Se usa Registro.br**:
1. Acesse o painel do Registro.br
2. Vá em **DNS** → **Editar zonas**
3. Adiciona registro CNAME: `telas` → `cname.vercel-dns.com`
4. Salva
5. Propagação pode levar até 24h (mas geralmente é 30min)

---

## 9️⃣ PROMOVER PRIMEIRO ADMIN

Quando o Supabase Auth estiver funcionando:

1. Faça signup do primeiro usuário (no app ou direto no Supabase):
   - Email: `contato@cyberinformatica.tech` (ou outro seu)
   - Senha: forte, **GUARDE** num gerenciador de senhas
2. No Supabase SQL Editor, rode:
   ```sql
   select public.make_admin('contato@cyberinformatica.tech');
   ```
3. O usuário agora tem role `admin` e pode acessar `/admin`

---

## 🔟 CRIAR CONTA RESEND (E-MAIL TRANSACIONAL)

1. Acesse: https://resend.com/signup
2. **Sign up with GitHub** (mesma conta)
3. Verifica seu domínio `cyberinformatica.tech`:
   - Settings → Domains → Add Domain
   - Adiciona os DNS records (DKIM, SPF, etc)
4. Cria API Key:
   - API Keys → Create API Key
   - Copia o token (formato: `re_xxxxx`)
5. Adiciona no Vercel como variável `RESEND_API_KEY`

---

## ✅ CHECKPOINT DE VALIDAÇÃO

Depois de tudo configurado, valide:

- [ ] Acessou `telas.cyberinformatica.tech` e viu **alguma coisa** (mesmo que erro 404)
- [ ] HTTPS funciona (cadeado verde no navegador)
- [ ] Supabase dashboard mostra o projeto criado
- [ ] Tabelas existem (vá em **Table Editor**)
- [ ] Conseguiu criar primeiro usuário
- [ ] Rodou `make_admin` com sucesso
- [ ] Conseguiu ver dados de teste via SQL Editor

**Quando tudo isso passar, me avise que eu começo a Fase 1 (Next.js)!** 🚀

---

## ⏱️ TEMPO ESTIMADO

| Etapa | Tempo |
|-------|-------|
| Criar conta Supabase + projeto | 10 min |
| Rodar migrations | 10 min |
| Pegar credenciais | 2 min |
| Criar repo no GitHub | 3 min |
| Conectar Vercel | 5 min |
| Configurar variáveis | 10 min |
| Configurar DNS | 15 min (esperar propagar: 30min-24h) |
| Promover admin | 5 min |
| Setup Resend | 15 min |
| **Total** | **~1h a 1h30** |

---

## 🆘 PROBLEMAS COMUNS

### "Não consigo criar conta Supabase com GitHub iflcosta"
- Provavelmente a conta GitHub já tem outra Supabase linkada
- Solução: crie uma conta Supabase com **email/senha** separado

### "DNS não propaga"
- Aguarde 30min e tente de novo
- Use `nslookup telas.cyberinformatica.tech` no PowerShell pra checar
- Se usar Cloudflare, desative o proxy (deixe "DNS only")

### "Vercel não detecta o domínio"
- Confirme que o CNAME está apontando pra `cname.vercel-dns.com`
- Tente recarregar a página de domains da Vercel

### "Erro ao promover admin"
- Certifique que o email do usuário está EXATO (case-sensitive)
- O trigger só funciona pra usuários já criados

---

**Próximo passo**: me avise quando terminar o setup (ou se travar em alguma etapa) e eu começo a **Fase 1 (Next.js)**!
