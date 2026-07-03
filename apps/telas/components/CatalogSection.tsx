'use client';

// ============================================
// CotacaoSection — Tier-finder com 76 modelos
//
// Antes: tier-finder genérico (5 faixas sem modelos).
// Agora: dropdown com os 76 modelos do MODEL_GROUPS,
//        mostra tier + valor cliente final (70%),
//        WhatsApp pré-preenchido com modelo.
//
// IMPORTANTE: NUNCA mostra valor lojista (35%) aqui.
// Esse dado é confidencial e fica SÓ no catálogo DOCX
// que o Iago envia manualmente via WhatsApp.
// PricingSection (acima) é onde o lojista vê a coluna dele.
// ============================================

import { useMemo, useState } from 'react';
import { MessageCircle, Search, ShieldCheck, Store, ChevronDown } from 'lucide-react';
import {
  MODEL_GROUPS,
  formatBRLShort,
  type ModelPrice,
} from '@/lib/pricing-models';
import {
  PRICING_TIERS,
  calcularPrecoTier,
  findTier,
  type PricingTier,
} from '@/lib/pricing-tiers';
import TrackedWhatsAppLink from './TrackedWhatsAppLink';

const WHATSAPP_BASE = 'https://wa.me/5511954369269';
const WHATSAPP_FALLBACK_MSG =
  'Olá! Vim do site e quero cotar laminação OCA para o meu aparelho.';

interface FlatModel extends ModelPrice {
  key: string;
  brand: string;
}

export default function CatalogSection() {
  const [selectedKey, setSelectedKey] = useState<string>('');

  // Achata MODEL_GROUPS em uma única lista com chave única
  const flatModels = useMemo<FlatModel[]>(
    () =>
      MODEL_GROUPS.flatMap((group) =>
        group.models.map((m) => ({
          ...m,
          brand: group.brand,
          key: `${group.brand}::${m.model}`,
        })),
      ),
    [],
  );

  const selected = selectedKey
    ? flatModels.find((m) => m.key === selectedKey) ?? null
    : null;

  // Calcula tier + valor final (cliente final = 70% do valor de referência)
  const result = useMemo(() => {
    if (!selected) return null;
    const tier = findTier(selected.full);
    if (!tier) return null;
    const finalPrice = calcularPrecoTier(selected.full, 'final');
    return { tier, finalPrice };
  }, [selected]);

  // WhatsApp com modelo pré-preenchido
  const whatsappUrl = useMemo(() => {
    const msg = selected
      ? `Olá! Vim do site e quero cotar laminação OCA para o ${selected.brand} ${selected.model} (referência de troca em assistência R$ ${formatBRLShort(selected.full).replace('R$', 'R$ ')}).`
      : WHATSAPP_FALLBACK_MSG;
    return `${WHATSAPP_BASE}${encodeURIComponent(msg)}`;
  }, [selected]);

  return (
    <section id="cotacao" className="section bg-white">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-10">
          <span className="section-eyebrow">Cotacao para pessoa fisica</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Qual o modelo do seu aparelho?
          </h2>
          <p className="section-description text-lg text-gray-600">
            Selecione o modelo e veja na hora a faixa e o valor que pagaria
            (ate 70% do que gastaria na troca completa em assistencia). Manda
            no WhatsApp pra confirmar disponibilidade.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* ============================================================
              Card esquerdo: tier-finder com 76 modelos (3 col)
              ============================================================ */}
          <div className="lg:col-span-3 bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-cyber-blue text-xs font-mono uppercase tracking-wider mb-5">
              <Search className="w-3 h-3" />
              {MODEL_GROUPS.reduce((sum, g) => sum + g.models.length, 0)} modelos catalogados
            </div>

            <label
              htmlFor="modelo-select"
              className="block text-display text-xl font-semibold text-navy-900 mb-4 tracking-tight"
            >
              Selecione o modelo do seu aparelho
            </label>

            <div className="relative">
              <select
                id="modelo-select"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="appearance-none w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-base text-navy-900 font-medium focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 focus:outline-none transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Escolha a marca e o modelo...
                </option>
                {MODEL_GROUPS.map((group) => (
                  <optgroup key={group.brand} label={group.brand}>
                    {group.models.map((m) => (
                      <option
                        key={`${group.brand}::${m.model}`}
                        value={`${group.brand}::${m.model}`}
                      >
                        {m.model}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Resultado */}
            {selected && result && (
              <div className="mt-6 bg-white border-2 border-cyber-blue/30 rounded-xl p-5 shadow-[0_8px_24px_-8px_rgba(0,102,255,0.2)]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                      {selected.brand}
                    </div>
                    <div className="text-display text-xl font-semibold text-navy-900 truncate">
                      {selected.model}
                    </div>
                  </div>
                  <div className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-xs font-mono font-semibold text-cyber-blue">
                    <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full" />
                    {result.tier.label.replace(/^[A-E] — /, '')}
                  </div>
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-gray-600">
                      Valor de troca em assistencia
                    </span>
                    <span className="font-medium text-gray-700">
                      {formatBRLShort(selected.full)}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-700">
                      Voce pagaria
                    </span>
                    <span className="text-display text-2xl font-bold gradient-text">
                      {formatBRLShort(result.finalPrice)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    70% da referencia · cliente final
                  </div>
                </div>

                <TrackedWhatsAppLink
                  phone="5511954369269"
                  message={selected
                    ? `Olá! Vim do site e quero cotar laminação OCA para o ${selected.brand} ${selected.model} (referência de troca em assistência R$ ${formatBRLShort(selected.full).replace('R$', 'R$ ')}).`
                    : WHATSAPP_FALLBACK_MSG}
                  source="catalog_modelo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-circuit-green text-navy-950 font-bold rounded-lg hover:bg-circuit-green-light transition-all shadow-[0_8px_24px_-4px_rgba(0,255,136,0.4)]"
                  ariaLabel="Abrir WhatsApp com este modelo selecionado"
                >
                  <MessageCircle className="w-5 h-5" />
                  Abrir WhatsApp com este modelo
                </TrackedWhatsAppLink>
              </div>
            )}

            {/* Empty state */}
            {!selected && (
              <div className="mt-6 px-4 py-6 bg-white border border-dashed border-gray-300 rounded-xl text-center">
                <p className="text-sm text-gray-500">
                  Escolha acima para ver a faixa e o valor estimado.
                </p>
              </div>
            )}

            {/* Footer: cross-sell lojista (sem mostrar preço) */}
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-cyber-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">
                    <strong className="text-navy-900">Voce e lojista ou assistencia?</strong>{' '}
                    Condicao especial via credenciamento CNPJ.
                  </p>
                  <a
                    href="#form-section"
                    className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-cyber-blue hover:text-cyber-blue-hover transition-colors"
                  >
                    Solicitar credenciamento
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              Card direito: WhatsApp fallback (2 col)
              ============================================================ */}
          <div className="lg:col-span-2 bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-cyber-blue rounded-full opacity-20 blur-[60px] -z-0" />

            <div className="relative flex-1 flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-circuit-green/10 border border-circuit-green/30 rounded-full text-circuit-green text-xs font-mono uppercase tracking-wider mb-5 self-start">
                <ShieldCheck className="w-3 h-3" />
                Atendimento seguro
              </div>

              <h3 className="text-display text-xl font-semibold mb-3 tracking-tight">
                Nao achou seu modelo?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6 flex-1">
                Atendemos tambem modelos fora do catalogo. Manda o modelo do
                aparelho no WhatsApp que respondemos em poucas horas com a
                cotacao exata.
              </p>

              <TrackedWhatsAppLink
                phone="5511954369269"
                message={WHATSAPP_FALLBACK_MSG}
                source="catalog_fallback"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-circuit-green text-navy-950 font-bold rounded-lg hover:bg-circuit-green-light transition-all shadow-[0_8px_24px_-4px_rgba(0,255,136,0.4)]"
                ariaLabel="Abrir WhatsApp para cotação"
              >
                <MessageCircle className="w-5 h-5" />
                Abrir WhatsApp
              </TrackedWhatsAppLink>

              <p className="text-xs text-gray-400 mt-4">
                Seg-Sex · 08h as 18h · Resposta em poucas horas.
              </p>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <strong className="text-white">Cotacao corporativa?</strong>{' '}
                  Catalogo detalhado por modelo e enviado sob solicitacao via
                  WhatsApp ou e-mail para parceiros credenciados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}