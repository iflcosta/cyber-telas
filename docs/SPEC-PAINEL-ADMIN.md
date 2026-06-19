# SPEC — Painel Admin Cyber Telas
## Sessão de 18/06/2026 (paralisada pra retomada em 19/06/2026)

**Status:** Planejado, NÃO iniciado. Pronto pra codar quando você voltar.
**Autor:** Mavis (sessão `mvs_b6d9ab7e0b3141b8a616ec939e08cc5f`)
**Repositório:** `C:\laminacao\cyber-telas` (branch `master`, commit atual `b77fec6`)

---

## 🎯 Objetivo

Construir o painel admin mínimo viável pra você ver e gerenciar os leads que chegam pelo formulário de `telas.cyberinformatica.tech`. Sem ele, leads só aparecem indo direto no Supabase Table Editor.

## ✅ O que o app já tem (não precisa criar)

- `auth.users` no Supabase (Auth pronto)
- Função SQL `public.make_admin(email)` que promove usuário a `admin` (coloca `role: 'admin'` em `auth.users.raw_user_meta_data`)
- RLS em todas as 4 tabelas — só `admin` lê/atualiza `leads`, `cotacoes`
- `public.leads.status` aceita: `'novo' | 'contatado' | 'qualificado' | 'cliente' | 'recusado'`
- `createServerSupabaseClient()` em `apps/telas/lib/supabase-server.ts` — usa cookies do Next, pronto pra Server Components
- Design system completo (Cyber Blue + Circuit Green, dark mode, fontes Inter/Space Grotesk/JetBrains Mono via `next/font`)

## 📦 Escopo (mínimo viável — F1 do roadmap)

### Rotas a criar

| Rota | Tipo | Função |
|---|---|---|
| `/admin` | Server (RSC) | Redirect: se logado → `/admin/leads`, senão → `/admin/login` |
| `/admin/login` | Server (RSC) + form Client | Form email+senha, usa Supabase Auth `signInWithPassword` |
| `/admin/logout` | API (POST) | Limpa sessão via Supabase `signOut` |
| `/admin/leads` | Server (RSC) | Lista leads com filtros (status, marca, busca por razão social/CNPJ) + paginação |
| `/admin/leads/[id]` | Server (RSC) + form Client | Detalhe: razão social, CNPJ, contato, modelo, valor, faixa + dropdown de status + textarea de observações |
| `/api/admin/leads/[id]` | API Route | `PATCH` status/observações, `GET` refresh |

### Arquivos a criar/editar

```
apps/telas/
├── middleware.ts                                    NOVO — protege /admin/* (Edge runtime)
├── app/
│   └── admin/
│       ├── layout.tsx                               NOVO — header admin + user info + logout
│       ├── page.tsx                                 NOVO — redirect logic
│       ├── login/
│       │   ├── page.tsx                             NOVO — form (Client Component)
│       │   └── actions.ts                           NOVO — server actions login/logout
│       └── leads/
│           ├── page.tsx                             NOVO — listagem (Server Component com query params)
│           ├── leads-table.tsx                      NOVO — componente tabela (Server Component)
│           ├── status-badge.tsx                     NOVO — badge colorido por status
│           ├── leads-filters.tsx                    NOVO — barra de filtros (Client)
│           └── [id]/
│               ├── page.tsx                         NOVO — detalhe (Server Component)
│               └── actions.ts                       NOVO — server actions update status/obs
└── lib/
    ├── admin-helpers.ts                             NOVO — funções auxiliares (formatCNPJ, formatTelefone, formatBRL, formatDate)
    └── __tests__/
        ├── admin-helpers.test.ts                    NOVO — ~8 testes
        └── admin-routes.test.ts                     OPCIONAL — testes E2E de API (depende de tempo)
```

### Comportamentos críticos

1. **Middleware** (`middleware.ts`):
   - Se acessar `/admin/*` (exceto `/admin/login`):
     - Sem cookie de sessão Supabase → redirect `/admin/login?redirect=<original>`
     - Com cookie mas role != admin → redirect `/admin/login?error=not_admin`
   - Se acessar `/admin/login` já logado → redirect `/admin/leads`

2. **Login**:
   - `signInWithPassword` com email/senha
   - Em sucesso, seta cookies automaticamente (via `createServerSupabaseClient`)
   - Redireciona pra `?redirect=` (default `/admin/leads`)
   - Erro: mostra inline "Email ou senha inválidos"

3. **Listagem `/admin/leads`**:
   - Query params: `?status=novo&marca=apple&q=cyber&page=1`
   - `page` size = 20
   - Colunas: Data | Razão Social | CNPJ | Marca | Modelo | Valor | Faixa | Status | Ações
   - Status como `<StatusBadge>` colorido
   - Ações: link "Ver" → `/admin/leads/[id]`
   - Empty state: "Nenhum lead com esses filtros"

4. **Detalhe `/admin/leads/[id]`**:
   - Card 1: Dados do lead (read-only)
   - Card 2: Status (dropdown) + Observações (textarea) + Botão "Salvar" (Server Action)
   - Em sucesso: redirect com toast "Atualizado"
   - Em erro: mensagem inline

5. **Status disponíveis** (do `CHECK` constraint do schema):
   - `novo` (verde) | `contatado` (amarelo) | `qualificado` (azul) | `cliente` (roxo) | `recusado` (vermelho)

## 🎨 Decisões de design a confirmar com o usuário

**Decisão 1 — Email do admin (NÃO RESPONDIDA):**
- 🅰️ `contato@cyberinformatica.tech` (oficial, dos commits)
- 🅱️ `iflcosta@outlook.com` (pessoal, já loga no Supabase)
- 🅲 Outro

**Recomendação Mavis:** 🅰️ (oficial, melhor pra auditoria no futuro). Mas se for 🅱️, fluxo é mais rápido porque a conta já existe.

**Decisão 2 — Visual (NÃO RESPONDIDA):**
- 🅰️ Mesmo design da landing (Cyber Blue + Circuit Green, dark)
- 🅱️ Visual mais sóbrio (cinza/branco, tipo Metabase/Stripe Dashboard)

**Recomendação Mavis:** 🅰️ (velocidade > estética, único user). Migrar pra 🅱️ quando tiver mais gente usando.

## 🔄 Passo-a-passo pra retomar amanhã

### Antes de começar a codar

1. **Responder as 2 decisões pendentes** acima (email do admin + visual)
2. **Limpar o lead de teste** no Supabase Table Editor (`cfccbfea-79a0-4b33-aaae-190adc38d47c`)
3. (Opcional) **Revogar os tokens** que eu usei hoje:
   - https://app.supabase.com/account/tokens (revoga `mavis-cyber-telas`)
   - https://vercel.com/account/tokens (revoga `mavis-cyber-telas`)

### Quando retomar

1. Abrir sessão nova e me passar:
   - Email escolhido como admin
   - Senha desejada (ou pedir pra eu gerar uma forte)
   - Confirmação do visual
2. Eu executo nessa ordem:
   1. **Criar conta admin** no Supabase Auth (via API ou SQL)
   2. **Rodar `make_admin(email)`** pra promover
   3. **Criar `middleware.ts`** + `app/admin/layout.tsx` + `app/admin/page.tsx` (esqueleto)
   4. **Criar `/admin/login`** com form + server action
   5. **Validar login** no browser antes de seguir
   6. **Criar `/admin/leads`** (listagem)
   7. **Criar `/admin/leads/[id]`** (detalhe)
   8. **Criar `/api/admin/leads/[id]`** (API update)
   9. **Testes** (admin-helpers.test.ts)
   10. **Commit + push + Vercel deploy**
   11. **Smoke test** do fluxo completo em prod
3. Reportar a cada passo (não rodar tudo de uma vez sem você ver)

## 📋 Checklist operacional (todos pendentes)

```
- [ ] 1.  Definir escopo do painel admin
- [ ] 2.  Confirmar abordagem de auth (Supabase Auth + RLS existente)
- [ ] 3.  Mapear arquivos a criar/editar
- [ ] 4.  Aplicar migrations/seed (promover primeiro admin)
- [ ] 5.  Criar /admin/login (Supabase Auth UI)
- [ ] 6.  Criar /admin/leads (listagem + filtros)
- [ ] 7.  Criar /admin/leads/[id] (detalhe + mudar status + observacoes)
- [ ] 8.  Criar /api/admin/leads/[id] (API update)
- [ ] 9.  Testes do admin
- [ ] 10. Smoke test em prod
- [ ] 11. Commit + push + deploy Vercel
```

## 🔗 Referências cruzadas

- **Bugs identificados hoje:** ver `docs/bugs-e-roadmap-2026-06-18.md` (5 bugs, 2 críticos corrigidos)
- **Análise inicial do projeto:** esta sessão, primeiras mensagens
- **Estado do Supabase:** projeto `cyber-laminacao` (ref `tjsgqpfbkrsidkkdyqmb`), região `us-west-2`, 4 tabelas (leads, cotacoes, modelos_preco, configuracao_precos), 0 Edge Functions, 0 secrets
- **Estado do Vercel:** projeto `cyber-telas` (id `prj_LNOkt5XsqgMAYMUDYPHvG8a88iNc`), domínio `telas.cyberinformatica.tech` verificado, 3 env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- **Último commit:** `b77fec6` — fix(validators): corrigir validarCNPJ off-by-one + 5 bugs em masks
- **Último deploy Vercel:** uid `dpl_DW4BfM6gv6uPX6E9RviJaM3hu4Y8`, READY em 56s

## ⏱️ Estimativa de execução (amanhã)

- Codar tudo: 1-1.5h
- Testes: 20-30min
- Deploy + smoke test: 10min
- **Total: 1.5-2h**

---

**Boa noite, Iago. Quando voltar, é só abrir sessão e dizer "bora pro painel admin" (ou referenciar este SPEC.md). Eu pego de onde paramos.**
