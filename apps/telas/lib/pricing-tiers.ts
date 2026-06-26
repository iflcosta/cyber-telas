/**
 * Estratégia de preços Cyber Informática — 3 níveis × 5 faixas.
 *
 * REFERÊNCIA: "valor de troca completa em assistência técnica"
 *   = preço médio de mercado que o cliente pagaria para trocar a tela inteira
 *     (peça: vidro + display) + mão de obra em uma assistência.
 *   = média entre Apple/Samsung oficial e compatível premium nacional.
 *
 * CÁLCULO:
 *   Cliente final     = 70% do valor de referência
 *   Lojista           = 35% do valor de referência
 *   Lojista Premium   = 25% do valor de referência (curadoria do Iago)
 *
 * ESCOPO DO PREÇO:
 *   Cobre o serviço COMPLETO de laminação OCA — não inclui peça nova avulsa.
 *   O cliente/lojista traz o display danificado, a Cyber lamina e devolve.
 *   Para B2C, o WhatsApp inclui cotação integral (peça + serviço) se necessário.
 *
 * ATUALIZAÇÃO: 2026-06-26 (reboot dual-persona)
 * FONTE: pesquisa de mercado web_search (assistências técnicas BR + ML)
 */

export type CustomerLevel = 'final' | 'lojista' | 'lojista-premium';

export interface PricingTier {
  /** ID interno — usado como anchor / chave de iteração */
  id: string;
  /** Label visível — exibido em site e PDF */
  label: string;
  /** Tagline da faixa (1 linha) */
  tagline: string;
  /** Faixa de referência (preço de troca completa em assistência) */
  refMin: number;
  refMax: number; // Infinity = sem teto
  /** Modelos de exemplo — exibidos APENAS no PDF (lojista) */
  examples: TierExample[];
}

export interface TierExample {
  /** Modelo / linha (sem marca se for exibido no site, com marca no PDF) */
  model: string;
  /** Valor de referência usado no cálculo (troca completa em assistência) */
  refPrice: number;
}

// ============================================================
// 5 FAIXAS — baseadas em valor de referência (troca completa em assistência)
// ============================================================

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'entrada',
    label: 'A — Entrada',
    tagline: 'Smartphones de entrada e modelos antigos',
    refMin: 0,
    refMax: 700,
    examples: [
      { model: 'Galaxy A15 / A25',          refPrice: 650 },
      { model: 'Moto G54 / G04',            refPrice: 600 },
      { model: 'Redmi Note 13 / 14',        refPrice: 650 },
      { model: 'iPhone 11 / XR',            refPrice: 700 },
    ],
  },
  {
    id: 'intermediario',
    label: 'B — Intermediário',
    tagline: 'Linhas médias premium',
    refMin: 700,
    refMax: 1500,
    examples: [
      { model: 'Galaxy A35 / A55',          refPrice: 1200 },
      { model: 'Moto G84 / Edge 40',        refPrice: 1000 },
      { model: 'Redmi Note 13 Pro / 14 Pro',refPrice: 1100 },
      { model: 'iPhone 12 / 13',            refPrice: 1500 },
    ],
  },
  {
    id: 'premium',
    label: 'C — Premium',
    tagline: 'Linhas premium e flagships de geração anterior',
    refMin: 1500,
    refMax: 2500,
    examples: [
      { model: 'Galaxy S23 / S24 / S24 FE', refPrice: 1800 },
      { model: 'Galaxy S24+',               refPrice: 2200 },
      { model: 'iPhone 14 / 14 Pro',        refPrice: 2500 },
      { model: 'iPhone 15',                 refPrice: 2000 },
    ],
  },
  {
    id: 'top',
    label: 'D — Top',
    tagline: 'Flagships atuais',
    refMin: 2500,
    refMax: 3500,
    examples: [
      { model: 'Galaxy S24 Ultra',          refPrice: 2800 },
      { model: 'iPhone 15 Pro',             refPrice: 2800 },
      { model: 'iPhone 14 Pro Max',         refPrice: 3000 },
      { model: 'Pixel 8 Pro / 9 Pro',       refPrice: 2700 },
    ],
  },
  {
    id: 'flagship',
    label: 'E — Flagship',
    tagline: 'Topo de linha e lançamentos',
    refMin: 3500,
    refMax: Number.POSITIVE_INFINITY,
    examples: [
      { model: 'iPhone 16 Pro Max / 15 Pro Max', refPrice: 3500 },
      { model: 'iPhone 16 Pro',             refPrice: 3300 },
      { model: 'Galaxy S25 Ultra',          refPrice: 3700 },
      { model: 'Galaxy Z Fold / Flip (top)',refPrice: 4000 },
    ],
  },
];

// ============================================================
// MULTIPLICADORES (regra de negócio)
// ============================================================

export const PRICE_MULTIPLIERS: Record<CustomerLevel, number> = {
  'final':         0.70,
  'lojista':       0.35,
  'lojista-premium': 0.25,
};

export const CUSTOMER_LEVEL_LABELS: Record<CustomerLevel, string> = {
  'final':           'Cliente Final',
  'lojista':         'Lojista',
  'lojista-premium': 'Lojista Premium',
};

export const CUSTOMER_LEVEL_DESCRIPTIONS: Record<CustomerLevel, string> = {
  'final':           'Pessoa física — cota\u00e7\u00e3o direta via WhatsApp.',
  'lojista':         'Assist\u00eancias e lojistas credenciados (CNPJ).',
  'lojista-premium': 'Parceiros estrat\u00e9gicos (curadoria interna).',
};

// ============================================================
// FUNÇÕES DE CÁLCULO
// ============================================================

/**
 * Calcula o preço para um nível de cliente a partir de um valor de referência.
 */
export function calcularPrecoTier(
  refPrice: number,
  level: CustomerLevel,
): number {
  return Math.round(refPrice * PRICE_MULTIPLIERS[level]);
}

/**
 * Retorna a faixa (tier) que contém um valor de referência.
 */
export function findTier(refPrice: number): PricingTier | undefined {
  return PRICING_TIERS.find(
    (t) => refPrice >= t.refMin && refPrice < t.refMax,
  );
}

/**
 * Formata uma faixa de preço (ex: "R$ 350–R$ 700" ou "R$ 2.450+").
 */
export function formatPriceRange(refMin: number, refMax: number): string {
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(v);
  if (!isFinite(refMax)) return `${fmt(refMin)}+`;
  if (refMin === 0) return `at\u00e9 ${fmt(refMax)}`;
  return `${fmt(refMin)}\u2013${fmt(refMax)}`;
}