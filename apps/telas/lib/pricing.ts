import type { Faixa, Modelo } from './supabase';

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
