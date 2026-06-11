# PLANO DE ARQUITETURA — Cyber Informática (B2B Laminação OCA)

**Data**: 11/06/2026
**Versão**: 2.0 (Supabase + Vercel + GitHub)
**Workspace**: C:\Users\User\Documents\laminacao
**IDE de dev**: MiniMax Code Desktop (esta sessão Mavis)

---

## 🎯 OBJETIVO DO PRODUTO

Plataforma B2B para captação e gestão de leads qualificados (lojistas e assistências técnicas) para serviço de **remanufatura e laminação OCA industrial de displays**, com:

- **Landing Page "Ponte"** — captação qualificada via cotação + cadastro CNPJ
- **Calculador de preço** — faixas por modelo de celular
- **Painel Admin** — gestão de leads, cotações, dashboard
- **Tudo em produção** — Supabase + Vercel + GitHub

---

## 🏗️ STACK DEFINITIVA

| Camada | Serviço | Função | Custo |
|--------|---------|--------|-------|
| **Banco de dados** | Supabase Postgres | Tabelas, RLS, functions | R$ 0 (free tier 500MB) |
| **Auth** | Supabase Auth | Autenticação admin (email/senha) | R$ 0 (50k MAU) |
| **API serverless** | Vercel Functions (Node/Edge) | Endpoints REST (cotação, leads, dashboard) | R$ 0 (100k requests/mês) |
| **Frontend estático** | Vercel CDN | Landing page + admin | R$ 0 (100GB bandwidth) |
| **Repositório** | GitHub | Código + CI/CD + Secrets | R$ 0 |
| **CI/CD** | GitHub Actions | Lint, typecheck, testes | R$ 0 (2000 min/mês) |
| **Domínio** | (Cyberinformatica.tech — já existe) | DNS | já pago |
| **Email transacional** | Resend | Confirmação de cadastro | R$ 0 (3k/mês) |
| **Monitoramento** | Sentry (opcional) | Error tracking | R$ 0 (5k eventos) |

**Custo total mensal**: **R$ 0** com free tiers + domínio que você já tem.

---

## 📁 ESTRUTURA DE PASTAS (Monorepo Multi-App)

```
cyberinformatica/                    # Repo único no GitHub
├── apps/
│   ├── site-principal/              # cyberinformatica.tech (site de montagem de PCs - JÁ EXISTE)
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── ...
│   │   ├── package.json
│   │   └── next.config.mjs
│   │
│   └── telas/                       # telas.cyberinformatica.tech (NOVO - B2B laminação)
│       ├── app/
│       │   ├── page.tsx             # Landing page
│       │   ├── layout.tsx
│       │   ├── admin/
│       │   │   ├── login/page.tsx
│       │   │   ├── page.tsx
│       │   │   ├── leads/page.tsx
│       │   │   └── cotacoes/page.tsx
│       │   ├── api/
│       │   │   ├── cotacoes/route.ts
│       │   │   ├── leads/route.ts
│       │   │   └── admin/
│       │   │       ├── leads/route.ts
│       │   │       └── dashboard/route.ts
│       │   └── globals.css
│       ├── components/
│       │   ├── Brand.tsx
│       │   ├── PriceCalculator.tsx
│       │   ├── FormQualificacao.tsx
│       │   └── ...
│       ├── lib/
│       │   ├── supabase.ts
│       │   ├── pricing.ts
│       │   ├── validators.ts
│       │   └── auth.ts
│       ├── middleware.ts            # Roteamento por subdomínio
│       ├── package.json
│       ├── next.config.mjs
│       └── tsconfig.json
│
├── packages/                        # Compartilhado (opcional)
│   └── ui/                          # Componentes visuais compartilhados
│       ├── Brand.tsx
│       └── package.json
│
├── supabase/                        # Migrations SQL (raiz do monorepo)
│   └── migrations/
│       ├── 000_ALL_IN_ONE.sql
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_seed_modelos.sql
│
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .env.example
├── package.json                     # Workspaces (root)
├── turbo.json                       # Turborepo config (se usar)
└── README.md
```

---

## 🗄️ SCHEMA DO BANCO (Supabase Postgres)

### Tabela: `leads`

```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Dados PJ
  razao_social text not null,
  cnpj text not null unique,
  email text not null,
  telefone text not null,
  volume_semanal text not null check (volume_semanal in 
    ('1-10', '11-50', '51-100', '101-500', '500+')),
  
  -- Cotação
  marca text not null check (marca in 
    ('apple', 'samsung', 'xiaomi', 'motorola', 'outros')),
  modelo_display text not null,
  valor_display_novo numeric(10,2) not null,
  preco_servico numeric(10,2) not null,
  faixa_aplicada text not null,
  
  -- Metadata
  ip_origem inet,
  user_agent text,
  status text not null default 'novo' check (status in 
    ('novo', 'contatado', 'qualificado', 'cliente', 'recusado')),
  observacoes text,
  
  -- Quem gerencia
  assigned_to uuid references auth.users(id)
);

create index idx_leads_cnpj on public.leads(cnpj);
create index idx_leads_status on public.leads(status);
create index idx_leads_created_at on public.leads(created_at desc);
create index idx_leads_marca on public.leads(marca);
```

### Tabela: `cotacoes` (anônimas, da LP)

```sql
create table public.cotacoes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  
  marca text not null,
  modelo text not null,
  valor_display_novo numeric(10,2) not null,
  preco_servico numeric(10,2) not null,
  faixa_aplicada text not null,
  
  -- Analytics
  ip_origem inet,
  user_agent text,
  referrer text
);

create index idx_cotacoes_created_at on public.cotacoes(created_at desc);
create index idx_cotacoes_marca on public.cotacoes(marca);
create index idx_cotacoes_modelo on public.cotacoes(modelo);
```

### Tabela: `modelos_preco` (catálogo editável)

```sql
create table public.modelos_preco (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  valor_display_novo numeric(10,2) not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  unique(marca, modelo)
);

create index idx_modelos_marca on public.modelos_preco(marca);
```

### Tabela: `configuracao_precos` (faixas editáveis)

```sql
create table public.configuracao_precos (
  id int primary key default 1,
  ativo boolean not null default true,
  faixas jsonb not null,         -- array de {min, max, preco}
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
```

### Tabela: `audit_log` (opcional, pra rastrear mudanças)

```sql
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id),
  action text not null,           -- 'lead.update', 'cotacao.create', etc
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb
);
```

---

## 🔐 ROW LEVEL SECURITY (RLS) — Segurança Crítica

```sql
-- Habilitar RLS em todas as tabelas
alter table public.leads enable row level security;
alter table public.cotacoes enable row level security;
alter table public.modelos_preco enable row level security;
alter table public.configuracao_precos enable row level security;
alter table public.audit_log enable row level security;

-- ============================================
-- LEADS: público pode INSERIR, apenas admin pode VER/ATUALIZAR
-- ============================================
create policy "leads_public_insert" on public.leads
  for insert
  to anon, authenticated
  with check (true);  -- qualquer um pode criar lead (a validação está no app)

create policy "leads_admin_select" on public.leads
  for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

create policy "leads_admin_update" on public.leads
  for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- COTAÇÕES: público pode inserir e ver (analytics leve)
-- ============================================
create policy "cotacoes_public_insert" on public.cotacoes
  for insert
  to anon
  with check (true);

create policy "cotacoes_admin_select" on public.cotacoes
  for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- MODELOS_PREÇO: leitura pública, escrita apenas admin
-- ============================================
create policy "modelos_public_read" on public.modelos_preco
  for select
  to anon, authenticated
  using (ativo = true);

create policy "modelos_admin_write" on public.modelos_preco
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- CONFIGURACAO_PRECOS: leitura pública, escrita admin
-- ============================================
create policy "config_public_read" on public.configuracao_precos
  for select
  to anon, authenticated
  using (ativo = true);

create policy "config_admin_write" on public.configuracao_precos
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');
```

### Função: criar primeiro admin

```sql
-- Após criar o primeiro usuário via Supabase Auth, promova a admin
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

-- Uso: select public.make_admin('seu@email.com');
```

---

## 💰 TABELA DE FAIXAS (seed inicial)

```sql
-- Inserir configuração padrão
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
);
```

---

## 📱 SEED DE MODELOS (40+ dispositivos)

```sql
insert into public.modelos_preco (marca, modelo, valor_display_novo) values
  -- Apple (iPhones)
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

  -- Samsung (S series)
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

  -- Samsung (Z Fold/Flip)
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
  ('motorola', 'Razr 40', 2200.00);
```

---

## 🔌 API ENDPOINTS

Todos como **Vercel Functions** (Node.js ou Edge Runtime):

### POST /api/cotacoes (público)
**Função**: calcular preço a partir de modelo

```typescript
// app/api/cotacoes/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calcularPreco, getFaixas } from '@/lib/pricing';

export async function POST(req: Request) {
  const { marca, modelo, valor_display_novo } = await req.json();

  // Validação
  if (!marca || !modelo) {
    return NextResponse.json({ error: 'marca e modelo são obrigatórios' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Buscar valor do display
  let valorDisplay = valor_display_novo;
  if (!valorDisplay) {
    const { data } = await supabase
      .from('modelos_preco')
      .select('valor_display_novo')
      .eq('marca', marca)
      .eq('modelo', modelo)
      .eq('ativo', true)
      .single();
    valorDisplay = data?.valor_display_novo;
  }

  if (!valorDisplay) {
    return NextResponse.json({ error: 'Modelo não encontrado' }, { status: 404 });
  }

  // Calcular preço
  const faixas = await getFaixas(supabase);
  const resultado = calcularPreco(valorDisplay, faixas);

  // Persistir cotação anônima (analytics)
  await supabase.from('cotacoes').insert({
    marca, modelo, valor_display_novo: valorDisplay,
    preco_servico: resultado.preco, faixa_aplicada: resultado.label,
  });

  return NextResponse.json({
    modelo,
    valor_display_novo: valorDisplay,
    preco: resultado.preco,
    faixa: resultado.label,
  });
}
```

### POST /api/leads (público)
**Função**: cadastrar lead qualificado

```typescript
// app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validarCNPJ, validarEmail, validarTelefone } from '@/lib/validators';
import { createClient } from '@supabase/supabase-js';

const LeadSchema = z.object({
  razao_social: z.string().min(3),
  cnpj: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  volume_semanal: z.enum(['1-10', '11-50', '51-100', '101-500', '500+']),
  marca: z.enum(['apple', 'samsung', 'xiaomi', 'motorola', 'outros']),
  modelo_display: z.string().min(1),
  valor_display_novo: z.number().positive(),
  preco_servico: z.number().positive(),
  faixa_aplicada: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = LeadSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', issues: parsed.error.issues }, { status: 400 });
  }
  
  const data = parsed.data;
  
  // Validações customizadas
  if (!validarCNPJ(data.cnpj)) {
    return NextResponse.json({ error: 'CNPJ inválido' }, { status: 400 });
  }
  if (!validarEmail(data.email)) {
    return NextResponse.json({ error: 'E-mail corporativo inválido' }, { status: 400 });
  }
  if (!validarTelefone(data.telefone)) {
    return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 });
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Verificar duplicidade
  const { data: existing } = await supabase
    .from('leads')
    .select('id')
    .eq('cnpj', data.cnpj)
    .single();
  
  if (existing) {
    return NextResponse.json({ error: 'CNPJ já cadastrado', lead_id: existing.id }, { status: 409 });
  }
  
  // Inserir
  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      ...data,
      ip_origem: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
    })
    .select('id, preco_servico')
    .single();
  
  if (error) {
    return NextResponse.json({ error: 'Erro ao criar lead', details: error.message }, { status: 500 });
  }
  
  // TODO: enviar email de confirmação via Resend
  
  return NextResponse.json({ ok: true, lead_id: lead.id, preco_servico: lead.preco_servico });
}
```

### GET /api/admin/leads (autenticado)
### GET /api/admin/dashboard (autenticado)
### PATCH /api/admin/leads/[id] (autenticado)
### GET /api/leads/[id] (autenticado)

---

## 🎨 FRONTEND — Next.js 14 App Router

### Stack frontend
- **Next.js 14+** (App Router, RSC)
- **TypeScript**
- **Tailwind CSS** (sem configuração extra — vem built-in)
- **React 18**
- **React Hook Form** + **Zod** (validação)
- **@supabase/ssr** (auth client-side)
- **Lucide React** (ícones)

### Páginas

| Rota | Tipo | Função |
|------|------|--------|
| `/` | Server Component | Landing page |
| `/admin/login` | Client | Login admin |
| `/admin` | Server (RSC) | Dashboard |
| `/admin/leads` | Server (RSC) | Lista de leads |
| `/admin/leads/[id]` | Server (RSC) | Detalhe do lead |
| `/admin/cotacoes` | Server (RSC) | Lista de cotações |

### Componentes principais

- `<Brand />` — logo + tagline responsivo
- `<Hero />` — hero section com gradiente animado
- `<Credentials />` — grid de 4 cards
- `<Advantages />` — 2 colunas com showcase panel
- `<Logistics />` — process flow horizontal
- `<PriceCalculator />` — seletor de marca + autocomplete + cotação
- `<PriceCalculatorSection />` — 5 cards com faixas visíveis
- `<QualificationForm />` — form completo com integração Supabase
- `<Footer />` — dados institucionais

---

## 🔐 AUTH ADMIN

### Fluxo

1. Admin acessa `/admin/login`
2. Digita email + senha
3. Supabase Auth valida
4. Server Component verifica `auth.getUser()` e checa `raw_user_meta_data.role === 'admin'`
5. Se sim, renderiza página; se não, redireciona para login

### Middleware

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  
  if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### Bootstrap do primeiro admin

```sql
-- 1. Criar usuário via Supabase Auth UI
-- 2. Promover a admin:
select public.make_admin('seu@cyberinformatica.tech');
```

---

## 🚀 DEPLOY (Vercel + GitHub)

### Setup inicial

```bash
# 1. Criar repositório no GitHub
gh repo create cyber-informatica-landing --public --source=. --remote=origin

# 2. Setup local
git init
git add .
git commit -m "feat: initial scaffold"
git push -u origin main

# 3. Conectar Vercel ao GitHub
#    - Acesse vercel.com
#    - New Project → Import cyber-informatica-landing
#    - Framework: Next.js
#    - Adicione as variáveis de ambiente (ver abaixo)

# 4. Configurar Supabase
#    - Acesse supabase.com
#    - New Project
#    - Anote URL e anon key + service role key
#    - Rode as migrations
```

### Variáveis de ambiente (Vercel + local `.env.local`)

```bash
# .env.example
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...      # server-only, NUNCA expor

# Resend (email transacional)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@cyberinformatica.tech

# App
NEXT_PUBLIC_APP_URL=https://cyberinformatica.tech
```

### GitHub Actions (CI)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
```

### Deploy automático

A cada `git push origin main` → Vercel deploya automaticamente.

---

## 🗺️ ROADMAP DE IMPLEMENTAÇÃO

### Fase 0 — Setup (1h)
- [ ] Criar projeto no Supabase
- [ ] Rodar migrations (schema + RLS + seed)
- [ ] Promover primeiro admin
- [ ] Criar repositório no GitHub
- [ ] Conectar Vercel ao GitHub

### Fase 1 — Landing Page migrada pra Next.js (3-4h)
- [ ] Setup Next.js 14 com TypeScript + Tailwind
- [ ] Migrar `landing-page-ponte.html` → `app/page.tsx`
- [ ] Componentes: Brand, Hero, Credentials, Advantages, Logistics
- [ ] Calculador de preço (client component)
- [ ] Tabela restrita (server component)
- [ ] Form de qualificação com integração /api/leads

### Fase 2 — API endpoints (2-3h)
- [ ] `app/api/cotacoes/route.ts`
- [ ] `app/api/leads/route.ts`
- [ ] `app/api/admin/leads/route.ts`
- [ ] `app/api/admin/dashboard/route.ts`
- [ ] `app/api/admin/leads/[id]/route.ts`

### Fase 3 — Painel Admin (3-4h)
- [ ] `app/admin/login/page.tsx` (auth flow)
- [ ] `app/admin/page.tsx` (dashboard com KPIs)
- [ ] `app/admin/leads/page.tsx` (lista + filtros)
- [ ] `app/admin/leads/[id]/page.tsx` (detalhe)
- [ ] `app/admin/cotacoes/page.tsx`
- [ ] `middleware.ts` (proteção de rotas)

### Fase 4 — Polish (2-3h)
- [ ] Email de confirmação (Resend)
- [ ] Loading states / skeletons
- [ ] Toast notifications
- [ ] Validação client-side com Zod
- [ ] Testes E2E com Playwright (opcional)
- [ ] SEO (metadata, OG image, sitemap, robots.txt)

### Fase 5 — Deploy final (1-2h)
- [ ] Conectar domínio customizado
- [ ] Testar fluxo end-to-end em produção
- [ ] Configurar monitoring (Sentry opcional)
- [ ] Documentar no README

**Total estimado**: 12-16 horas de trabalho focado.

---

## 💰 CUSTO MENSAL

| Serviço | Free tier | Custo após limite |
|---------|-----------|-------------------|
| Supabase Postgres | 500MB, 2GB bandwidth | $25/mês (Pro) |
| Supabase Auth | 50k MAU | $25/mês |
| Vercel | 100GB bandwidth, 100k requests | $20/mês (Pro) |
| GitHub | Público ilimitado | $0 |
| Resend | 3k emails/mês | $20/mês |
| **Total** | **R$ 0** | até R$ 600/mês se escalar |

**Expectativa realista de uso** (50 leads/mês, 500 pageviews/mês):
- Supabase: < 1MB usado
- Vercel: < 1GB bandwidth
- Resend: < 50 emails
- **Custo real: R$ 0/mês** 🎉

---

## 🎯 DIFERENCIAL VS PLANO ANTERIOR

| Aspecto | Plano antigo (FastAPI local) | Plano novo (Supabase + Vercel) |
|---------|------------------------------|-------------------------------|
| Banco | SQLite local | Postgres gerenciado (Supabase) |
| Hosting | Servidor Python na sua máquina | Vercel (CDN global) |
| Custo | R$ 0 mas precisa do PC ligado | R$ 0, serverless, 24/7 |
| Escalabilidade | Limitado | Ilimitada (free tier generoso) |
| Auth | Manual (sessão em cookie) | Supabase Auth (JWT, MFA, etc) |
| Backup | Manual | Automático (Supabase faz daily) |
| HTTPS | Manual | Automático (Vercel) |
| Domínio customizado | Você configura | Vercel configura em 2 cliques |
| Painel admin | HTML estático separado | Integrado no Next.js (RSC) |
| Latência | Do seu PC | Global CDN |
| Manutenção | Você atualiza servidor | Zero (serverless) |

---

## ✅ PRÓXIMOS PASSOS CONCRETOS

**Antes de escrever código, me confirme:**

1. **Domínio** — vamos usar `cyberinformatica.tech` direto? Ou subdomínio tipo `parceiro.cyberinformatica.tech`?
2. **E-mail transacional** — você tem conta no Resend? Se não, me passa um e-mail que eu crio a conta pra você.
3. **Conta GitHub** — você tem? Se sim, qual usuário? Pra eu criar o repo.
4. **Acesso Supabase** — você tem projeto criado ou quer que eu te guie na criação?

**Quando confirmar, eu começo pelo Fase 0 (setup)** e a gente vai fazendo em paralelo.

---

**Versão**: 2.0
**Data**: 11/06/2026
**Stack confirmada**: Supabase + Vercel + GitHub + Next.js 14
**Status**: AGUARDANDO CONFIRMAÇÃO PARA INICIAR FASE 0
