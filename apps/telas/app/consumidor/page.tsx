import type { Metadata } from 'next';
import Link from 'next/link';
import CatalogSection from '@/components/CatalogSection';
import ScrollReveal from '@/components/ScrollReveal';
import TrackedWhatsAppLink from '@/components/TrackedWhatsAppLink';

// ============================================================
// Landing B2C — destino do tráfego pago de consumidor final.
// Foco único: dono do celular que quebrou o vidro e quer manter
// o display original. CTA primário = WhatsApp (sem formulário CNPJ).
// A página industrial B2B (/) segue intacta para o funil de lojista.
// ============================================================

const WHATSAPP_PHONE = '5511954369269';
const SITE_URL = 'https://telas.cyberinformatica.tech';

const TITLE = 'Troca de Vidro de Tela — Salve seu Display Original | Cyber Informática';
const DESCRIPTION =
  'Quebrou o vidro do seu iPhone ou Galaxy? Trocamos só o vidro externo e preservamos seu display original de fábrica — cores, toque e biometria. 90 dias de garantia.';

export const revalidate = 300;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'troca de vidro de tela',
    'trocar só o vidro da tela',
    'laminação OCA',
    'recuperar display original quebrado',
    'conserto de vidro iphone mantendo tela original',
    'troca de vidro galaxy s',
    'display original preservado',
  ],
  alternates: { canonical: '/consumidor' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/consumidor',
    siteName: 'Cyber Informática',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'A tela continua sendo a original do meu celular?',
    a: 'Sim. Na laminação nós trocamos apenas o vidro externo que quebrou. O display OLED/AMOLED — a parte que mostra a imagem, responde ao toque e lê a sua digital — continua sendo o mesmo de fábrica. Não é tela nova nem paralela.',
  },
  {
    q: 'Vou perder qualidade de imagem, toque ou biometria?',
    a: 'Não. Justamente por manter o display original, as cores, o brilho, o toque e a leitura de digital na tela (e o Face ID, no iPhone) continuam funcionando 100%. Quem coloca tela paralela é que costuma perder essas funções.',
  },
  {
    q: 'Quanto eu economizo em relação a uma tela nova?',
    a: 'Como você paga pela recuperação do vidro e não por um display novo inteiro, o valor fica muito abaixo do orçamento de troca completa em assistência. Selecione seu modelo acima para ver a estimativa e confirme o valor exato no WhatsApp.',
  },
  {
    q: 'Tem garantia?',
    a: 'Sim, 90 dias de garantia sobre o serviço de laminação que realizamos. Se o toque falhar ou a imagem apresentar defeito ligado ao nosso serviço nesse período, a responsabilidade é nossa.',
  },
  {
    q: 'Vocês são autorizada Apple ou Samsung?',
    a: 'Não. Somos um laboratório independente de recuperação de displays. Não representamos os fabricantes e não administramos as garantias oficiais de fábrica. As marcas são citadas apenas para identificar os modelos que atendemos.',
  },
];

export default function ConsumidorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Laminação OCA / Troca de vidro de display',
        serviceType: 'Recuperação de display de celular',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Cyber Informática',
          url: `${SITE_URL}/consumidor`,
        },
        areaServed: 'BR',
        description: DESCRIPTION,
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ConsumerHeader />
      <Hero />
      <WhatIsLamination />
      <ParallelObjection />
      <HowItWorks />
      <CatalogSection />
      <About />
      <Faq />
      <FinalCta />
      <ConsumerFooter />

      {/* WhatsApp flutuante — só mobile */}
      <TrackedWhatsAppLink
        phone={WHATSAPP_PHONE}
        message="Olá! Vim do site e quero cotar a laminação OCA (troca de vidro) do meu aparelho, mantendo o display original."
        source="consumidor_floating"
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-4 right-4 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-circuit-green text-navy-950 shadow-[0_6px_20px_rgba(0,255,136,0.45)] hover:brightness-95 transition"
        ariaLabel="Falar no WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.24-8.23 8.24z"/>
        </svg>
      </TrackedWhatsAppLink>
    </>
  );
}

// ============================================================
// Header enxuto — logo + WhatsApp (sem nav B2B; menos distração
// = mais conversão numa landing de tráfego pago).
// ============================================================
function ConsumerHeader() {
  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-blue to-circuit-green opacity-60" />
      <div className="container">
        <div className="flex items-center justify-between py-4 gap-4">
          <Link href="/" className="flex items-center flex-shrink-0" aria-label="Cyber Informática — página inicial">
            <img src="/logo-horizontal-header.png" alt="Cyber Informática" className="h-11 sm:h-14 w-auto" />
          </Link>
          <TrackedWhatsAppLink
            phone={WHATSAPP_PHONE}
            message="Olá! Vim do site e quero cotar a laminação OCA (troca de vidro) do meu aparelho."
            source="consumidor_header"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-circuit-green text-navy-950 text-sm font-bold rounded-full hover:brightness-95 transition-all whitespace-nowrap"
            ariaLabel="Chamar no WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2z"/>
            </svg>
            <span className="hidden sm:inline">Cotar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </TrackedWhatsAppLink>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// Hero — CTA primário = WhatsApp
// ============================================================
function Hero() {
  return (
    <section className="relative bg-navy-950 text-white pt-16 pb-16 sm:pt-20 sm:pb-20 overflow-hidden isolate">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] max-w-full bg-cyber-blue rounded-full opacity-30 blur-[80px] -z-10 animate-float-orb" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] max-w-full bg-circuit-green rounded-full opacity-20 blur-[80px] -z-10 animate-float-orb" style={{ animationDirection: 'reverse' }} />

      <div className="container relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-circuit-green/10 border border-circuit-green/30 text-circuit-green font-mono text-[11px] font-medium tracking-widest uppercase backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-circuit-green opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-circuit-green" />
            </span>
            Laminação OCA · Display original preservado
          </div>

          <h1 className="text-display text-balance text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-tight tracking-tight mb-6">
            Quebrou o vidro do seu iPhone ou Galaxy?{' '}
            <span className="gradient-text">A gente salva o seu display original.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
            Trocamos <strong className="text-white">apenas o vidro externo</strong> que quebrou e preservamos
            o seu display de fábrica. Não é tela nova, não é paralela: é a{' '}
            <strong className="text-circuit-green">sua tela original</strong>, com o vidro novo por cima —
            mantendo cores, toque e biometria.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
            <TrackedWhatsAppLink
              phone={WHATSAPP_PHONE}
              message="Olá! Vim do site e quero cotar a laminação OCA (troca de vidro) do meu aparelho, mantendo o display original."
              source="consumidor_hero"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-circuit-green text-navy-950 font-bold rounded-lg hover:brightness-95 transition-all shadow-[0_8px_28px_-4px_rgba(0,255,136,0.45)] text-base"
              ariaLabel="Pedir orçamento no WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2z"/>
              </svg>
              Pedir orçamento no WhatsApp
            </TrackedWhatsAppLink>
            <a
              href="#cotacao"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/15 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-circuit-green transition-all text-base"
            >
              Ver quanto custa pro meu modelo
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08]">
            {[
              { label: 'Digital na tela', sub: 'funciona 100%' },
              { label: 'Cores originais', sub: 'de fábrica' },
              { label: 'Toque idêntico', sub: 'sem falhas' },
              { label: 'Garantia', sub: '90 dias' },
            ].map((b) => (
              <div key={b.label}>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold leading-tight">{b.label}</div>
                <div className="text-sm font-bold text-white leading-tight">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// O que é laminação (tradução do termo técnico)
// ============================================================
function WhatIsLamination() {
  const cards = [
    {
      title: 'Não é tela nova',
      desc: 'Você não paga por um display inteiro. A parte cara — a tela — você já tem, e nós preservamos.',
    },
    {
      title: 'Não é paralela',
      desc: 'Nada de peça genérica de qualidade duvidosa. O seu display OLED/AMOLED de fábrica continua no aparelho.',
    },
    {
      title: 'É a SUA tela salva',
      desc: 'Removemos só o vidro externo quebrado e laminamos um vidro novo sobre o display original. Simples assim.',
    },
  ];
  return (
    <section className="section bg-white">
      <div className="container">
        <ScrollReveal className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">O que é laminação</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 leading-tight mb-4 text-balance">
            Entenda em 10 segundos por que o seu display continua original
          </h2>
          <p className="section-description text-lg text-gray-600">
            Laminação é a troca apenas do vidro externo. O display — imagem, toque e biometria — permanece
            o mesmo que veio de fábrica no seu aparelho.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {cards.map((c, i) => (
            <ScrollReveal
              key={c.title}
              delay={(i % 3) as 0 | 1 | 2}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
            >
              <h3 className="text-display text-xl font-semibold text-navy-900 mb-2 tracking-tight">{c.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Objeção: tela paralela vs. original recondicionada
// ============================================================
function ParallelObjection() {
  const parallel = [
    'Cores desbotadas e brilho fraco no sol',
    'Toque que falha ou digita sozinho (touch fantasma)',
    'Digital na tela e Face ID param de funcionar',
    'Desvaloriza o aparelho na revenda',
  ];
  const original = [
    'Cores e brilho idênticos aos de fábrica',
    'Toque original, preciso e sem fantasma',
    'Biometria na tela funcionando 100%',
    'Mantém o valor do seu aparelho',
  ];
  return (
    <section className="section bg-navy-950 text-white relative overflow-hidden">
      <div className="container relative">
        <ScrollReveal className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Paralela vs. original</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4 text-balance">
            O medo de perder qualidade tem nome: tela paralela
          </h2>
          <p className="section-description text-lg text-gray-300">
            Quem troca por paralela é que perde qualidade. Recondicionar a original é o único jeito de
            gastar menos sem piorar o aparelho.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <ScrollReveal className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-6">
            <h3 className="text-display text-lg font-semibold mb-4 text-red-300">❌ Tela paralela (barata)</h3>
            <ul className="space-y-2.5">
              {parallel.map((t) => (
                <li key={t} className="flex gap-2.5 text-sm text-gray-300">
                  <span aria-hidden className="text-red-400 flex-shrink-0">✕</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal delay={1} className="rounded-2xl border border-circuit-green/30 bg-circuit-green/[0.06] p-6">
            <h3 className="text-display text-lg font-semibold mb-4 text-circuit-green">✅ Display original laminado</h3>
            <ul className="space-y-2.5">
              {original.map((t) => (
                <li key={t} className="flex gap-2.5 text-sm text-gray-200">
                  <span aria-hidden className="text-circuit-green flex-shrink-0">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Como funciona
// ============================================================
function HowItWorks() {
  const steps = [
    { n: '1', title: 'Manda o modelo no WhatsApp', desc: 'Você envia o modelo do aparelho e recebe a estimativa de valor e prazo.' },
    { n: '2', title: 'Envio ou entrega do aparelho', desc: 'Combinamos o recebimento com segurança — presencial ou via logística.' },
    { n: '3', title: 'Laminação do vidro novo', desc: 'Separamos o vidro quebrado e laminamos um novo sobre o display original, em laboratório.' },
    { n: '4', title: 'Aparelho de volta como novo', desc: 'Você recebe o celular com a tela recuperada e 90 dias de garantia.' },
  ];
  return (
    <section className="section bg-gray-50">
      <div className="container">
        <ScrollReveal className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Como funciona</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Do orçamento à tela recuperada em 4 passos
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} delay={(i % 4) as 0 | 1 | 2 | 3} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue-hover font-display font-bold mb-3">
                {s.n}
              </div>
              <h3 className="text-display text-base font-semibold text-navy-900 mb-1.5">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Quem somos / transparência
// ============================================================
function About() {
  return (
    <section id="quem-somos" className="section bg-white border-t border-gray-100">
      <div className="container max-w-3xl">
        <ScrollReveal>
          <span className="section-eyebrow">Quem somos</span>
          <h2 className="text-display text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 leading-tight mb-6">
            Um laboratório independente, transparente com você
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            <p>
              A <strong className="text-navy-900">Cyber Informática</strong> é um{' '}
              <strong className="text-navy-900">laboratório independente de recuperação de displays</strong>,
              especializado em laminação OCA — a troca apenas do vidro externo danificado, preservando o
              display OLED/AMOLED original de fábrica do seu aparelho.
            </p>
            <p>
              <strong className="text-navy-900">Não somos assistência técnica autorizada</strong> pela Apple,
              Samsung ou qualquer outro fabricante, e não representamos essas marcas. Somos um prestador de
              serviço independente de reparo físico de hardware, com endereço físico, processo documentado e{' '}
              <strong className="text-navy-900">90 dias de garantia</strong> sobre o serviço que realizamos.
            </p>
            <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">
              Apple e iPhone são marcas registradas da Apple Inc.; Samsung e Galaxy são marcas registradas da
              Samsung Electronics Co., Ltd. Os nomes das marcas são citados apenas para identificar os modelos
              de aparelho que atendemos.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ============================================================
// FAQ — <details> nativo (acessível, sem JS)
// ============================================================
function Faq() {
  return (
    <section className="section bg-gray-50">
      <div className="container max-w-3xl">
        <ScrollReveal className="text-center mb-10">
          <span className="section-eyebrow">Perguntas frequentes</span>
          <h2 className="text-display text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 leading-tight">
            Ainda com dúvida? A gente responde
          </h2>
        </ScrollReveal>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="group bg-white border border-gray-200 rounded-xl px-5 py-4 open:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-navy-900 font-semibold text-display">
                {item.q}
                <span aria-hidden className="text-cyber-blue-hover flex-shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA final
// ============================================================
function FinalCta() {
  return (
    <section className="section bg-navy-900 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] max-w-full bg-circuit-green rounded-full opacity-10 blur-[100px] -z-0" />
      <div className="container relative text-center max-w-2xl">
        <h2 className="text-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
          Não aceite paralela. Salve o seu display original.
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Manda o modelo do seu aparelho no WhatsApp e receba o orçamento — resposta em poucas horas.
        </p>
        <TrackedWhatsAppLink
          phone={WHATSAPP_PHONE}
          message="Olá! Vim do site e quero cotar a laminação OCA (troca de vidro) do meu aparelho, mantendo o display original."
          source="consumidor_final_cta"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-circuit-green text-navy-950 font-bold rounded-lg hover:brightness-95 transition-all shadow-[0_8px_28px_-4px_rgba(0,255,136,0.45)] text-base"
          ariaLabel="Pedir orçamento no WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2z"/>
          </svg>
          Pedir orçamento no WhatsApp
        </TrackedWhatsAppLink>
      </div>
    </section>
  );
}

// ============================================================
// Footer enxuto com disclaimer de transparência
// ============================================================
function ConsumerFooter() {
  return (
    <footer className="bg-navy-950 text-white py-10 border-t border-cyber-blue/15">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/logo-horizontal-footer.png" alt="Cyber Informática" className="h-12 w-auto" />
          <nav aria-label="Links" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-circuit-green transition-colors">Sou lojista / CNPJ</Link>
            <span className="hidden sm:inline text-white/15">·</span>
            <Link href="/politica-privacidade" className="text-gray-400 hover:text-circuit-green transition-colors">Privacidade</Link>
            <span className="hidden sm:inline text-white/15">·</span>
            <Link href="/termos-de-uso" className="text-gray-400 hover:text-circuit-green transition-colors">Termos</Link>
          </nav>
        </div>
        <p className="mt-6 pt-6 border-t border-white/[0.08] text-xs text-gray-500 leading-relaxed text-center sm:text-left">
          © 2026 Cyber Informática — laboratório independente de recuperação de displays (laminação OCA / troca de vidro).{' '}
          <strong className="text-gray-400">Não somos assistência autorizada Apple, Samsung ou de qualquer fabricante.</strong>{' '}
          Apple® e iPhone® são marcas da Apple Inc.; Samsung® e Galaxy® são marcas da Samsung Electronics.
          Marcas citadas apenas para identificação de modelos. Serviço com 90 dias de garantia.
        </p>
      </div>
    </footer>
  );
}
