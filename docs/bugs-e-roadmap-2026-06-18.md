# Bugs e melhorias — Cyber Telas (backlog)

Bugs e melhorias identificados durante o smoke test de 18/06/2026, depois do fix do `validarCNPJ` off-by-one.

---

## 🐛 BUG-1: ValidarCNPJ rejeitava 100% dos CNPJs válidos
**Status:** ✅ Corrigido em commit `b77fec6` (18/06/2026)

**Causa:** off-by-one em `apps/telas/lib/validators.ts:33` — usava `cnpjLimpo[14]` (sempre `undefined`) em vez de `cnpjLimpo[13]`. Toda a tabela `leads` ficou vazia desde o deploy inicial.

**Fix aplicado:** 1 caractere (`[14]` → `[13]`) + comentário explicativo. +32 testes Jest cobrindo regressão.

**Por que ninguém percebeu antes:** smoke test do commit original ficou só na leitura do código, nunca chegou a submeter o form de verdade.

---

## 🐛 BUG-2: Form permite marca/modelo/valor inconsistentes entre si
**Severidade:** 🟡 Baixa (UX, não bloqueia)

**Comportamento atual:** O usuário pode selecionar marca "Samsung", digitar modelo livre "iPhone 15 Pro Max" e valor "1500" sem validação cruzada. O lead entra no Supabase com essa combinação.

**Exemplo real** (do smoke test 18/06/2026, lead `cfccbfea-79a0-4b33-aaae-190adc38d47c`):
- `marca = "samsung"` (selecionado de fato)
- `modelo_display = "iPhone 15 Pro Max"` (digitado manual — pode ter sido erro de digitação no teste)
- `valor_display_novo = 1500.00` (digitado manual, é o que vale)
- `preco_servico = 180.00` (calculado corretamente sobre o valor 1500)

**Atualização após re-análise:** Não é um bug real. O form aceita valor custom sem modelo, e aceita modelo sem auto-fill do valor — é feature, não defeito. Lead real vai ou usar o datalist (modelo bate com marca) ou digitar valor custom sem se preocupar com modelo. O "problema" do exemplo é sujeira de teste, não pattern de uso real.

**Recomendação:** manter como está. Se vir muito lead "esquisito" no Supabase daqui pra frente, a gente adiciona validação de marca↔modelo (procurar o modelo no array `modelosPorMarca[form.marca]` e alertar se não achar). Por ora, não vale a pena.

**Esforço se for fazer:** 30 min de código + 5 testes.

---

## 🐛 BUG-3: Dropdown de Volume Semanal mostra opção selecionada duplicada
**Severidade:** 🟡 Baixa (cosmético)

**Comportamento atual:** Ao abrir o dropdown de "Volume Médio de Telas Semanais", o primeiro option "Selecione uma faixa" aparece com opacidade baixa junto com o option selecionado "1 a 10 telas por semana". Visual estranho, parece bug.

**Causa provável:** `value=""` no state inicial conflita com a primeira `<option value="">` que tem `:disabled` aplicado via CSS. O browser renderiza os dois.

**Solução:** mudar o CSS do select option ou usar `value="placeholder"` com string diferente.

**Esforço:** 15 min de CSS/tweak.

---

## 🐛 BUG-4: Máscaras CNPJ/telefone pulavam formatação em 6/9/13/14 dígitos
**Status:** ✅ Corrigido em commit `b77fec6` (18/06/2026)

**Causa:** regex com tamanho exato + `>` em vez de `>=` faziam as máscaras pularem aplicação em vários pontos da digitação.

**Fix aplicado:** regex flexíveis com `{0,N}` + formatação condicional. +6 testes Jest.

---

## 🐛 BUG-5: Tabela `cotacoes` anônimas nunca é populada
**Severidade:** 🟡 Média (feature não implementada)

**Comportamento atual:** Quando o usuário usa o `PriceCalculator` (cotação rápida acima do form), os valores cotados são calculados mas **não são salvos** em lugar nenhum. Só quando o usuário preenche o form inteiro é que vira um `lead`. Cotações anônimas (sem cadastro) se perdem.

**Causa:** o `PriceCalculator.tsx` só chama `calcularPreco` (client-side, em memória) e mostra na tela. Não tem `supabase.from('cotacoes').insert(...)` em lugar nenhum.

**Impacto:** tabela `cotacoes` (que tem RLS permitindo insert anônimo) existe e está vazia. Não tem dados de "quantas pessoas cotaram mas não cadastraram", que seria métrica útil pra entender conversão.

**Solução:** adicionar 1 `useEffect` no `PriceCalculator` que faz insert anônimo em `cotacoes` quando uma cotação é exibida na tela pela primeira vez (debounce pra não poluir).

**Esforço:** 20 min.

---

## 📋 Próximas features (roadmap, em ordem de prioridade)

### F1: Painel admin `/admin/leads` 🔴 **PRIORIDADE MÁXIMA**
Sem isso, você só vê leads indo pro Supabase indo no dashboard manualmente. A primeira feature que entrega valor operacional.

- `/admin/login` (Supabase Auth)
- `/admin/leads` (lista + filtros)
- `/admin/leads/[id]` (detalhe + mudar status + observações)

### F2: Email de confirmação (Resend) 🟡
Fecha o ciclo de credenciamento. Lead preenche form → recebe email automático "Recebemos seu cadastro, analise em até 24h".

### F3: Google Ads / Meta Ads setup 🟡
Tração. Sem anúncio, a landing não gera lead nenhum organicamente.

### F4: SEO técnico (sitemap, robots, OG dinâmica) 🟢
Cumulativo. Cada deploy ajuda.

### F5: Sentry error tracking 🟢
Depois que começar a ter tráfego real, pra pegar erros que ninguém reportou.

### F6: Migração Supabase `us-west-2` → `sa-east-1` (São Paulo) 🟢
Latência menor. Não urgente, mas o setup-guide original recomendava SP.

---

## 🔑 Ações pendentes pra você (Iago)

1. **Revogar os 5 tokens criados** depois que a gente fechar a sessão (Supabase PAT, Vercel token; as 2 keys do app podem ficar se quiser rodar local). Links:
   - https://app.supabase.com/account/tokens
   - https://vercel.com/account/tokens
2. **Decidir próximo passo do roadmap** (F1 admin é minha recomendação, F2 Resend se quiser auto-reply rápido).
3. **Limpar o lead de teste** que entrou (`cfccbfea-79a0-4b33-aaae-190adc38d47c`).
