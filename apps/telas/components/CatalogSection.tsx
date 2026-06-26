'use client';

// ============================================
// CotacaoSection — Acolhimento B2C + WhatsApp
//
// Antes: "CatalogSection" com download de PDF.
// Agora: o PDF vive apenas LOCAL (assets/) — Iago envia manualmente.
// O site foca em acolher pessoa fisica (B2C) com WhatsApp direto
// + mini tier-finder para ela identificar a faixa do aparelho.
//
// PricingSection (acima) ja mostra a tabela 5 faixas x 3 niveis
// (visao geral B2B + B2C). Aqui e a "porta B2C".
// ============================================

import { MessageCircle, Search, ShieldCheck } from 'lucide-react';
import { PRICING_TIERS, formatPriceRange, calcularPrecoTier } from '@/lib/pricing-tiers';

const WHATSAPP_URL =
  'https://wa.me/5511954369269?text=Ol%C3%A1!%20Vim%20do%20site%20e%20quero%20cotar%20lamina%C3%A7%C3%A3o%20OCA%20para%20meu%20aparelho.';

export default function CatalogSection() {
  return (
    <section id="cotacao" className="section bg-white">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-10">
          <span className="section-eyebrow">Cotacao para pessoa fisica</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Quer cotar para o seu aparelho?
          </h2>
          <p className="section-description text-lg text-gray-600">
            Atendimento direto via WhatsApp. Manda o modelo do aparelho e o valor
            que sua assistencia cobraria pela troca — respondemos em poucas horas
            com a cotacao para o seu caso (ate 70% do valor cheio).
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* ============================================================
              Card esquerdo: tier-finder B2C (3 col)
              ============================================================ */}
          <div className="lg:col-span-3 bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-cyber-blue text-xs font-mono uppercase tracking-wider mb-5">
              <Search className="w-3 h-3" />
              Em qual faixa o seu aparelho se encaixa?
            </div>

            <h3 className="text-display text-xl font-semibold text-navy-900 mb-4 tracking-tight">
              Identifique a faixa pelo valor de troca em assistencia
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              Procure na assistencia o preco que cobrariam pela troca completa
              da tela (peca + mao de obra). Compare com a tabela abaixo para
              ter uma ideia do quanto pagaria.
            </p>

            <ul className="space-y-2">
              {PRICING_TIERS.map((tier) => {
                const finalMax = calcularPrecoTier(tier.refMin, 'final');
                return (
                  <li
                    key={tier.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 bg-white border border-gray-200 rounded-xl"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-navy-900">
                        {tier.label.replace(/^[A-E] — /, '')}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Troca completa em assistencia{' '}
                        {formatPriceRange(tier.refMin, tier.refMax)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500">Voce pagaria</div>
                      <div className="text-display text-base font-semibold text-circuit-green-dark">
                        a partir de{' '}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        }).format(finalMax)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              <strong className="text-navy-900">Atencao:</strong> o preco final
              e calculado sobre o valor exato do seu modelo. Manda no WhatsApp
              o modelo e o valor de referencia para uma cotacao precisa.
            </p>
          </div>

          {/* ============================================================
              Card direito: WhatsApp (2 col)
              ============================================================ */}
          <div className="lg:col-span-2 bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-cyber-blue rounded-full opacity-20 blur-[60px] -z-0" />

            <div className="relative flex-1 flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-circuit-green/10 border border-circuit-green/30 rounded-full text-circuit-green text-xs font-mono uppercase tracking-wider mb-5 self-start">
                <ShieldCheck className="w-3 h-3" />
                Atendimento seguro
              </div>

              <h3 className="text-display text-xl font-semibold mb-3 tracking-tight">
                Fale direto com a gente
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6 flex-1">
                Nossa equipe responde em poucas horas com a cotacao exata para
                o seu aparelho. Sem compromisso.
              </p>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-circuit-green text-navy-950 font-bold rounded-lg hover:bg-circuit-green-light transition-all shadow-[0_8px_24px_-4px_rgba(0,255,136,0.4)]"
              >
                <MessageCircle className="w-5 h-5" />
                Abrir WhatsApp
              </a>

              <p className="text-xs text-gray-400 mt-4">
                Seg-Sex · 08h as 18h · Resposta em poucas horas.
              </p>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <strong className="text-white">Voce e lojista ou assistencia?</strong>{' '}
                  O catalogo detalhado por modelo e enviado sob solicitacao via
                  WhatsApp ou e-mail. Use o formulario de credenciamento abaixo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}