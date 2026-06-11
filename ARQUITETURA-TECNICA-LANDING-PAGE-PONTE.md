# DOCUMENTO DE ARQUITETURA TÉCNICA
## Landing Page "Ponte" - B2B Compliance

---

## 1. VISÃO GERAL DO PROJETO

Este documento descreve a arquitetura técnica da Landing Page "Ponte" desenvolvida em total conformidade com as diretrizes do **Plano B2B Google_Meta Ads.pdf**.

### Objetivo Principal
Enquadramento na **Exceção B2B** do Google Ads para evitar suspensões por "Suporte Técnico de Terceiros", posicionando a operação como polo industrial de remanufatura exclusivo para pessoas jurídicas.

---

## 2. ARQUITETURA DE SEÇÕES

### 2.1 Estrutura de Blocos

| # | Seção | ID HTML | Copywriting (exato do PDF) | Função Estratégica |
|---|-------|---------|---------------------------|-------------------|
| 1 | **Header / Hero** | `#hero` | "Centro de Remanufatura e Laminação Industrial de Displays. Exclusivo para Assistências Técnicas e Lojistas de Tecnologia. Faturamento Exclusivo via CNPJ." | Filtro B2B imediato - Googlebots identificam público-alvo |
| 2 | **Credenciais** | `#credentials` | "Unidade de Engenharia de Componentes Eletrônicos S/A. Laboratório equipado com maquinário de atmosfera controlada e laminação OCA sob vácuo." | Prova institucional - detalha natureza empresarial |
| 3 | **Vantagens Comerciais** | `#advantages` | "Redução de custos operacionais com a terceirização de telas originais. Preservação de displays de alta gama com margens de lucro elevadas." | Proposta de valor - dores financeiras do lojista |
| 4 | **Logística B2B** | `#logistics` | "Logística de Lotes: Recebimento e expedição via transportadoras parceiras, Correios corporativo ou serviço de coleta por motoboy autorizado." | Diferencial operacional - caráter fabril |
| 5 | **Formulário de Credenciamento** | `#form-section` | "Portal de Parceria Comercial: Solicite o Catálogo Técnico e a Tabela Atacadista. Cadastro sujeito a verificação cadastral de CNPJ." | Qualificação + conversão - filtro de pessoas físicas |
| 6 | **Rodapé de Compliance** | `#footer` | CNPJ, Razão Social, Endereço Industrial, "Serviço restrito a pessoas jurídicas" | Compliance institucional |

---

## 3. FILTRO SEMÂNTICO E TRAVAS DE CONFORMIDADE

### 3.1 Termos Obrigatórios (Travas B2B)

| Categoria | Termos Permitidos |
|-----------|------------------|
| **Serviço** | Remanufatura de displays, laminação industrial, recondicionamento de componentes, processamento de lotes eletrônicos |
| **Cliente** | Exclusivo para CNPJ, lojistas credenciados, parceiros de manutenção, faturamento corporativo, tabela atacadista |
| **Logística** | Lote mínimo de faturamento, remessa de componentes, coleta logística integrada, contrato de parceria |

### 3.2 Termos Proibidos (Risco B2C)

| Categoria | Termos Bloqueados |
|-----------|-------------------|
| **Serviço** | Reparo de celular, conserto de smartphone, troca de tela na hora, assistência técnica de celular, manutenção de aparelho |
| **Cliente** | Consumidor, cliente final, conserte seu aparelho, preço de conserto, agende seu reparo residencial |
| **Logística** | Traga seu telefone, orçamento grátis na hora, conserto rápido de tela, assistência expressa |

### 3.3 Implementação no Código

```html
<!-- META TAGS - Otimização para Googlebots -->
<meta name="description" content="Centro de Remanufatura e Laminação Industrial de Displays. Exclusivo para Assistências Técnicas e Lojistas de Tecnologia. Faturamento Exclusivo via CNPJ.">

<!-- HEADLINES - Zero termos B2C -->
<h1>Centro de <span>Remanufatura</span> e Laminação Industrial de Displays</h1>

<!-- ALT TEXT - Termos industriais -->
<img alt="Processo de laminação OCA sob vácuo em ambiente controlado">
```

---

## 4. FLUXO TÉCNICO DE CONVERSÃO

### 4.1 Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE CONVERSÃO B2B                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   USER LANDING    │────▶│  CLICK CTA HERO  │────▶│  SCROLL TO FORM   │
│                   │     │  (Sem link direto │     │  (Fricção         │
│   Anúncio Google  │     │   para WhatsApp)  │     │   Qualificadora)  │
└───────────────────┘     └───────────────────┘     └───────────────────┘
                                                            │
                        ┌─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FORMULÁRIO DE QUALIFICAÇÃO                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Razão Social │ │    CNPJ     │ │ E-mail Corp. │              │
│  │  (texto)    │ │  (máscara)   │ │   (regex)   │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Telefone    │ │   Volume    │ │   Termos    │              │
│  │  (máscara)  │ │  (select)   │ │  (checkbox) │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   VALIDAÇÃO JS        │
                    │  ┌─────────────────┐  │
                    │  │ validarCNPJ()   │  │
                    │  │ validarEmail()  │  │
                    │  │ validarTel()    │  │
                    │  │ validarAll()    │  │
                    │  └─────────────────┘  │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
    ┌─────────────────┐                 ┌─────────────────┐
    │   ❌ ERRO       │                 │   ✅ SUCESSO    │
    │  Toast + Erros  │                 │  Evento gtag() │
    │  em campos      │                 │  Evento fbq()   │
    │  não preenchidos│                 │  Estado sucesso  │
    └─────────────────┘                 └────────┬────────┘
                                                │
                                                ▼
                                    ┌─────────────────────────┐
                                    │   BOTÃO WHATSAPP        │
                                    │   (Libera após validação│
                                    │    + conversão disparada│
                                    └─────────────────────────┘
                                                │
                                                ▼
                                    ┌─────────────────────────┐
                                    │   REDIRECT WA.ME        │
                                    │   wa.me/55XXXXXXXXXX    │
                                    └─────────────────────────┘
```

### 4.2 Regras de Validação JavaScript

#### CNPJ (Algoritmo Oficial)
```javascript
function validarCNPJ(cnpj) {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    if (cnpjLimpo.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpjLimpo)) return false;

    // Dígito 1
    let soma = 0, peso = 5;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpjLimpo[i]) * peso;
        peso = peso === 2 ? 9 : peso - 1;
    }
    let digito1 = 11 - (soma % 11);
    digito1 = digito1 >= 10 ? 0 : digito1;
    if (parseInt(cnpjLimpo[12]) !== digito1) return false;

    // Dígito 2
    soma = 0, peso = 6;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpjLimpo[i]) * peso;
        peso = peso === 2 ? 9 : peso - 1;
    }
    let digito2 = 11 - (soma % 11);
    digito2 = digito2 >= 10 ? 0 : digito2;
    if (parseInt(cnpjLimpo[14]) !== digito2) return false;

    return true;
}
```

#### E-mail Corporativo
```javascript
function validarEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email)) return false;

    // Bloqueia e-mails gratuitos
    const emailsGratuitos = ['gmail.com', 'yahoo.com', 'hotmail.com'];
    const dominio = email.split('@')[1]?.toLowerCase();
    return !emailsGratuitos.includes(dominio);
}
```

#### Telefone Brasileiro
```javascript
function validarTelefone(telefone) {
    const limpo = telefone.replace(/[^\d]/g, '');
    return limpo.length >= 10 && limpo.length <= 11;
}
```

### 4.3 Máscaras de Input

| Campo | Máscara | Exemplo |
|-------|---------|---------|
| **CNPJ** | `##.###.###/####-##` | `12.345.678/0001-90` |
| **Telefone** | `(##) #####-####` | `(11) 99999-8888` |

---

## 5. EVENTOS DE CONVERSÃO

### 5.1 Google Ads (gtag.js)
```javascript
// Após validação completa do formulário
gtag('event', 'generate_lead', {
    currency: 'BRL',
    value: 1
});
```

### 5.2 Meta Pixel (fbq)
```javascript
// Após validação completa do formulário
fbq('track', 'Lead', {
    content_name: 'Formulário de Credenciamento B2B',
    content_category: 'B2B Qualification'
});
```

### 5.3 WhatsApp Click
```javascript
// Após clique no botão WhatsApp (pós-validação)
gtag('event', 'whatsapp_click', {
    event_category: 'conversion',
    event_label: 'B2B Qualification'
});
```

---

## 6. DESIGN SYSTEM

### 6.1 Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `--cor-primaria` | `#1a1f2e` | Header, footer, backgrounds |
| `--cor-secundaria` | `#2d3748` | Textos secundários |
| `--cor-acento` | `#3182ce` | CTAs, destaques, links |
| `--cor-sucesso` | `#2f855a` | Badges B2B, indicadores |
| `--cor-fundo` | `#f7fafc` | Background principal |
| `--cor-texto` | `#1a202c` | Textos principais |
| `--cor-borda` | `#e2e8f0` | Bordas, separadores |

### 6.2 Tipografia

| Elemento | Fonte | Peso | Tamanho |
|----------|-------|------|---------|
| H1 | Inter | 800 | 2.75rem (clamp) |
| H2 | Inter | 700 | 2rem (clamp) |
| H3 | Inter | 700 | 1.125rem |
| Body | Inter | 400 | 1rem |
| Caption | Inter | 500 | 0.875rem |

### 6.3 Breakpoints

| Dispositivo | Largura |
|-------------|---------|
| Mobile | < 768px |
| Tablet | 768px - 1024px |
| Desktop | > 1024px |

---

## 7. SEMÂNTICA HTML (SEO / Googlebots)

### 7.1 Estrutura Semântica

```html
<header class="hero">           <!-- Hero Section -->
    <h1>...</h1>                <!-- Título principal (H1 único) -->
</header>

<section id="credentials">      <!-- Quem Somos -->
    <h2>...</h2>               <!-- H2 por seção -->
    <article class="card">     <!-- Cards semânticos -->
</section>

<section id="advantages">      <!-- Vantagens -->
    <h2>...</h2>
    <ul>                        <!-- Lista semântica -->
        <li>...</li>
    </ul>
</section>

<section id="logistics">        <!-- Logística -->
    <h2>...</h2>
    <div class="flow">         <!-- Fluxo visual -->
</section>

<section id="form-section">    <!-- Formulário -->
    <form id="qualification-form">
        <label for="razao-social">...</label>
        <input id="razao-social" type="text">
    </form>
</section>

<footer class="footer">        <!-- Compliance -->
    <address>...</address>     <!-- Endereço semântico -->
</footer>
```

### 7.2 Meta Tags para SEO

```html
<meta name="description" content="Centro de Remanufatura e Laminação Industrial de Displays. Exclusivo para Assistências Técnicas e Lojistas de Tecnologia. Faturamento Exclusivo via CNPJ.">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Centro de Remanufatura e Laminação Industrial de Displays - B2B">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
```

---

## 8. EVITAR "DESTINO NÃO CORRESPONDENTE"

### 8.1 Regra Fundamental do PDF
> "O botão principal **NÃO** deve conter link direto de WhatsApp. Ele deve rolar a página até o Formulário Avançado de Qualificação."

### 8.2 Implementação

```javascript
// ❌ ERRADO - Link direto (causa reprovação)
<a href="https://wa.me/5511999999999">WhatsApp</a>

// ✅ CORRETO - Scroll até formulário
<button id="cta-button">
    Solicitar Credenciamento
</button>

document.getElementById('cta-button').addEventListener('click', function() {
    document.getElementById('form-section').scrollIntoView({
        behavior: 'smooth'
    });
});
```

### 8.3 Redirecionamento Pós-Validação

```javascript
// ✅ CORRETO - Somente após validação completa
form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (validarFormulario()) {
        // 1. Dispara conversão
        gtag('event', 'generate_lead', {...});

        // 2. Mostra estado de sucesso
        formBody.classList.add('hidden');
        successState.classList.remove('hidden');

        // 3. Botão WhatsApp libera APÓS sucesso
        whatsappButton.addEventListener('click', function() {
            window.open('https://wa.me/5511999999999', '_blank');
        });
    }
});
```

---

## 9. CHECKLIST DE CONFORMIDADE

### 9.1 Seções da Página
- [x] Header com copywriting B2B exato
- [x] Credenciais com "Unidade de Engenharia..."
- [x] Vantagens Comerciais com foco em margens
- [x] Logística B2B com fluxo de lotes
- [x] Formulário de Credenciamento
- [x] Rodapé de Compliance com CNPJ

### 9.2 Termos Permitidos
- [x] Remanufatura de displays
- [x] Laminação industrial
- [x] Recondicionamento de componentes
- [x] Processamento de lotes eletrônicos

### 9.3 Termos Bloqueados
- [x] Nenhum termo B2C nos textos
- [x] Zero "reparo", "conserto", "troca na hora"
- [x] Zero "cliente final", "consumidor"

### 9.4 Fluxo de Conversão
- [x] CTA Hero scrolla para formulário
- [x] Sem link direto WhatsApp no topo
- [x] Validação CNPJ com algoritmo oficial
- [x] Máscaras de input aplicadas
- [x] Redirecionamento pós-validação
- [x] Eventos de conversão disparados

### 9.5 SEO / Googlebots
- [x] HTML semântico (header, section, article, footer)
- [x] Meta description otimizada
- [x] Open Graph tags
- [x] H1 único com keywords B2B
- [x] Alt texts em imagens

---

## 10. PRÓXIMOS PASSOS

1. **Integração Analytics**: Adicionar gtag.js real com ID da propriedade
2. **Meta Pixel**: Implementar fbq() com Pixel ID correto
3. **API de Formulário**: Conectar formulário a CRM/Banco de dados
4. **CNPJ Real**: Substituir placeholder no footer
5. **WhatsApp Real**: Configurar número do WhatsApp Business

---

**Versão do Documento**: 1.0
**Data**: 10/06/2026
**Baseado em**: Plano B2B Google_Meta Ads.pdf