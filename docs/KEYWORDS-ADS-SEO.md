# Keywords — Cyber Telas (Google Ads + Orgânico)

**Data:** 26/06/2026
**Estratégia:** dual-persona. Google Ads é 100% B2B (compliance). Orgânico/SEO aceita mix B2B + B2C-welcome. O site recebe ambos via caminhos separados (credenciamento CNPJ vs. WhatsApp pessoa física).

---

## 1. Google Ads — apenas B2B-safe

Google Ads barra campanha B2C de suporte técnico. Termos como "conserto", "reparo", "manutenção preventiva", "diagnóstico", "formatação", "recuperação de dados" são bloqueados na revisão.

### Bloco A — Intenção direta (quem já sabe o que é laminação OCA)
```
laminação oca
laminação oca sp
laminação oca são paulo
laminação oca industrial
laminação oca a vácuo
laminação oca em escala
laminação oca em lote
laminação oca para iphone
laminação oca para samsung
laminação display celular
laminação display smartphone
laminação tela celular
laminação tela smartphone
remanufatura de display
remanufatura de tela
remanufatura display celular
```

### Bloco B — Intenção comercial (quem busca fornecedor/prestador)
```
fornecedor laminação oca
prestador laminação oca
terceirizar laminação oca
centro de laminação oca
centro de remanufatura display
serviço industrial laminação display
laminação oca para assistência técnica
laminação oca para lojista
laminação oca para lojista de tecnologia
laminação oca atacado
```

### Bloco C — Geográfica SP capital + ABC + Guarulhos
```
laminação oca sp zona sul
laminação oca abc
laminação oca guarulhos
laminação oca osasco
laminação oca industrial são paulo
laminação oca grande são paulo
```

### Bloco D — Por modelo de aparelho (apenas marca genérica, sem "conserto")
```
laminação display iphone 15
laminação display iphone 14
laminação display galaxy s24
laminação display galaxy s23
laminação display xiaomi
laminação display motorola
laminação display tablet
```

### Bloco E — Industrial/técnico
```
processamento de lotes de telas
sala limpa laminação oca
laminação oca profissional
laminação oca em lote sp
laminação display atacado
```

**Total: ~45 keywords B2B-safe.**

### Termos PROIBIDOS (não adicionar)
| Termo | Motivo |
|---|---|
| conserto tela celular | Google Ads barra B2C |
| reparo display | Google Ads barra B2C |
| manutenção preventiva display | Keyword barrada |
| diagnóstico display | Keyword barrada |
| troca de tela | B2C-focused, baixa conversão B2B |
| assistência técnica sozinho | Ambíguo (consumidor vs B2B) |
| formatação celular | Keyword barrada |
| limpeza interna | Keyword barrada |

---

## 2. SEO orgânico — B2B + B2C-welcome

Site aceita tráfego orgânico de ambos os perfis. Sem restrição de Ads. Pode usar termos B2C que direcionam pro WhatsApp (não pro form de credenciamento).

### Termos B2C-compatíveis (vão pro WhatsApp)
```
tela quebrada celular
display trincado
vidro trincado iphone
vidro trincado samsung
vidro trincado xiaomi
tela celular valor
laminação oca quanto custa
laminação oca preço pessoa física
remanufatura vale a pena
laminação oca segura
```

**Roteamento:**
- B2B-SEO → aterrissa em qualquer âncora → CTA "Solicitar Credenciamento" (#form-section)
- B2C-SEO → aterrissa em qualquer âncora → CTA "Sou pessoa física" (WhatsApp)

A página já tem as duas CTAs no hero (commit `0695fd9`). Não precisa de landing pages separadas.

---

## 3. Locais e orçamento Google Ads

**Locais sugeridos:** São Paulo capital + ABC + Guarulhos + Osasco + Mairiporã + Suzano.

**Por que NÃO Brasil inteiro agora:**
- CPC local ~70% menor
- Volume de busca qualificado alto (operação aqui)
- Tempo de resposta mesmo dia
- Custo de teste ~R$ 30-50/dia

**Quando expandir:** após 15-30 leads locais validados, expandir pra SP (estado) → Sudeste → Brasil.

**Idioma:** Português (Brasil).

---

## 4. Compliance de copy (Google Ads)

### ✅ Permitido (B2B-friendly)
- "Consultoria técnica"
- "Suporte ao parceiro"
- "Credenciamento"
- "Curadoria técnica"
- "Atendimento técnico"
- "Indicação técnica"
- "Pós-venda estendido"
- "Laminação OCA industrial"
- "Sala limpa controlada"

### ❌ Barrado (B2C-support)
- "Manutenção"
- "Conserto"
- "Reparo"
- "Suporte técnico" (consumer-facing)
- "Diagnóstico"
- "Formatação (serviço)"
- "Recuperação de dados"
- "Limpeza interna"

---

## 5. Próximos passos

1. Colar 45 keywords no Google Ads (Bloco A → E)
2. Confirmar locais SP capital + metro
3. Configurar orçamento diário inicial (~R$ 30-50)
4. Configurar conversão: pageview #form-section ou clique no botão WhatsApp
5. Quando tiver IDs de Pixel Meta + GA4, plugar (já existe infra: `lib/consent.ts` + `<head>` consent default denied)