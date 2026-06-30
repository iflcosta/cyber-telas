import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase-server';
import { agruparPorMarca } from '@/lib/pricing';
import {
  PRICING_TIERS,
  CUSTOMER_LEVEL_DESCRIPTIONS,
  type CustomerLevel,
  calcularPrecoTier,
  formatPriceRange,
} from '@/lib/pricing-tiers';
import CatalogSection from '@/components/CatalogSection';
import QualificationForm from '@/components/QualificationForm';
import ScrollReveal from '@/components/ScrollReveal';
import Header from '@/components/Header';
import SchemaOrg from '@/components/SchemaOrg';

// ============================================
// Render dinâmico: busca Supabase a cada request
// Garante dados fresh (modelos + faixas) sempre
// Sem cache de fetch persistente (que estava quebrando)
// ============================================
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================
// Server Component (RSC) - renderizado no servidor
// ============================================
export default async function HomePage() {
  // Buscar modelos do Supabase (server-side)
  // createAdminClient() retorna null se as env vars não estiverem configuradas
  const supabase = createAdminClient();
  let modelos: any[] = [];

  if (supabase) {
    const { data: modelosRaw } = await supabase
      .from('modelos_preco')
      .select('*')
      .eq('ativo', true)
      .order('marca', { ascending: true })
      .order('valor_display_novo', { ascending: false });
    modelos = modelosRaw || [];
  }

  const modelosPorMarca = agruparPorMarca(modelos);

  return (
    <>
      <SchemaOrg />
      <Header />

      <Hero />

      <StatsBand />

      <CredentialsSection />

      <AdvantagesSection />

      <LogisticsSection />

      <PricingSection modelos={modelos} />

      <CatalogSection />

      <FormSection modelosPorMarca={modelosPorMarca} />

      <Footer />
    </>
  );
}

// ============================================
// Hero Section
// ============================================
function Hero() {
  return (
    <section className="relative bg-navy-950 text-white py-24 sm:py-32 lg:py-40 overflow-hidden isolate">
      {/* Grid técnico */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 102, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 102, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />

      {/* Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-blue rounded-full opacity-50 blur-[80px] -z-10 animate-float-orb" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-circuit-green rounded-full opacity-30 blur-[80px] -z-10 animate-float-orb" style={{ animationDirection: 'reverse' }} />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-cyber-blue-light font-mono text-xs font-medium tracking-widest uppercase mb-8 backdrop-blur">
            <span className="w-1.5 h-1.5 bg-circuit-green rounded-full shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
            Cyber Informática · Laminação OCA Industrial
          </span>

          <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Centro de <span className="gradient-text">Remanufatura</span><br />
                    e Laminação Industrial de Displays
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Para <strong className="text-white">Assistências Técnicas</strong>, <strong className="text-white">Lojistas de Tecnologia</strong> e <strong className="text-white">consumidores finais</strong>.
                    <strong className="text-circuit-green"> Cliente final paga só 70%</strong> do que gastaria na troca completa. Lojistas credenciados, <strong className="text-circuit-green">35%</strong>. Parceiros estratégicos, <strong className="text-circuit-green">25%</strong>.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                    <a
                        href="#form-section"
                        className="btn-primary text-base"
                    >
                        Solicitar Credenciamento
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                    <a
                        href="https://wa.me/5511954369269?text=Ol%C3%A1!%20Vim%20do%20site%20e%20sou%20pessoa%20f%C3%ADsica.%20Quero%20cotar%20lamina%C3%A7%C3%A3o%20OCA%20para%20meu%20aparelho."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/15 text-white font-semibold rounded-full hover:bg-white/10 hover:border-circuit-green transition-all text-base"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-circuit-green">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        Sou pessoa física
                    </a>
                </div>

                <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap justify-center gap-6 sm:gap-12 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-circuit-green/10 border border-circuit-green/30 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </span>
                        <span><strong className="text-white">Faturamento</strong> CNPJ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-circuit-green/10 border border-circuit-green/30 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>
                        </span>
                        <span>Processo <strong className="text-white">OCA</strong> Industrial</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-circuit-green/10 border border-circuit-green/30 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </span>
                        <span>Atendimento <strong className="text-white">Nacional</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-circuit-green/10 border border-circuit-green/30 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        </span>
                        <span>Cotação <strong className="text-white">direta</strong></span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}

// ============================================
// Stats Band — 3 niveis de preco + credenciamento
// ============================================
function StatsBand() {
  const stats = [
    { value: '70%',  label: 'Cliente Final',        tone: 'default' as const },
    { value: '35%',  label: 'Lojista Credenciado',  tone: 'cool' as const },
    { value: '25%',  label: 'Lojista Premium',      tone: 'premium' as const },
    { value: '24h',  label: 'Análise de CNPJ',      tone: 'default' as const },
  ];

  return (
    <section className="bg-navy-900 border-y border-cyber-blue/15 py-12">
      <div className="container">
        <div className="text-center mb-8">
          <span className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest">
            {'//'} Três níveis de preço · Uma única tecnologia
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} immediate className="relative">
              {i > 0 && <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-px h-1/2 bg-gradient-to-b from-transparent via-cyber-blue/30 to-transparent" />}
              <div className={`text-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-none mb-2 ${
                stat.tone === 'premium'
                  ? 'text-circuit-green'
                  : stat.tone === 'cool'
                  ? 'text-cyber-blue-light'
                  : 'gradient-text'
              }`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </ScrollReveal>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-6 max-w-2xl mx-auto">
          Percentuais aplicados sobre o valor de troca completa da tela (peça + mão
          de obra) em assistência técnica. Cliente final economiza 30% comparado à troca completa.
        </p>
      </div>
    </section>
  );
}

// ============================================
// Credentials Section
// ============================================
function CredentialsSection() {
  const cards = [
    { icon: 'shield', title: 'Sala Limpa Controlada', desc: 'Ambiente classe 1000 com filtragem HEPA e controle de temperatura/umidade.', tag: 'ISO 14644-1' },
    { icon: 'cpu', title: 'Tecnologia OCA Sob Vácuo', desc: 'Laminação com Optically Clear Adhesive e autoclave industrial.', tag: '±0.1mm precisão' },
    { icon: 'package', title: 'Processamento de Lotes', desc: 'Capacidade industrial de processamento em escala para parceiros.', tag: '500+ telas/mês' },
    { icon: 'file-check', title: 'Rastreabilidade Total', desc: 'Processos documentados com controle de qualidade em cada etapa.', tag: 'Garantia 90 dias' },
  ];

  return (
    <section className="section" id="credentials">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-16">
          <span className="section-eyebrow">Credenciais Técnicas</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Unidade de Engenharia de Componentes Eletrônicos S/A
          </h2>
          <p className="section-description text-lg text-gray-600">
            Laboratório equipado com maquinário de atmosfera controlada e laminação OCA sob vácuo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <ScrollReveal
              key={i}
              as="article"
              className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyber-blue hover:shadow-[0_20px_50px_-10px_rgba(0,102,255,0.2)]"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-cyber-blue to-cyber-blue-hover rounded-xl flex items-center justify-center mb-6 shadow-[0_8px_20px_rgba(0,102,255,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
              <h3 className="text-display text-xl font-semibold text-navy-900 mb-3 tracking-tight">
                {card.title}
                            </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {card.desc}
                            </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-circuit-green/10 border border-circuit-green/30 rounded-full text-xs font-mono font-semibold text-circuit-green-dark">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {card.tag}
                            </span>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
  );
}

// ============================================
// Advantages Section
// ============================================
function AdvantagesSection() {
  const advantages = [
    { n: '01', title: 'Sem Investimento em Maquinário', desc: 'Elimine o investimento de dezenas de milhares de reais. Utilize nossa infraestrutura fabril completa.' },
    { n: '02', title: 'Três Níveis de Preço', desc: 'Cliente final paga 70% da troca completa. Lojistas credenciados, 35%. Parceiros estratégicos, 25%.' },
    { n: '03', title: 'Display Original Preservado', desc: 'Recupere o display original do cliente. Sem retorno por touch falho ou brilho irregular.' },
    { n: '04', title: 'Pagamento PJ Flexível', desc: 'Condições de 14, 30 ou 60 dias conforme volume. Prazos estendidos para parceiros premium.' },
  ];

  return (
    <section id="advantages" className="section bg-navy-950 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-blue to-circuit-green" />

      <div className="container relative">
        <div className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Vantagens Comerciais</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
            Reduza custos e aumente margem
          </h2>
          <p className="section-description text-lg text-gray-300">
            Terceirize a laminação OCA com quem é especialista. Você foca no atendimento, a gente na técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-3">
            {advantages.map((adv, i) => (
              <ScrollReveal
                key={i}
                className="flex gap-5 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl transition-all duration-300 hover:bg-cyber-blue/5 hover:border-cyber-blue/30 hover:translate-x-1"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-cyber-blue to-cyber-blue-hover rounded-md flex items-center justify-center text-white text-sm font-mono font-bold">
                  {adv.n}
                </span>
                <div>
                  <h4 className="text-display text-lg font-semibold mb-1.5 tracking-tight">
                    {adv.title}
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="relative bg-gradient-to-br from-cyber-blue/10 to-circuit-green/5 border border-cyber-blue/30 rounded-3xl p-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-cyber-blue/15 to-transparent animate-float-orb" />

            <div className="relative">
              <div className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest mb-2">
                Cliente Final Economiza
              </div>
              <div className="text-display text-5xl sm:text-6xl font-bold gradient-text leading-none mb-2">
                30%
              </div>
              <p className="text-gray-300 mb-6 text-sm">
                Paga só 70% do que gastaria na troca completa em assistência.
              </p>

              <div className="space-y-2">
                {[
                  { label: 'Cliente Final',     val: '70% da troca', positive: true },
                  { label: 'Lojista',           val: '35% da troca', positive: true },
                  { label: 'Lojista Premium',   val: '25% da troca', positive: true },
                  { label: 'Display do Cliente', val: 'Preservado',  positive: true },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center px-4 py-3 bg-white/[0.04] rounded-md text-sm">
                    <span className="text-gray-300">{row.label}</span>
                    <span className={row.positive ? 'text-circuit-green font-semibold' : 'text-red-400 font-semibold'}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Logistics Section
// ============================================
function LogisticsSection() {
  const steps = [
    { n: '01', icon: 'package', title: 'Envio do Lote', desc: 'Envie displays em embalagens antichoque via transportadora ou motoboy.' },
    { n: '02', icon: 'check', title: 'Recebimento', desc: 'Inspeção técnica inicial em ambiente controlado. Cada display é catalogado.' },
    { n: '03', icon: 'cpu', title: 'Processamento OCA', desc: 'Laminação sob vácuo com autoclave industrial. Precisão milimétrica.' },
    { n: '04', icon: 'shield', title: 'Controle de Qualidade', desc: 'Verificação técnica rigorosa com teste de touch, brilho e uniformidade.' },
    { n: '05', icon: 'truck', title: 'Devolução', desc: 'Embalagem antichoque industrial pronta para montagem, devolvida via transportadora.' },
  ];

  return (
    <section className="section bg-white" id="logistics">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Logística B2B</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Logística de Lotes para todo o Brasil
          </h2>
          <p className="section-description text-lg text-gray-600">
            Recebimento e expedição via transportadoras parceiras, Correios corporativo ou coleta por motoboy autorizado.
          </p>
        </div>

        <div className="hidden md:grid grid-cols-5 gap-4 relative">
          {steps.map((step, i) => (
            <div key={i} className="text-center p-5 relative">
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:border-cyber-blue">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-cyber-blue">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <div className="font-mono text-xs text-cyber-blue font-semibold mb-1">
                PASSO {step.n}
              </div>
              <h3 className="text-display text-lg font-semibold text-navy-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.desc}
              </p>
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-cyber-blue/30" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: cards empilhados */}
        <div className="md:hidden space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-gray-50 to-white border-2 border-cyber-blue rounded-full flex items-center justify-center">
                <span className="font-mono font-bold text-cyber-blue">{step.n}</span>
              </div>
              <div>
                <h3 className="text-display text-base font-semibold text-navy-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Pricing Section (Tabela de Faixas — 3 níveis de preço)
// ============================================
function PricingSection({ modelos: _modelos }: { modelos: any[] }) {
  const levels: { id: CustomerLevel; badge: string; sub: string; tone: 'default' | 'cool' | 'premium' }[] = [
    { id: 'final',           badge: 'Cliente Final',    sub: '70% da troca completa',    tone: 'default' },
    { id: 'lojista',         badge: 'Lojista',          sub: '35% da troca completa',    tone: 'cool' },
    { id: 'lojista-premium', badge: 'Lojista Premium',  sub: '25% da troca completa',    tone: 'premium' },
  ];

  return (
    <section id="pricing" className="section bg-gray-50">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Tabela de Preços</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Três níveis de preço, uma única tecnologia
          </h2>
          <p className="section-description text-lg text-gray-600">
            O preço do nosso serviço é calculado como um percentual do que você pagaria
            pela troca completa da tela em uma assistência técnica (peça + mão de obra).
            Quem credencia, quem compra em volume e quem é parceiro estratégico tem
            condições diferentes.
          </p>
        </div>

        {/* Legenda dos 3 níveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              className={`rounded-xl px-5 py-4 border ${
                lvl.tone === 'premium'
                  ? 'bg-circuit-green/10 border-circuit-green/30'
                  : lvl.tone === 'cool'
                  ? 'bg-cyber-blue/5 border-cyber-blue/20'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className={`text-xs font-mono uppercase tracking-wider ${
                  lvl.tone === 'premium' ? 'text-circuit-green-dark' : 'text-cyber-blue'
                }`}>
                  {lvl.badge}
                </span>
                <span className="text-xs text-gray-500">{lvl.sub}</span>
              </div>
              <p className="text-sm text-gray-700 leading-snug">
                {CUSTOMER_LEVEL_DESCRIPTIONS[lvl.id]}
              </p>
            </div>
          ))}
        </div>

        {/* Tabela por faixa */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-950 text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest">Faixa</th>
                  <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest hidden md:table-cell">Referência</th>
                  <th className="text-right px-6 py-4 font-mono text-xs uppercase tracking-widest">Cliente Final</th>
                  <th className="text-right px-6 py-4 font-mono text-xs uppercase tracking-widest">Lojista</th>
                  <th className="text-right px-6 py-4 font-mono text-xs uppercase tracking-widest">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-circuit-green rounded-full" />
                      Premium
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_TIERS.map((tier, i) => (
                  <tr
                    key={tier.id}
                    className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-6 py-5">
                      <div className="text-display text-base font-semibold text-navy-900">
                        {tier.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 md:hidden">
                        Ref: {formatPriceRange(tier.refMin, tier.refMax)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 leading-snug hidden md:block">
                        {tier.tagline}
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="text-sm font-medium text-gray-700">
                        {formatPriceRange(tier.refMin, tier.refMax)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 leading-snug">
                        {tier.tagline}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-display text-lg font-semibold text-navy-900">
                        {formatPriceRange(
                          calcularPrecoTier(tier.refMin, 'final'),
                          isFinite(tier.refMax) ? calcularPrecoTier(tier.refMax, 'final') : Number.POSITIVE_INFINITY,
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        por unidade
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-display text-lg font-semibold text-cyber-blue">
                        {formatPriceRange(
                          calcularPrecoTier(tier.refMin, 'lojista'),
                          isFinite(tier.refMax) ? calcularPrecoTier(tier.refMax, 'lojista') : Number.POSITIVE_INFINITY,
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        por unidade
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right bg-circuit-green/5">
                      <div className="text-display text-lg font-semibold text-circuit-green-dark">
                        {formatPriceRange(
                          calcularPrecoTier(tier.refMin, 'lojista-premium'),
                          isFinite(tier.refMax) ? calcularPrecoTier(tier.refMax, 'lojista-premium') : Number.POSITIVE_INFINITY,
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        por unidade
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
            <strong className="text-navy-900">Como ler:</strong> a referência é o valor
            médio de mercado para troca completa da tela (peça + mão de obra) em
            assistência técnica. Cliente final paga <strong>70%</strong> dessa
            referência (economiza 30% vs. troca completa), lojista credenciado paga
            <strong> 35%</strong>, e lojista premium (parceria estratégica) paga
            <strong> 25%</strong>. Tabela detalhada por modelo via WhatsApp (lojistas).
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="#cotacao"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-cyber-blue text-cyber-blue font-semibold rounded-lg hover:bg-cyber-blue hover:text-white transition-all"
          >
            Ver cotação para pessoa física
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Form Section (Server Component wrapper)
// ============================================
function FormSection({ modelosPorMarca }: { modelosPorMarca: Record<string, any[]> }) {
  return (
    <section className="section bg-navy-900 text-white relative overflow-hidden" id="form-section">
      <div className="absolute inset-0 bg-radial-gradient from-cyber-blue/15 to-transparent" style={{
        background: 'radial-gradient(ellipse at top left, rgba(0,102,255,0.15), transparent 50%), radial-gradient(ellipse at bottom right, rgba(0,255,136,0.1), transparent 50%)'
      }} />

      <div className="container relative">
        <div className="max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-10 sm:p-12 text-center border-b border-white/8">
            <span className="inline-block font-mono text-xs text-circuit-green uppercase tracking-widest mb-3">
              &#47;&#47; Portal de Parceria
            </span>
            <h2 className="text-display text-3xl font-bold mb-2 tracking-tight">
              Solicite Credenciamento
            </h2>
            <p className="text-gray-300 text-base">
              Catálogo Técnico e Tabela Atacadista. Cadastro sujeito a verificação cadastral de CNPJ.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <QualificationForm modelosPorMarca={modelosPorMarca} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Footer
// ============================================
function Footer() {
  return (
    <footer className="bg-navy-950 text-white py-12 border-t border-cyber-blue/15">
      <div className="container">
        <div className="flex items-center pb-8 mb-8 border-b border-white/8">
          <img src="/logo-horizontal-footer.png" alt="Cyber Informática" className="h-16 w-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest mb-5 font-semibold">
              &#47;&#47; Dados Institucionais
            </h4>
            <p className="font-semibold mb-1">Cyber Informática</p>
            <p className="text-sm text-gray-300 mb-1">Unidade de Engenharia de Componentes Eletrônicos S/A</p>
            <p className="text-sm text-gray-300 mb-3">Endereço Industrial: mediante credenciamento</p>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-circuit-green/10 border border-circuit-green/30 rounded-full text-xs font-semibold text-circuit-green mt-2">
              <span className="w-1.5 h-1.5 bg-circuit-green rounded-full shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
              Faturamento principal via CNPJ
            </span>
          </div>

          <div>
            <h4 className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest mb-5 font-semibold">
              &#47;&#47; Para Empresas
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              Atendimento prioritário para assistências técnicas, lojistas de
              tecnologia e parceiros de manutenção credenciados. Faturamento
              mensal via CNPJ com condições PJ.
            </p>
            <a href="#form-section" className="text-sm text-circuit-green hover:underline">
              Solicitar credenciamento →
            </a>
          </div>

          <div>
            <h4 className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest mb-5 font-semibold">
              &#47;&#47; Para Você
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              Pessoa física também pode solicitar cotação direta via WhatsApp.
              Avaliamos modelo, valor e prazo do aparelho individualmente.
            </p>
            <a
              href="https://wa.me/5511954369269?text=Ol%C3%A1!%20Vim%20do%20site%20e%20sou%20pessoa%20f%C3%ADsica.%20Quero%20cotar%20lamina%C3%A7%C3%A3o%20OCA."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-circuit-green hover:underline"
            >
              Falar no WhatsApp →
            </a>
          </div>

          <div>
            <h4 className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest mb-5 font-semibold">
              &#47;&#47; Contato
            </h4>
            <p className="mb-3">
              <a href="tel:+5511954369269" className="inline-flex items-center gap-2 text-gray-300 hover:text-circuit-green transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                (11) 95436-9269
                            </a>
                        </p>
            <p className="mb-3">
              <a href="mailto:contato@cyberinformatica.tech" className="inline-flex items-center gap-2 text-gray-300 hover:text-circuit-green transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                                </svg>
                                contato@cyberinformatica.tech
                            </a>
                        </p>
            <p className="text-xs text-gray-500 mt-4">Seg-Sex · 08h às 18h</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="text-center sm:text-left">
            <p>© 2026 Cyber Informática · Centro de Remanufatura e Laminação Industrial de Displays. Todos os direitos reservados.</p>
            <p className="mt-1">Atendemos empresas (CNPJ, faturamento mensal) e pessoas físicas (cotação direta via WhatsApp). Cadastro sujeito a verificação cadastral.</p>
          </div>
          <nav aria-label="Documentos legais" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              href="/politica-privacidade"
              className="text-gray-400 hover:text-circuit-green transition-colors"
            >
              Política de Privacidade
            </Link>
            <span className="hidden sm:inline text-white/15">·</span>
            <Link
              href="/termos-de-uso"
              className="text-gray-400 hover:text-circuit-green transition-colors"
            >
              Termos de Uso
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
