import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: any = {
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET (' + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...)' : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (eyJ...)' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET (eyJ...)' : 'MISSING',
    },
    client: null,
    query: null,
    error: null,
  };

  const supabase = createAdminClient();
  checks.client = supabase ? 'CREATED' : 'NULL (env vars missing?)';

  if (supabase) {
    try {
      const { data, error, count } = await supabase
        .from('modelos_preco')
        .select('marca, modelo, valor_display_novo, ativo', { count: 'exact' })
        .eq('ativo', true)
        .limit(5);

      checks.query = {
        success: !error,
        returned: data?.length ?? 0,
        total_count: count,
        first_3: data?.slice(0, 3),
        error: error?.message ?? null,
      };
    } catch (e: any) {
      checks.error = String(e);
    }
  }

  return NextResponse.json(checks, { status: 200 });
}
