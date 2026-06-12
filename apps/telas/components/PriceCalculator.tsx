'use client';

import { useState, useMemo, useEffect } from 'react';
import { MARCAS, type MarcaId, type Faixa, formatBRL, parseBRL, calcularPreco, FAIXAS_PADRAO } from '@/lib/pricing';
import { createBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Modelo } from '@/lib/supabase-client';
import { Phone } from 'lucide-react';

type ModelosPorMarca = Record<string, Modelo[]>;

export default function PriceCalculator({
  modelosPorMarca: initialModelosPorMarca,
}: {
  modelosPorMarca: ModelosPorMarca;
}) {
  const [marcaSelecionada, setMarcaSelecionada] = useState<MarcaId | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = useState<Modelo | null>(null);
  const [valorCustom, setValorCustom] = useState<string>('');
  const [faixas, setFaixas] = useState<Faixa[]>(FAIXAS_PADRAO);

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  // Carregar faixas do Supabase após a primeira renderização.
  // useEffect (não useState com side-effect) — roda só no client, uma vez,
  // e respeita StrictMode sem causar double-fetch problemático.
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('configuracao_precos')
          .select('faixas')
          .eq('id', 1)
          .eq('ativo', true)
          .single();
        if (!cancelled && data?.faixas) {
          setFaixas(data.faixas as Faixa[]);
        }
      } catch {
        // Silencia erro: mantém FAIXAS_PADRAO em uso
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const modelosFiltrados = useMemo(() => {
    if (!marcaSelecionada) return [];
    return initialModelosPorMarca[marcaSelecionada] || [];
  }, [marcaSelecionada, initialModelosPorMarca]);

  const valorDisplay = useMemo(() => {
    if (modeloSelecionado) return modeloSelecionado.valor_display_novo;
    // parseBRL entende "1500", "1500,50", "1.500,00" etc.
    return parseBRL(valorCustom);
  }, [modeloSelecionado, valorCustom]);

  const cotacao = useMemo(() => {
    // Bloqueia valores <= 0: evita que um input vazio, zero ou negativo
    // caia no fallback "última faixa" (Flagship) do calcularPreco.
    if (valorDisplay <= 0) return null;
    return calcularPreco(valorDisplay, faixas);
  }, [valorDisplay, faixas]);

  return (
    <section
      id="price-calculator"
      className="section bg-navy-900 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 to-navy-900" />

      <div className="container relative">
        <div className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Cotação Rápida</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
            Calcule o preço do seu modelo
          </h2>
          <p className="section-description text-lg text-gray-300">
            Veja em tempo real quanto vai custar a laminação OCA do display do seu modelo.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-navy-950/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
          {/* 1. Selecionar Marca */}
          <div className="mb-6">
            <label className="form-label">
              1. Selecione a Marca <span className="required">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-3">
              {MARCAS.map((marca) => (
                <button
                  key={marca.id}
                  type="button"
                  onClick={() => {
                    setMarcaSelecionada(marca.id);
                    setModeloSelecionado(null);
                    setValorCustom('');
                  }}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    marcaSelecionada === marca.id
                      ? 'bg-gradient-to-br from-cyber-blue to-cyber-blue-hover text-white shadow-[0_4px_14px_rgba(0,102,255,0.4)]'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {marca.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Selecionar Modelo */}
          {marcaSelecionada && (
            <div className="mb-6">
              <label className="form-label">
                2. Modelo do Display
              </label>
              <input
                type="text"
                list="modelos-datalist"
                placeholder="Digite ou selecione abaixo"
                className="form-input mt-2"
                value={modeloSelecionado?.modelo || ''}
                onChange={(e) => {
                  const modelo = modelosFiltrados.find((m) => m.modelo === e.target.value);
                  if (modelo) {
                    setModeloSelecionado(modelo);
                    setValorCustom('');
                  }
                }}
              />
              <datalist id="modelos-datalist">
                {modelosFiltrados.map((m) => (
                  <option key={m.id} value={m.modelo}>
                    {formatBRL(m.valor_display_novo)}
                  </option>
                ))}
              </datalist>

              {/* Quickpicks: top 6 modelos mais populares da marca */}
              <div className="flex flex-wrap gap-2 mt-3">
                {modelosFiltrados.slice(0, 6).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setModeloSelecionado(m);
                      setValorCustom('');
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      modeloSelecionado?.id === m.id
                        ? 'bg-circuit-green/20 border border-circuit-green text-circuit-green'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {m.modelo}
                  </button>
                ))}
              </div>

              {/* Valor customizado */}
              <div className="mt-4">
                <label className="text-xs text-gray-400 mb-2 block">
                  Ou informe o valor do display novo (se não encontrar o modelo):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                  <input
                    type="text"
                    placeholder="0,00"
                    className="form-input pl-9"
                    value={valorCustom}
                    onChange={(e) => {
                      setModeloSelecionado(null);
                      setValorCustom(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Resultado */}
          {cotacao && (
            <div className="mt-6 bg-gradient-to-br from-cyber-blue/10 to-circuit-green/5 border border-cyber-blue/30 rounded-xl p-6 animate-fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Modelo</div>
                  <div className="font-semibold text-sm">
                    {modeloSelecionado?.modelo || 'Valor personalizado'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Valor do display</div>
                  <div className="font-mono font-semibold text-sm">
                    {formatBRL(valorDisplay)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Faixa aplicada</div>
                  <div className="font-semibold text-sm text-cyber-blue-light">
                    {cotacao.faixa.label}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-gray-400 mb-1">Preço do serviço de laminação</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-display text-5xl font-bold gradient-text">
                    {formatBRL(cotacao.preco)}
                  </div>
                  <span className="text-sm text-gray-400">por unidade</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/5 rounded-lg flex gap-2 text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-circuit-green flex-shrink-0 mt-0.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  Tabela completa restrita a lojistas cadastrados. Valores podem variar conforme volume mensal.
                </span>
              </div>
            </div>
          )}

          {/* CTA WhatsApp */}
          {cotacao && (
            <a
              href="https://wa.me/5511954369269?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20lamina%C3%A7%C3%A3o%20de%20display."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center mt-6"
            >
              <Phone className="w-4 h-4" />
              Falar com especialista no WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
