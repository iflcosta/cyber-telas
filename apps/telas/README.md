# Cyber Informática · Landing Page B2B

Landing page para captação qualificada de leads B2B (lojistas e assistências técnicas) para serviço de **remanufatura e laminação OCA industrial de displays**.

🌐 **Produção**: https://telas.cyberinformatica.tech

---

## 🏗️ Stack

- **Next.js 14** (App Router, Server Components)
- **TypeScript** + **Tailwind CSS**
- **Supabase** (Postgres + Auth + RLS)
- **Vercel** (deploy)
- **Resend** (email transacional)

---

## 📁 Estrutura

```
apps/telas/
├── app/
│   ├── layout.tsx              # Root layout com fonts e metadata
│   ├── page.tsx                # Landing page (Server Component)
│   ├── globals.css             # Design system
│   ├── admin/                  # Painel admin (em breve)
│   └── api/                    # API routes (em breve)
├── components/
│   ├── PriceCalculator.tsx     # Calculador de preço (Client)
│   └── QualificationForm.tsx   # Form de cadastro (Client)
├── lib/
│   ├── supabase.ts             # Cliente Supabase + tipos
│   ├── pricing.ts              # Cálculo de preço + marcas
│   └── validators.ts           # CNPJ, email, telefone
├── public/                     # Assets (logos, OG image)
├── .env.example
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Setup Local

### 1. Instalar dependências

```bash
cd apps/telas
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Editar .env.local com suas credenciais do Supabase
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000)

### 4. Build de produção

```bash
npm run build
npm start
```

---

## 🗄️ Schema do Banco

As migrations ficam em `supabase/migrations/`. Para rodar:

### Opção A: SQL Editor (manual)

1. Abra Supabase Dashboard → SQL Editor
2. Cole `supabase/migrations/000_ALL_IN_ONE.sql`
3. Clique RUN

### Opção B: Supabase CLI (automatizado)

```bash
supabase login
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

---

## 🎨 Design System

| Token | Hex | Uso |
|-------|-----|-----|
| `cyber-blue` | `#0066ff` | CTAs, links, destaques |
| `circuit-green` | `#00ff88` | Badges B2B, indicadores |
| `navy-950` | `#050a14` | Backgrounds escuros |
| `navy-900` | `#0a1929` | Backgrounds secundários |
| `cyber-ice` | `#f5f8ff` | Background claro |

Tipografia: **Inter** (body), **Space Grotesk** (display), **JetBrains Mono** (eyebrow).

---

## 📊 Tabela de Preços (5 faixas)

| Faixa | Valor do display | Preço do serviço |
|-------|------------------|-------------------|
| Econômico | até R$ 500 | R$ 80 |
| Intermediário | R$ 500-1000 | R$ 120 |
| Premium | R$ 1000-2000 | R$ 180 |
| Top | R$ 2000-3500 | R$ 250 |
| Flagship | R$ 3500+ | R$ 320 |

Edição via `configuracao_precos` no Supabase (JSON no campo `faixas`).

---

## 🚀 Deploy

### Vercel

1. Conecte o repositório GitHub ao Vercel
2. Configure a **Root Directory** como `apps/telas`
3. Adicione as variáveis de ambiente (`.env.example`)
4. Deploy

### Domínio Customizado

1. Vercel → Settings → Domains → Add `telas.cyberinformatica.tech`
2. Adicione o CNAME no gerenciador DNS:
   - Tipo: `CNAME`
   - Name: `telas`
   - Value: `cname.vercel-dns.com`
3. SSL é automático

---

## ✅ Checklist B2B Compliance

Baseado no **Plano B2B Google_Meta Ads.pdf**:

- [x] Headline com termo "Centro de Remanufatura"
- [x] Subheadline cita "Faturamento Exclusivo via CNPJ"
- [x] Botão NÃO tem link direto de WhatsApp (vai pro form)
- [x] Formulário valida CNPJ com algoritmo oficial
- [x] Bloqueia e-mails gratuitos (gmail, hotmail, etc)
- [x] Valida telefone brasileiro (10-11 dígitos)
- [x] Zero menção a marcas (Apple, Samsung, Motorola, Xiaomi)
- [x] Zero termos B2C (reparo, conserto, troca na hora)
- [x] Linguagem industrial (laminação, OCA, lotes, autoclave)

---

## 🛠️ Próximos Passos

- [ ] Painel admin (`/admin/login`, `/admin/leads`, `/admin/cotacoes`)
- [ ] API endpoints (`/api/cotacoes`, `/api/leads`, `/api/admin/*`)
- [ ] Email de confirmação via Resend
- [ ] Testes E2E com Playwright
- [ ] SEO (sitemap, robots.txt, OG image dinâmica)
- [ ] Sentry para error tracking

---

## 📄 Licença

Proprietary © 2026 Cyber Informática
