/**
 * Tabela individualizada por modelo — Cyber Informatica.
 *
 * Estrutura enxuta para o catalogo (PDF) e para cotacao direta.
 *
 * Campos:
 *   model:    string   — modelo / linha do aparelho
 *   full:     number   — valor de REFERENCIA (troca completa em assistencia
 *                         tecnica: peca + mao de obra). Media de mercado BR 2026.
 *   lojista:  number   — valor que o lojista credenciado paga (35% do full,
 *                         arredondado para final 00/50).
 *
 * Convencao de arredondamento: termina em 00 ou 50 (psicologico e pratico).
 *   < 50  -> 00
 *   50-99 -> 50
 *   100-149 -> 100 (mas se 35% der 105, arredonda pra 100)
 *
 * ATUALIZADO 2026-06-26
 * FONTE: pesquisa web_search assistencias BR + Mercado Livre + Apple/Samsung BR
 */

export interface ModelPrice {
  model: string;
  full: number;
  lojista: number;
}

// ============================================================
// APPLE
// ============================================================
const APPLE_IPHONE: ModelPrice[] = [
  { model: 'iPhone 17 Pro Max',  full: 1300, lojista: 450 },
  { model: 'iPhone 17 Pro',      full: 1170, lojista: 400 },
  { model: 'iPhone 17 Air',      full: 1040, lojista: 350 },
  { model: 'iPhone 17',          full: 910, lojista: 300 },
  { model: 'iPhone 16 Pro Max',  full: 1138, lojista: 400 },
  { model: 'iPhone 16 Pro',      full: 1040, lojista: 350 },
  { model: 'iPhone 16 Plus',     full: 910, lojista: 300 },
  { model: 'iPhone 16',          full: 812, lojista: 300 },
  { model: 'iPhone 15 Pro Max',  full: 975, lojista: 350 },
  { model: 'iPhone 15 Pro',      full: 910, lojista: 300 },
  { model: 'iPhone 15 Plus',     full: 812, lojista: 300 },
  { model: 'iPhone 15',          full: 715, lojista: 250 },
  { model: 'iPhone 14 Pro Max',  full: 942, lojista: 350 },
  { model: 'iPhone 14 Pro',      full: 878, lojista: 300 },
  { model: 'iPhone 14 Plus',     full: 748, lojista: 250 },
  { model: 'iPhone 14',          full: 650, lojista: 250 },
  { model: 'iPhone 13 Pro Max',  full: 812, lojista: 300 },
  { model: 'iPhone 13 Pro',      full: 748, lojista: 250 },
  { model: 'iPhone 13',          full: 552, lojista: 200 },
  { model: 'iPhone 12 Pro Max',  full: 650, lojista: 250 },
  { model: 'iPhone 12 Pro',      full: 585, lojista: 200 },
  { model: 'iPhone 12',          full: 488, lojista: 150 },
  { model: 'iPhone 11 Pro Max',  full: 552, lojista: 200 },
  { model: 'iPhone 11 Pro',      full: 488, lojista: 150 },
  { model: 'iPhone 11',          full: 422, lojista: 150 },
  { model: 'iPhone XS Max',      full: 358, lojista: 150 },
  { model: 'iPhone XS',          full: 325, lojista: 100 },
  { model: 'iPhone XR',          full: 292,  lojista: 100 },
  { model: 'iPhone SE (3a ger)', full: 260,  lojista: 100 },
];

// ============================================================
// SAMSUNG GALAXY S (premium)
// ============================================================
const SAMSUNG_S: ModelPrice[] = [
  { model: 'Galaxy S25 Ultra',    full: 1235, lojista: 450 },
  { model: 'Galaxy S25+',         full: 1040, lojista: 350 },
  { model: 'Galaxy S25',          full: 910, lojista: 300 },
  { model: 'Galaxy S24 Ultra',    full: 910, lojista: 300 },
  { model: 'Galaxy S24+',         full: 715, lojista: 250 },
  { model: 'Galaxy S24',          full: 585, lojista: 200 },
  { model: 'Galaxy S24 FE',       full: 552, lojista: 200 },
  { model: 'Galaxy S23 Ultra',    full: 812, lojista: 300 },
  { model: 'Galaxy S23+',         full: 650, lojista: 250 },
  { model: 'Galaxy S23',          full: 552, lojista: 200 },
  { model: 'Galaxy S23 FE',       full: 488, lojista: 150 },
  { model: 'Galaxy S22 Ultra',    full: 650, lojista: 250 },
  { model: 'Galaxy S22+',         full: 520, lojista: 200 },
  { model: 'Galaxy S22',          full: 488, lojista: 150 },
];

// ============================================================
// SAMSUNG GALAXY A (popular)
// ============================================================
const SAMSUNG_A: ModelPrice[] = [
  { model: 'Galaxy A55',  full: 390, lojista: 150 },
  { model: 'Galaxy A54',  full: 358, lojista: 150 },
  { model: 'Galaxy A35',  full: 276,  lojista: 100 },
  { model: 'Galaxy A34',  full: 260,  lojista: 100 },
  { model: 'Galaxy A25',  full: 228,  lojista: 100 },
  { model: 'Galaxy A24',  full: 211,  lojista: 50 },
  { model: 'Galaxy A15',  full: 211,  lojista: 50 },
  { model: 'Galaxy A14',  full: 195,  lojista: 50 },
  { model: 'Galaxy A05',  full: 162,  lojista: 50 },
];

// ============================================================
// XIAOMI (Redmi + Poco)
// ============================================================
const XIAOMI: ModelPrice[] = [
  { model: 'Redmi Note 14 Pro', full: 358, lojista: 150 },
  { model: 'Redmi Note 14',     full: 228,  lojista: 100 },
  { model: 'Redmi Note 13 Pro', full: 292,  lojista: 100 },
  { model: 'Redmi Note 13',     full: 228,  lojista: 100 },
  { model: 'Redmi 14C',         full: 195,  lojista: 50 },
  { model: 'Redmi 13C',         full: 179,  lojista: 50 },
  { model: 'Poco X6 Pro',       full: 422, lojista: 150 },
  { model: 'Poco X6',           full: 358, lojista: 150 },
  { model: 'Poco X5 Pro',       full: 292,  lojista: 100 },
];

// ============================================================
// MOTOROLA
// ============================================================
const MOTOROLA: ModelPrice[] = [
  { model: 'Moto G84',     full: 292,  lojista: 100 },
  { model: 'Moto G54',     full: 195,  lojista: 50 },
  { model: 'Moto G34',     full: 179,  lojista: 50 },
  { model: 'Moto G24',     full: 162,  lojista: 50 },
  { model: 'Moto G14',     full: 156,  lojista: 50 },
  { model: 'Moto G04',     full: 146,  lojista: 50 },
  { model: 'Edge 50 Pro',  full: 422, lojista: 150 },
  { model: 'Edge 50',      full: 358, lojista: 150 },
  { model: 'Edge 40',      full: 325, lojista: 100 },
];

// ============================================================
// GOOGLE PIXEL
// ============================================================
const GOOGLE: ModelPrice[] = [
  { model: 'Pixel 9 Pro XL', full: 878, lojista: 300 },
  { model: 'Pixel 9 Pro',    full: 780, lojista: 250 },
  { model: 'Pixel 9',        full: 585, lojista: 200 },
  { model: 'Pixel 8 Pro',    full: 748, lojista: 250 },
  { model: 'Pixel 8',        full: 488, lojista: 150 },
  { model: 'Pixel 8a',       full: 358, lojista: 150 },
];

// ============================================================
// Agrupamento final — usado pelo catalogo PDF e pelo site
// ============================================================

export interface ModelGroup {
  /** Marca exibida no catalogo (ex: 'Apple') */
  brand: string;
  /** Lista de modelos da marca */
  models: ModelPrice[];
}

export const MODEL_GROUPS: ModelGroup[] = [
  { brand: 'Apple',          models: APPLE_IPHONE },
  { brand: 'Samsung Galaxy S', models: SAMSUNG_S },
  { brand: 'Samsung Galaxy A', models: SAMSUNG_A },
  { brand: 'Xiaomi',         models: XIAOMI },
  { brand: 'Motorola',       models: MOTOROLA },
  { brand: 'Google Pixel',   models: GOOGLE },
];

/** Total de modelos catalogados */
export const TOTAL_MODELS = MODEL_GROUPS.reduce(
  (sum, g) => sum + g.models.length,
  0,
);

/**
 * Helper: formata valor em BRL (sem centavos).
 */
export function formatBRLShort(v: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(v);
}