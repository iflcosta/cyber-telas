import type { Metadata } from 'next';
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
import TrackedWhatsAppLink from '@/components/TrackedWhatsAppLink';

// ============================================
// ISR (Incremental Static Regeneration): a página é servida do cache da CDN
// e revalidada no servidor a cada 5 min. Preços/modelos não mudam a cada
// request, então isso derruba o TTFB (importante para Quality Score de Ads)
// sem sacrificar frescor relevante. É cache de ROTA — não o fetch-cache do
// Supabase que dava problema antes.
// ============================================
export const revalidate = 300;

// ============================================
// Metadados B2B próprios (o default do layout é voltado ao consumidor,
// já que a página principal "/" agora é a landing B2C).
// ============================================
export const metadata: Metadata = {
  title: { absolute: 'Laminação OCA Industrial para Lojistas e Assistências · Cyber Informática' },
  description:
    'Laminação OCA industrial B2B para assistências técnicas e lojistas. Credenciamento por CNPJ, tabela por faixa e lotes com rastreabilidade.',
  alternates: { canonical: '/lojista' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/lojista',
    siteName: 'Cyber Informática',
    title: 'Laminação OCA Industrial para Lojistas e Assistências · Cyber Informática',
    description:
      'Laminação OCA industrial B2B para assistências técnicas e lojistas. Credenciamento por CNPJ, tabela por faixa e lotes com rastreabilidade.',
  },
  robots: { index: true, follow: true },
};

// ============================================
// Server Component (RSC) - renderizado no servidor
// ============================================
export default async function LojistaPage() {
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

      <AboutSection />

      <Footer />

      {/* Botão flutuante de WhatsApp — só mobile (no desktop o header já expõe
          o WhatsApp). Mantém o caminho de conversão sempre visível na rolagem. */}
      <TrackedWhatsAppLink
        phone="5511954369269"
        message="Olá! Vim do site e quero cotar a laminação OCA (troca de vidro) do meu aparelho."
        source="page_floating_pf"
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

// ============================================
// Hero Section
// ============================================
function Hero() {
  return (
    <section className="relative bg-navy-950 text-white pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden isolate">
      {/* Grid técnico de fundo */}
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 102, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 102, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 800px 500px at center, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 800px 500px at center, black 0%, transparent 70%)',
        }}
      />

      {/* Orbs mais sutis */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyber-blue rounded-full opacity-30 blur-[80px] -z-10 animate-float-orb" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-circuit-green rounded-full opacity-20 blur-[80px] -z-10 animate-float-orb" style={{ animationDirection: 'reverse' }} />

      <div className="container relative">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Coluna texto */}
          <div>
            {/* Badge com dot pulsante */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue-light font-mono text-[11px] font-medium tracking-widest uppercase backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-circuit-green opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-circuit-green" />
              </span>
              Cyber Informática · Laminação OCA Industrial
            </div>

            <h1 className="text-display text-balance text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-tight lg:leading-[1.05] mb-6 tracking-tight">
              Centro de <span className="gradient-text">Remanufatura</span>{' '}
              e Laminação Industrial de Displays
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-xl mb-8 leading-relaxed">
              <strong className="text-circuit-green">Display original preservado em 24h.</strong>{' '}
              Laminação OCA industrial para assistências técnicas, lojistas e pessoa física.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <a
                href="#form-section"
                className="btn-primary text-base justify-center"
              >
                Solicitar Credenciamento
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <TrackedWhatsAppLink
                phone="5511954369269"
                message="Olá! Vim do site e sou pessoa física. Quero cotar laminação OCA para o meu aparelho."
                source="page_hero_pf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/15 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-circuit-green transition-all text-base"
                ariaLabel="WhatsApp pessoa física"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-circuit-green">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                Sou pessoa física
              </TrackedWhatsAppLink>
            </div>

            {/* Trust badges com ícones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08]">
              {[
                { label: 'Faturamento', sub: 'CNPJ', icon: 'shield' },
                { label: 'Processo', sub: 'OCA Industrial', icon: 'cpu' },
                { label: 'Atendimento', sub: 'Nacional', icon: 'globe' },
                { label: 'Cotação', sub: 'direta', icon: 'chat' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="w-9 h-9 bg-circuit-green/10 border border-circuit-green/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    {b.icon === 'shield' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    )}
                    {b.icon === 'cpu' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="14" x2="22" y2="14"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="14" x2="4" y2="14"/></svg>
                    )}
                    {b.icon === 'globe' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    )}
                    {b.icon === 'chat' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold leading-tight">{b.label}</div>
                    <div className="text-sm font-bold text-white leading-tight truncate">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna visual — mockup SVG da máquina OCA */}
          <div className="relative">
            <MaquinaOCAMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * MaquinaOCAMockup — SVG inline da máquina de laminação OCA industrial.
 * Não depende de imagem externa — sempre renderiza.
 */
function MaquinaOCAMockup() {
  return (
    <div className="relative aspect-[5/4] w-full">
      {/* Glow atrás */}
      <div
        className="absolute inset-0 rounded-3xl blur-3xl opacity-60"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.3) 0%, transparent 60%)' }}
        aria-hidden
      />

      {/* Card principal com borda cyber */}
      <div className="relative w-full h-full rounded-3xl bg-[#0a1929] border-2 border-cyber-blue/40 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Grid pattern interno */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(0,255,136,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,.2) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />

        {/* Conteúdo principal — versão com divs (sempre renderiza) */}
        <div className="relative w-full h-full p-4 sm:p-5 flex flex-col gap-2">
          {/* Header do mockup — barra de título */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-[#112240] border border-cyber-blue/40">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ff5470]" />
              <div className="w-2 h-2 rounded-full bg-[#ffb020]" />
              <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
            </div>
            <div className="text-[10px] font-mono font-bold text-circuit-green tracking-wider">CYBER · OCA INDUSTRIAL</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse" />
              <span className="text-[9px] font-mono text-circuit-green/80">LIVE</span>
            </div>
          </div>

          {/* Linha principal — chassi dividido em 3 colunas */}
          <div className="flex-1 grid grid-cols-[1fr_2fr_1fr] gap-2">
            {/* Coluna esquerda — Painel de controle */}
            <div className="rounded-lg bg-[#112240] border border-cyber-blue/40 p-2 flex flex-col gap-1.5">
              <div className="text-[8px] font-mono font-bold text-cyber-blue-light uppercase tracking-wider">CONTROLE</div>
              {/* Display touchscreen */}
              <div className="aspect-[4/3] rounded bg-[#000] border border-cyber-blue/60 p-1.5 flex flex-col justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse" />
                  <span className="text-[7px] font-mono text-circuit-green">ONLINE</span>
                </div>
                {/* Gráfico de barras */}
                <div className="flex items-end gap-0.5 h-6">
                  <div className="flex-1 bg-cyber-blue rounded-sm" style={{ height: '40%' }} />
                  <div className="flex-1 bg-cyber-blue rounded-sm" style={{ height: '70%' }} />
                  <div className="flex-1 bg-circuit-green rounded-sm" style={{ height: '85%' }} />
                  <div className="flex-1 bg-circuit-green rounded-sm" style={{ height: '95%' }} />
                  <div className="flex-1 bg-circuit-green rounded-sm" style={{ height: '100%' }} />
                </div>
                <div className="text-[7px] font-mono text-white/80">PRESS: -0.08kPa</div>
              </div>
              {/* Botões físicos */}
              <div className="grid grid-cols-4 gap-1">
                <div className="aspect-square rounded-full bg-circuit-green border border-white/30" />
                <div className="aspect-square rounded-full bg-cyber-blue border border-white/30" />
                <div className="aspect-square rounded-full bg-[#ff5470] border border-white/30" />
                <div className="aspect-square rounded-full bg-[#0a1929] border border-cyber-blue/60" />
              </div>
              {/* LEDs de status */}
              <div className="flex items-center justify-between text-[7px] font-mono">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-circuit-green" />
                  <span className="text-circuit-green">OK</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-circuit-green" />
                  <span className="text-circuit-green">OK</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb020]" />
                  <span className="text-[#ffb020]">W</span>
                </div>
              </div>
              {/* Logo */}
              <div className="mt-auto rounded border border-circuit-green/40 px-2 py-1 text-center">
                <div className="text-[8px] font-mono font-bold text-circuit-green">CYBER · OCA</div>
              </div>
            </div>

            {/* Coluna central — Câmara de laminação */}
            <div className="relative rounded-lg bg-[#112240] border-2 border-cyber-blue/60 p-2 flex flex-col">
              {/* Moldura externa da câmara com glow */}
              <div className="absolute inset-1 rounded border border-cyber-blue/30 pointer-events-none" />

              {/* Cabeçalho da câmara */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] font-mono font-bold text-cyber-blue-light uppercase tracking-wider">CÂMARA OCA</div>
                <div className="flex items-center gap-1 text-[8px] font-mono text-circuit-green">
                  <div className="w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse" />
                  <span>ATIVO</span>
                </div>
              </div>

              {/* Braço da autoclave descendo */}
              <div className="flex justify-center mb-1">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-2.5 rounded-sm bg-[#112240] border border-cyber-blue/60 relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse" />
                  </div>
                  <div className="w-1.5 h-3 bg-cyber-blue rounded-b" />
                </div>
              </div>

              {/* Display sendo laminado (celular dentro da câmara) */}
              <div className="flex-1 flex items-center justify-center my-1">
                <div className="relative">
                  {/* Moldura do display */}
                  <div className="w-32 sm:w-40 aspect-[10/16] rounded-lg bg-[#000] border-2 border-cyber-blue/80 p-1 shadow-[0_0_30px_rgba(0,255,136,0.4)]">
                    {/* Tela do display */}
                    <div className="w-full h-full rounded bg-[#001a4d] flex flex-col items-center justify-center p-2">
                      {/* Notch */}
                      <div className="w-12 h-1 rounded-full bg-[#000] mb-2" />
                      {/* Linhas de UI */}
                      <div className="w-full space-y-1 mb-2">
                        <div className="h-1 w-3/4 rounded bg-cyber-blue-light/80" />
                        <div className="h-0.5 w-full rounded bg-cyber-blue/50" />
                        <div className="h-0.5 w-2/3 rounded bg-cyber-blue/30" />
                      </div>
                      {/* Check verde grande */}
                      <div className="w-12 h-12 rounded-full border-[3px] border-circuit-green flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-circuit-green">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div className="mt-2 text-[8px] font-mono font-bold text-circuit-green uppercase tracking-wider">Aprovado</div>
                    </div>
                  </div>
                  {/* Glow embaixo */}
                  <div className="absolute inset-0 rounded-lg blur-2xl bg-circuit-green/30 -z-10" />
                </div>
              </div>

              {/* Painel de controle embaixo */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-7 rounded bg-cyber-blue border border-white/30 flex items-center justify-center text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                  START
                </div>
                <div className="w-7 h-7 rounded bg-[#0a1929] border border-cyber-blue/60" />
                <div className="w-7 h-7 rounded bg-[#0a1929] border border-cyber-blue/60" />
                <div className="w-7 h-7 rounded bg-[#0a1929] border border-cyber-blue/60 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-circuit-green" />
                </div>
              </div>
            </div>

            {/* Coluna direita — Saída de displays prontos */}
            <div className="rounded-lg bg-[#112240] border border-cyber-blue/40 p-2 flex flex-col">
              <div className="text-[8px] font-mono font-bold text-cyber-blue-light uppercase tracking-wider mb-1.5">SAÍDA</div>
              {/* LEDs de status */}
              <div className="flex items-center justify-center gap-1 mb-2 py-1 rounded bg-[#0a1929]">
                <div className="w-1.5 h-1.5 rounded-full bg-circuit-green" />
                <span className="text-[7px] font-mono text-circuit-green">PRONTO</span>
              </div>
              {/* Prateleiras com displays prontos */}
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-1 mb-1.5 rounded bg-[#0a1929] border border-cyber-blue/40 p-1 flex flex-col items-center justify-center">
                  <div className="w-2/3 aspect-[10/16] rounded-sm bg-[#001a4d] border border-circuit-green/40" />
                  <div className="mt-1 flex items-center gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-circuit-green" />
                    <div className="w-3 h-0.5 rounded bg-cyber-blue-light/50" />
                  </div>
                </div>
              ))}
              <div className="mt-auto text-center text-[7px] font-mono text-circuit-green/80">+500/mês</div>
            </div>
          </div>

          {/* Base do mockup — barra de status */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-[#112240] border border-cyber-blue/40">
            <div className="flex items-center gap-3 text-[9px] font-mono">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse" />
                <span className="text-circuit-green">Sistema operacional</span>
              </div>
              <span className="text-white/30">|</span>
              <span className="text-white/60">Temp: 38°C</span>
              <span className="text-white/30">|</span>
              <span className="text-white/60">Vácuo: -0.08kPa</span>
            </div>
            <div className="text-[9px] font-mono font-bold text-circuit-green">v2.4.1</div>
          </div>
        </div>

        {/* Tags flutuantes */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 text-[10px] font-mono pointer-events-none z-10">
          <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-circuit-green/40 rounded text-white font-semibold">
            ⚡ OCA sob vácuo
          </span>
          <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-circuit-green/40 rounded text-white font-semibold">
            🔬 ISO 14644-1
          </span>
          <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-circuit-green/40 rounded text-white font-semibold hidden sm:inline">
            📊 ±0.1mm
          </span>
        </div>

        {/* Badge pulsante no canto */}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-circuit-green/40 text-xs font-bold text-circuit-green flex items-center gap-1.5 pointer-events-none z-10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-circuit-green opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-circuit-green" />
          </span>
          Em operação
        </div>
      </div>
    </div>
  );
}

// ============================================
// Stats Band — 3 niveis de preco + credenciamento
// ============================================
function StatsBand() {
  const stats = [
    { value: 'R$ 175', label: 'Cliente Final · a partir de', tone: 'default' as const },
    { value: 'R$ 87', label: 'Lojista · a partir de',       tone: 'cool' as const },
    { value: '60-70%', label: 'Margem do Parceiro',          tone: 'premium' as const },
    { value: '24h',    label: 'Análise de CNPJ',             tone: 'default' as const },
  ];

  return (
    <section className="bg-navy-900 border-y border-cyber-blue/15 py-12">
      <div className="container">
        <div className="text-center mb-8">
          <span className="font-mono text-xs text-cyber-blue-light uppercase tracking-widest">
            {'//'} Dois níveis claros de preço · Mais uma curadoria estratégica
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
          Valores aplicados ao serviço completo de laminação OCA industrial.
          Referência: troca completa em assistência técnica (peça + mão de obra).
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
    { n: '02', title: 'Dois Níveis de Preço', desc: 'R$ 175 por unidade para o cliente final. R$ 87 para lojistas credenciados.' },
    { n: '03', title: 'Display Original Preservado', desc: 'Recupere o display original do cliente. Sem retorno por touch falho ou brilho irregular.' },
    { n: '04', title: 'Pagamento PJ Flexível', desc: 'Condições de 14, 30 ou 60 dias conforme volume. Prazos estendidos para grandes volumes.' },
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
                Cliente Final
              </div>
              <div className="text-display text-5xl sm:text-6xl font-bold gradient-text leading-none mb-2">
                R$ 175
              </div>
              <p className="text-gray-300 mb-6 text-sm">
                Valor inicial para smartphones de entrada. Tabela completa por modelo abaixo.
              </p>

              <div className="space-y-2">
                {[
                  { label: 'Cliente Final',        val: 'a partir de R$ 175', positive: true },
                  { label: 'Lojista Credenciado',  val: 'a partir de R$ 87', positive: true },
                  { label: 'Margem do Parceiro',   val: '60-70%',             positive: true },
                  { label: 'Display do Cliente',   val: 'Preservado',         positive: true },
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
// Pricing Section (Tabela de Faixas — 2 níveis públicos + curadoria)
// ============================================
function PricingSection({ modelos: _modelos }: { modelos: any[] }) {
  const levels: { id: CustomerLevel; badge: string; sub: string; tone: 'default' | 'cool' }[] = [
    { id: 'final',   badge: 'Cliente Final', sub: 'A partir de R$ 175 por unidade', tone: 'default' },
    { id: 'lojista', badge: 'Lojista',       sub: 'A partir de R$ 87 por unidade', tone: 'cool' },
  ];

  return (
    <section id="pricing" className="section bg-gray-50">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Tabela de Preços</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Dois níveis de preço, uma única tecnologia
          </h2>
          <p className="section-description text-lg text-gray-600">
            Calculado como percentual da troca completa em assistência técnica (peça + mão de obra).
            Cliente final e lojista têm tabelas próprias.
          </p>
        </div>

        {/* Legenda dos 2 níveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              className={`rounded-xl px-5 py-4 border ${
                lvl.tone === 'cool'
                  ? 'bg-cyber-blue/5 border-cyber-blue/20'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-cyber-blue-hover">
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
        <div className="max-w-5xl mx-auto">
          {/* Mobile: cards empilhados (evita scroll horizontal da tabela) */}
          <div className="md:hidden space-y-3">
            {PRICING_TIERS.map((tier) => {
              const finalRange = formatPriceRange(
                calcularPrecoTier(tier.refMin, 'final'),
                isFinite(tier.refMax) ? calcularPrecoTier(tier.refMax, 'final') : Number.POSITIVE_INFINITY,
              );
              const lojistaRange = formatPriceRange(
                calcularPrecoTier(tier.refMin, 'lojista'),
                isFinite(tier.refMax) ? calcularPrecoTier(tier.refMax, 'lojista') : Number.POSITIVE_INFINITY,
              );
              return (
                <div key={tier.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
                  <div className="text-display text-base font-semibold text-navy-900">{tier.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5 leading-snug">{tier.tagline}</div>
                  <div className="grid grid-cols-2 gap-2.5 mt-3">
                    <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-0.5">Cliente Final</div>
                      <div className="text-display text-base font-semibold text-navy-900 leading-tight">{finalRange}</div>
                    </div>
                    <div className="rounded-lg bg-cyber-blue/5 border border-cyber-blue/15 px-3 py-2.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-cyber-blue-hover mb-0.5">Lojista</div>
                      <div className="text-display text-base font-semibold text-cyber-blue-hover leading-tight">{lojistaRange}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2.5">
                    Ref. assistência: {formatPriceRange(tier.refMin, tier.refMax)} · por unidade
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: tabela completa */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-950 text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest">Faixa</th>
                  <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest hidden md:table-cell">Referência</th>
                  <th className="text-right px-6 py-4 font-mono text-xs uppercase tracking-widest">Cliente Final</th>
                  <th className="text-right px-6 py-4 font-mono text-xs uppercase tracking-widest">Lojista</th>
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
                      <div className="text-display text-lg font-semibold text-cyber-blue-hover">
                        {formatPriceRange(
                          calcularPrecoTier(tier.refMin, 'lojista'),
                          isFinite(tier.refMax) ? calcularPrecoTier(tier.refMax, 'lojista') : Number.POSITIVE_INFINITY,
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
            médio de mercado da troca completa em assistência (peça + mão de obra).
            Cliente final paga <strong>70%</strong>, lojista credenciado paga <strong>35%</strong>.
          </div>
          </div>

          {/* Nota "Como ler" no mobile (a tabela desktop fica oculta em telas pequenas) */}
          <div className="md:hidden mt-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-500 leading-relaxed">
            <strong className="text-navy-900">Como ler:</strong> a referência é o valor médio de mercado da troca completa em assistência (peça + mão de obra). Cliente final paga <strong>70%</strong>, lojista credenciado paga <strong>35%</strong>.
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
// ============================================
// About / Transparência
// ============================================
function AboutSection() {
  return (
    <section id="quem-somos" className="section bg-white border-t border-gray-100">
      <div className="container max-w-3xl">
        <h2 className="section-title text-display text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 leading-tight mb-6">
          Quem somos
        </h2>
        <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
          <p>
            A <strong className="text-navy-900">Cyber Informática</strong> é um{' '}
            <strong className="text-navy-900">laboratório independente de recuperação de displays</strong>,
            especializado em <strong className="text-navy-900">laminação OCA</strong> — a troca apenas do
            vidro externo danificado, preservando o display OLED/AMOLED original de fábrica do seu aparelho.
          </p>
          <p>
            <strong className="text-navy-900">Não somos assistência técnica autorizada</strong> pela Apple,
            Samsung ou qualquer outro fabricante, e não representamos essas marcas. Somos um prestador de
            serviço independente de reparo físico de hardware. As garantias oficiais de fábrica não são
            administradas por nós.
          </p>
          <p>
            Trabalhamos com endereço físico e processo documentado, com{' '}
            <strong className="text-navy-900">90 dias de garantia</strong> sobre o serviço de laminação que
            realizamos.
          </p>
          <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">
            Apple e iPhone são marcas registradas da Apple Inc.; Samsung e Galaxy são marcas registradas da
            Samsung Electronics Co., Ltd. Os nomes das marcas são citados apenas para identificar os modelos
            de aparelho que atendemos.
          </p>
        </div>
      </div>
    </section>
  );
}

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
            <TrackedWhatsAppLink
              phone="5511954369269"
              message="Olá! Vim do site e sou pessoa física. Quero cotar laminação OCA."
              source="page_footer_pf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-circuit-green hover:underline"
              ariaLabel="WhatsApp pessoa física"
            >
              Falar no WhatsApp →
            </TrackedWhatsAppLink>
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
            <p>© 2026 Cyber Informática · Laboratório independente de recuperação de displays (laminação OCA / troca de vidro). Todos os direitos reservados.</p>
            <p className="mt-1"><strong className="text-gray-400">Não somos assistência autorizada Apple, Samsung ou de qualquer fabricante.</strong> Apple® e iPhone® são marcas da Apple Inc.; Samsung® e Galaxy® são marcas da Samsung Electronics. Marcas citadas apenas para identificação de modelos. Serviço com 90 dias de garantia.</p>
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
