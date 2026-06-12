/**
 * Supabase BROWSER client
 * Use em Client Components ('use client')
 * Seguro importar aqui — não tem next/headers
 */
import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createBrowserClient(url, key);
}

// ============================================
// Tipos compartilhados (server + client)
// ============================================
export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  razao_social: string;
  cnpj: string;
  email: string;
  telefone: string;
  volume_semanal: '1-10' | '11-50' | '51-100' | '101-500' | '500+';
  marca: 'apple' | 'samsung' | 'xiaomi' | 'motorola' | 'outros';
  modelo_display: string;
  valor_display_novo: number;
  preco_servico: number;
  faixa_aplicada: string;
  ip_origem?: string;
  user_agent?: string;
  status: 'novo' | 'contatado' | 'qualificado' | 'cliente' | 'recusado';
  observacoes?: string;
  assigned_to?: string;
};

export type Modelo = {
  id: string;
  marca: string;
  modelo: string;
  valor_display_novo: number;
  ativo: boolean;
};

export type Faixa = {
  min: number;
  max: number;
  preco: number;
  label: string;
};

export type Cotacao = {
  id: string;
  created_at: string;
  marca: string;
  modelo: string;
  valor_display_novo: number;
  preco_servico: number;
  faixa_aplicada: string;
};
