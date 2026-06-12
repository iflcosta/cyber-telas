import type { Faixa, Modelo } from './supabase-client';

export type { Faixa };

// ============================================
// Cálculo de preço baseado em faixas
// ============================================

/**
 * Calcula o preço do serviço de laminação baseado no valor do display novo
 */
export function calcularPreco(valorDisplay: number, faixas: Faixa[]): {
  preco: number;
  faixa: Faixa;
} {
  for (const faixa of faixas) {
    if (valorDisplay >= faixa.min && valorDisplay < faixa.max) {
      return { preco: faixa.preco, faixa };
    }
  }
  // Fallback: última faixa
  const ultima = faixas[faixas.length - 1];
  return { preco: ultima.preco, faixa: ultima };
}

/**
 * Formata valor em BRL
 */
export function formatBRL(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

/**
 * Faz o parse de uma string de valor monetário em BRL para número.
 *
 * Aceita:
 *   "1500"       → 1500
 *   "1500,50"    → 1500.5
 *   "1.500"      → 1500
 *   "1.500,00"   → 1500
 *   "1.500,99"   → 1500.99
 *
 * Difere de `parseFloat(str.replace(/\D/g, ''))` que converteria
 * "1.500,00" em 150000 (R$ 150.000 — cairia em faixa errada).
 *
 * @returns número em reais, ou 0 se a string for vazia/inválida.
 */
export function parseBRL(str: string | null | undefined): number {
  if (!str) return 0;
  const cleaned = String(str).trim();
  if (cleaned === '') return 0;

  // Se tem vírgula, é o separador decimal BR: remove pontos (milhares) e troca vírgula por ponto
  if (cleaned.includes(',')) {
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  // Sem vírgula: pode ter pontos como separador de milhar OU ser número puro.
  // Heurística: se tem 2+ pontos OU o último grupo tem exatamente 3 dígitos,
  // trata pontos como separador de milhar. Caso contrário, pode ser decimal.
  const pontos = cleaned.match(/\./g) || [];
  if (pontos.length > 1) {
    const n = parseFloat(cleaned.replace(/\./g, ''));
    return Number.isFinite(n) ? n : 0;
  }
  if (pontos.length === 1) {
    const partes = cleaned.split('.');
    // "1.500" → milhar. "1500.5" → decimal.
    if (partes[1] && partes[1].length === 3) {
      const n = parseFloat(cleaned.replace(/\./g, ''));
      return Number.isFinite(n) ? n : 0;
    }
  }
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Agrupa modelos por marca para autocomplete
 */
export function agruparPorMarca(modelos: Modelo[]): Record<string, Modelo[]> {
  return modelos.reduce((acc, m) => {
    if (!acc[m.marca]) acc[m.marca] = [];
    acc[m.marca].push(m);
    return acc;
  }, {} as Record<string, Modelo[]>);
}

/**
 * Lista as marcas disponíveis
 */
export const MARCAS = [
  { id: 'apple', label: 'Apple', emoji: '' },
  { id: 'samsung', label: 'Samsung', emoji: '' },
  { id: 'xiaomi', label: 'Xiaomi', emoji: '' },
  { id: 'motorola', label: 'Motorola', emoji: '' },
  { id: 'outros', label: 'Outros', emoji: '⋯' },
] as const;

export type MarcaId = typeof MARCAS[number]['id'];

/**
 * Faixas padrão (fallback se o Supabase falhar)
 */
export const FAIXAS_PADRAO: Faixa[] = [
  { min: 0, max: 500, preco: 80, label: 'Econômico' },
  { min: 500, max: 1000, preco: 120, label: 'Intermediário' },
  { min: 1000, max: 2000, preco: 180, label: 'Premium' },
  { min: 2000, max: 3500, preco: 250, label: 'Top' },
  { min: 3500, max: 999999, preco: 320, label: 'Flagship' },
];
