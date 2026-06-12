import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase-server';
import { agruparPorMarca } from '@/lib/pricing';
import PriceCalculator from '@/components/PriceCalculator';
import QualificationForm from '@/components/QualificationForm';
import ScrollReveal from '@/components/ScrollReveal';
import { Phone } from 'lucide-react';

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
      <Topbar />

      <Hero />

      <StatsBand />

      <CredentialsSection />

      <AdvantagesSection />

      <LogisticsSection />

      <PricingSection modelos={modelos} />

      <PriceCalculator modelosPorMarca={modelosPorMarca} />

      <FormSection modelosPorMarca={modelosPorMarca} />

      <Footer />
    </>
  );
}

// ============================================
// Topbar
// ============================================
function Topbar() {
  return (
    <header className="sticky top-0 z-50 bg-[rgba(5,10,20,0.85)] backdrop-blur-xl border-b border-cyber-blue/15">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-blue to-circuit-green opacity-50" />

      <div className="container">
        <div className="flex items-center justify-between py-4 gap-6">
          <Link href="/" className="flex items-center gap-3 flex-shrink-1 min-w-0">
            <img src="/logo-horizontal-header.png" alt="Cyber Informática" className="h-16 sm:h-20 w-auto" />
          </Link>
          <a
            href="tel:+5511954369269"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-blue/8 border border-cyber-blue/25 text-white text-sm font-semibold rounded-full hover:bg-cyber-blue/15 hover:border-circuit-green transition-all whitespace-nowrap"
          >
            <span className="w-2 h-2 bg-circuit-green rounded-full shadow-[0_0_8px_rgba(0,255,136,0.5)] animate-pulse-ring" />
            <Phone className="w-4 h-4 text-circuit-green" />
            <span className="hidden sm:inline">(11) 95436-9269</span>
          </a>
        </div>
      </div>
    </header>
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
            Cyber Informática · Exclusivo B2B
          </span>

          <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Centro de <span className="gradient-text">Remanufatura</span><br />
                    e Laminação Industrial de Displays
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Para <strong className="text-white">Assistências Técnicas</strong> e <strong className="text-white">Lojistas de Tecnologia</strong>.
                    Faturamento exclusivo via CNPJ. Recupere displays originais com custo de atacado e margem de 60-70%.
                </p>

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

                <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap justify-center gap-6 sm:gap-12 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-circuit-green/10 border border-circuit-green/30 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </span>
                        <span><strong className="text-white">Exclusivo</strong> CNPJ</span>
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
                </div>
            </div>
        </div>
    </section>
  );
}

// ============================================
// Stats Band
// ============================================
function StatsBand() {
  const stats = [
    { value: '60-70%', label: 'Margem de Lucro' },
    { value: 'R$ 120', label: 'Custo por Display' },
    { value: '500+', label: 'Parceiros Ativos' },
    { value: '24h', label: 'Análise de CNPJ' },
  ];

  return (
    <section className="bg-navy-900 border-y border-cyber-blue/15 py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} immediate className="relative">
              {i > 0 && <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-px h-1/2 bg-gradient-to-b from-transparent via-cyber-blue/30 to-transparent" />}
              <div className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text leading-none mb-2">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </ScrollReveal>
          ))}
        </div>
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
    { n: '02', title: 'Margem de 60% a 70%', desc: 'Custo de R$ 120 vs. R$ 400 em tela paralela. Sua margem salta para níveis premium.' },
    { n: '03', title: 'Display Original Preservado', desc: 'Recupere o display original do cliente. Sem retorno por touch falho ou brilho irregular.' },
    { n: '04', title: 'Pagamento PJ em 60 Dias', desc: 'Condições flexíveis para lojistas e parceiros de manutenção com prazos estendidos.' },
  ];

  return (
    <section className="section bg-navy-950 text-white relative overflow-hidden">
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
                Comparativo de Custo
              </div>
              <div className="text-display text-5xl sm:text-6xl font-bold gradient-text leading-none mb-2">
                3x mais margem
              </div>
              <p className="text-gray-300 mb-6 text-sm">
                Laminação terceirizada vs. tela paralela importada
              </p>

              <div className="space-y-2">
                {[
                  { label: 'Custo de Reposição', val: 'R$ 120,00', positive: true },
                  { label: 'Margem de Lucro', val: '60% a 70%', positive: true },
                  { label: 'Risco de Garantia', val: 'Praticamente Nulo', positive: true },
                  { label: 'Display do Cliente', val: 'Preservado', positive: true },
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
// Pricing Section (Tabela de Faixas)
// ============================================
function PricingSection({ modelos }: { modelos: any[] }) {
  const faixas = [
    { min: 0, max: 500, preco: 80, label: 'Econômico', desc: 'Moto G, Galaxy A, iPhone XR' },
    { min: 500, max: 1000, preco: 120, label: 'Intermediário', desc: 'iPhone 11, Galaxy S21' },
    { min: 1000, max: 2000, preco: 180, label: 'Premium', desc: 'iPhone 14, Galaxy S23' },
    { min: 2000, max: 3500, preco: 250, label: 'Top', desc: 'iPhone 15 Pro, S24 Ultra' },
    { min: 3500, max: 999999, preco: 320, label: 'Flagship', desc: 'iPhone 15 Pro Max' },
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Tabela de Preços</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Preço baseado no modelo do display
          </h2>
          <p className="section-description text-lg text-gray-600">
            5 faixas progressivas. Quanto mais alto o valor do display, maior sua economia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {faixas.map((faixa, i) => (
            <ScrollReveal
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyber-blue hover:shadow-[0_10px_30px_-5px_rgba(0,102,255,0.2)]"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="text-xs font-mono text-cyber-blue font-semibold uppercase tracking-wider mb-2">
                {faixa.label}
              </div>
              <div className="text-display text-4xl font-bold gradient-text mb-1">
                R$ {faixa.preco}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                por unidade
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                {faixa.desc}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#price-calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-cyber-blue text-cyber-blue font-semibold rounded-lg hover:bg-cyber-blue hover:text-white transition-all"
          >
            Calcular preço do seu modelo
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest mb-5 font-semibold">
              &#47;&#47; Dados Institucionais
            </h4>
            <p className="font-semibold mb-1">Cyber Informática</p>
            <p className="text-sm text-gray-300 mb-1">Unidade de Engenharia de Componentes Eletrônicos S/A</p>
            <p className="text-sm text-gray-300 mb-3">Endereço Industrial: mediante credenciamento</p>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-circuit-green/10 border border-circuit-green/30 rounded-full text-xs font-semibold text-circuit-green mt-2">
              <span className="w-1.5 h-1.5 bg-circuit-green rounded-full shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
              Serviço restrito a pessoas jurídicas
            </span>
          </div>

          <div>
            <h4 className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest mb-5 font-semibold">
              &#47;&#47; Segmento
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              Serviço restrito a pessoas jurídicas do ramo de eletroeletrônicos. Atendimento exclusivo para assistências técnicas, lojistas de tecnologia e parceiros de manutenção credenciados.
            </p>
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

        <div className="pt-8 border-t border-white/8 text-center text-xs text-gray-500">
          <p>© 2026 Cyber Informática · Centro de Remanufatura e Laminação Industrial de Displays. Todos os direitos reservados.</p>
          <p className="mt-2">Este site não comercializa com consumidores finais. Serviço exclusivamente B2B.</p>
        </div>
      </div>
    </footer>
  );
}
