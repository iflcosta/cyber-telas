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
  { model: 'iPhone 17 Pro Max',  full: 4000, lojista: 1500 },
  { model: 'iPhone 17 Pro',      full: 3600, lojista: 1250 },
  { model: 'iPhone 17 Air',      full: 3200, lojista: 1100 },
  { model: 'iPhone 17',          full: 2800, lojista: 1000 },
  { model: 'iPhone 16 Pro Max',  full: 3500, lojista: 1200 },
  { model: 'iPhone 16 Pro',      full: 3200, lojista: 1100 },
  { model: 'iPhone 16 Plus',     full: 2800, lojista: 1000 },
  { model: 'iPhone 16',          full: 2500, lojista: 900 },
  { model: 'iPhone 15 Pro Max',  full: 3000, lojista: 1050 },
  { model: 'iPhone 15 Pro',      full: 2800, lojista: 1000 },
  { model: 'iPhone 15 Plus',     full: 2500, lojista: 900 },
  { model: 'iPhone 15',          full: 2200, lojista: 750 },
  { model: 'iPhone 14 Pro Max',  full: 2900, lojista: 1000 },
  { model: 'iPhone 14 Pro',      full: 2700, lojista: 950 },
  { model: 'iPhone 14 Plus',     full: 2300, lojista: 800 },
  { model: 'iPhone 14',          full: 2000, lojista: 700 },
  { model: 'iPhone 13 Pro Max',  full: 2500, lojista: 900 },
  { model: 'iPhone 13 Pro',      full: 2300, lojista: 800 },
  { model: 'iPhone 13',          full: 1700, lojista: 600 },
  { model: 'iPhone 12 Pro Max',  full: 2000, lojista: 700 },
  { model: 'iPhone 12 Pro',      full: 1800, lojista: 650 },
  { model: 'iPhone 12',          full: 1500, lojista: 500 },
  { model: 'iPhone 11 Pro Max',  full: 1700, lojista: 600 },
  { model: 'iPhone 11 Pro',      full: 1500, lojista: 500 },
  { model: 'iPhone 11',          full: 1300, lojista: 450 },
  { model: 'iPhone XS Max',      full: 1100, lojista: 400 },
  { model: 'iPhone XS',          full: 1000, lojista: 350 },
  { model: 'iPhone XR',          full: 900,  lojista: 300 },
  { model: 'iPhone SE (3a ger)', full: 800,  lojista: 300 },
];

// ============================================================
// SAMSUNG GALAXY S (premium)
// ============================================================
const SAMSUNG_S: ModelPrice[] = [
  { model: 'Galaxy S25 Ultra',    full: 3800, lojista: 1350 },
  { model: 'Galaxy S25+',         full: 3200, lojista: 1100 },
  { model: 'Galaxy S25',          full: 2800, lojista: 1000 },
  { model: 'Galaxy S24 Ultra',    full: 2800, lojista: 1000 },
  { model: 'Galaxy S24+',         full: 2200, lojista: 750 },
  { model: 'Galaxy S24',          full: 1800, lojista: 650 },
  { model: 'Galaxy S24 FE',       full: 1700, lojista: 600 },
  { model: 'Galaxy S23 Ultra',    full: 2500, lojista: 900 },
  { model: 'Galaxy S23+',         full: 2000, lojista: 700 },
  { model: 'Galaxy S23',          full: 1700, lojista: 600 },
  { model: 'Galaxy S23 FE',       full: 1500, lojista: 500 },
  { model: 'Galaxy S22 Ultra',    full: 2000, lojista: 700 },
  { model: 'Galaxy S22+',         full: 1600, lojista: 550 },
  { model: 'Galaxy S22',          full: 1500, lojista: 500 },
];

// ============================================================
// SAMSUNG GALAXY A (popular)
// ============================================================
const SAMSUNG_A: ModelPrice[] = [
  { model: 'Galaxy A55',  full: 1200, lojista: 400 },
  { model: 'Galaxy A54',  full: 1100, lojista: 400 },
  { model: 'Galaxy A35',  full: 850,  lojista: 300 },
  { model: 'Galaxy A34',  full: 800,  lojista: 300 },
  { model: 'Galaxy A25',  full: 700,  lojista: 250 },
  { model: 'Galaxy A24',  full: 650,  lojista: 250 },
  { model: 'Galaxy A15',  full: 650,  lojista: 250 },
  { model: 'Galaxy A14',  full: 600,  lojista: 200 },
  { model: 'Galaxy A05',  full: 500,  lojista: 175 },
];

// ============================================================
// XIAOMI (Redmi + Poco)
// ============================================================
const XIAOMI: ModelPrice[] = [
  { model: 'Redmi Note 14 Pro', full: 1100, lojista: 400 },
  { model: 'Redmi Note 14',     full: 700,  lojista: 250 },
  { model: 'Redmi Note 13 Pro', full: 900,  lojista: 300 },
  { model: 'Redmi Note 13',     full: 700,  lojista: 250 },
  { model: 'Redmi 14C',         full: 600,  lojista: 200 },
  { model: 'Redmi 13C',         full: 550,  lojista: 200 },
  { model: 'Poco X6 Pro',       full: 1300, lojista: 450 },
  { model: 'Poco X6',           full: 1100, lojista: 400 },
  { model: 'Poco X5 Pro',       full: 900,  lojista: 300 },
];

// ============================================================
// MOTOROLA
// ============================================================
const MOTOROLA: ModelPrice[] = [
  { model: 'Moto G84',     full: 900,  lojista: 300 },
  { model: 'Moto G54',     full: 600,  lojista: 200 },
  { model: 'Moto G34',     full: 550,  lojista: 200 },
  { model: 'Moto G24',     full: 500,  lojista: 175 },
  { model: 'Moto G14',     full: 480,  lojista: 175 },
  { model: 'Moto G04',     full: 450,  lojista: 150 },
  { model: 'Edge 50 Pro',  full: 1300, lojista: 450 },
  { model: 'Edge 50',      full: 1100, lojista: 400 },
  { model: 'Edge 40',      full: 1000, lojista: 350 },
];

// ============================================================
// GOOGLE PIXEL
// ============================================================
const GOOGLE: ModelPrice[] = [
  { model: 'Pixel 9 Pro XL', full: 2700, lojista: 950 },
  { model: 'Pixel 9 Pro',    full: 2400, lojista: 850 },
  { model: 'Pixel 9',        full: 1800, lojista: 650 },
  { model: 'Pixel 8 Pro',    full: 2300, lojista: 800 },
  { model: 'Pixel 8',        full: 1500, lojista: 500 },
  { model: 'Pixel 8a',       full: 1100, lojista: 400 },
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