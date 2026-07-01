/**
 * Estratégia de preços Cyber Informática — 2 níveis públicos × 5 faixas.
 *
 * REFERÊNCIA: "valor de troca completa em assistência técnica"
 *   = preço médio de mercado que o cliente pagaria para trocar a tela inteira
 *     (peça: vidro + display) + mão de obra em uma assistência.
 *   = média entre Apple/Samsung oficial e compatível premium nacional.
 *
 * CÁLCULO:
 *   Cliente final     = 70% do valor de referência
 *   Lojista           = 35% do valor de referência
 *
 * (Tier "Premium" / "Lojista Premium" removido em 2026-07-01 — simplificação
 *  de pricing público. Curadoria estratégica continua via análise CNPJ direta.)
 *
 * ESCOPO DO PREÇO:
 *   Cobre o serviço COMPLETO de laminação OCA — não inclui peça nova avulsa.
 *   O cliente/lojista traz o display danificado, a Cyber lamina e devolve.
 *   Para B2C, o WhatsApp inclui cotação integral (peça + serviço) se necessário.
 *
 * ATUALIZAÇÃO: 2026-07-01 (reestruturação 0.325 — 76 modelos recalibrados)
 * FONTE: pesquisa de mercado web_search (assistências técnicas BR + ML)
 */

export type CustomerLevel = 'final' | 'lojista';

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
    refMax: 250,
    examples: [
      { model: 'Galaxy A15 / A25',          refPrice: 211 },
      { model: 'Moto G54 / G04',            refPrice: 195 },
      { model: 'Redmi Note 13 / 14',        refPrice: 228 },
      { model: 'iPhone 11 / XR',            refPrice: 228 },
    ],
  },
  {
    id: 'intermediario',
    label: 'B — Intermediário',
    tagline: 'Linhas médias premium',
    refMin: 250,
    refMax: 500,
    examples: [
      { model: 'Galaxy A35 / A55',          refPrice: 390 },
      { model: 'Moto G84 / Edge 40',        refPrice: 325 },
      { model: 'Redmi Note 13 Pro / 14 Pro',refPrice: 358 },
      { model: 'iPhone 12 / 13',            refPrice: 488 },
    ],
  },
  {
    id: 'premium',
    label: 'C — Premium',
    tagline: 'Linhas premium e flagships de geração anterior',
    refMin: 500,
    refMax: 750,
    examples: [
      { model: 'Galaxy S23 / S24 / S24 FE', refPrice: 585 },
      { model: 'Galaxy S24+',               refPrice: 715 },
      { model: 'iPhone 14 / 14 Pro',        refPrice: 650 },
      { model: 'iPhone 15',                 refPrice: 715 },
    ],
  },
  {
    id: 'top',
    label: 'D — Top',
    tagline: 'Flagships atuais',
    refMin: 750,
    refMax: 1000,
    examples: [
      { model: 'Galaxy S24 Ultra',          refPrice: 910 },
      { model: 'iPhone 15 Pro',             refPrice: 910 },
      { model: 'iPhone 14 Pro Max',         refPrice: 942 },
      { model: 'Pixel 8 Pro / 9 Pro',       refPrice: 878 },
    ],
  },
  {
    id: 'flagship',
    label: 'E — Flagship',
    tagline: 'Topo de linha e lançamentos',
    refMin: 1000,
    refMax: Number.POSITIVE_INFINITY,
    examples: [
      { model: 'iPhone 16 Pro Max / 15 Pro Max', refPrice: 1138 },
      { model: 'iPhone 16 Pro',             refPrice: 1040 },
      { model: 'Galaxy S25 Ultra',          refPrice: 1235 },
      { model: 'iPhone 17 Pro Max',         refPrice: 1300 },
    ],
  },
];

// ============================================================
// MULTIPLICADORES (regra de negócio)
// ============================================================

export const PRICE_MULTIPLIERS: Record<CustomerLevel, number> = {
  'final':         0.70,
  'lojista':       0.35,
};

export const CUSTOMER_LEVEL_LABELS: Record<CustomerLevel, string> = {
  'final':           'Cliente Final',
  'lojista':         'Lojista',
};

export const CUSTOMER_LEVEL_DESCRIPTIONS: Record<CustomerLevel, string> = {
  'final':           'Pessoa física — cota\u00e7\u00e3o direta via WhatsApp.',
  'lojista':         'Assist\u00eancias e lojistas credenciados (CNPJ).',
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