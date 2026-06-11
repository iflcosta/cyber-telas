import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ============================================
// Cliente Supabase para uso SERVER-SIDE
// (com service_role_key - NUNCA expor ao cliente)
// ============================================
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// ============================================
// Cliente Supabase para uso SERVER-SIDE com cookies
// (para Server Components e Route Handlers autenticados)
// ============================================
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Component não pode setar cookies
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Server Component não pode remover cookies
          }
        },
      },
    }
  );
}

// ============================================
// Cliente Supabase para uso CLIENT-SIDE
// (componentes client, eventos do usuário)
// ============================================
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ============================================
// Tipos compartilhados
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
