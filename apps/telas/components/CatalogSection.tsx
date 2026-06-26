'use client';

// ============================================
// CatalogSection — CTA para download do catalogo .pdf
// + explicacao dos 3 niveis de preco (cliente final / lojista / premium).
//
// Regra: tabela de precos detalhada NAO fica no site.
// Lojistas e assistencias baixam o PDF. Pessoas fisicas usam WhatsApp.
// ============================================

import { FileText, Download, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import {
  PRICING_TIERS,
  CUSTOMER_LEVEL_DESCRIPTIONS,
  formatPriceRange,
  calcularPrecoTier,
} from '@/lib/pricing-tiers';

const WHATSAPP_URL =
  'https://wa.me/5511954369269?text=Ol%C3%A1!%20Vim%20do%20site%20e%20quero%20receber%20o%20cat%C3%A1logo%20de%20lamina%C3%A7%C3%A3o%20OCA.';

const PDF_URL = '/catalogo-cyber.pdf';

const FAQ = [
  {
    q: 'Como funciona o preco?',
    a: 'Calculamos como um percentual do que voce pagaria pela troca completa da tela em uma assistencia (peca + mao de obra). Cliente final paga 70%, lojista credenciado 35% e parceiro premium 25%.',
  },
  {
    q: 'O que esta incluso no preco?',
    a: 'O servico completo de laminacao OCA do display do cliente (recuperacao da tela original). NAO inclui peca nova avulsa — o display danificado e devolvido laminado, com o vidro novo e o display original preservado.',
  },
  {
    q: 'Como o lojista se credencia?',
    a: 'Preenchimento do formulario no site (CNPJ, razao social, volume medio semanal). Analise em ate 24h uteis. Acesso ao portal do parceiro com tabela atualizada e suporte dedicado.',
  },
  {
    q: 'O que diferencia um Lojista Premium?',
    a: 'E uma condicao concedida por curadoria da Cyber Informatica a parceiros estrategicos com historico de volume e alinhamento comercial. O criterio e revisado periodicamente.',
  },
];

export default function CatalogSection() {
  return (
    <section id="catalog" className="section bg-white">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Catalogo Tecnico</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Catalogo, Tabela Atacadista e FAQ
          </h2>
          <p className="section-description text-lg text-gray-600">
            Tabela completa por modelo, prazos de processamento, condicoes comerciais
            e respostas para as duvidas mais frequentes — tudo em um unico PDF.
          </p>
        </div>

        {/* ============================================================
            Os 3 niveis de preco — resumo visual para o site
            ============================================================ */}
        <div className="max-w-5xl mx-auto mb-12">
          <h3 className="text-display text-xl font-semibold text-navy-900 mb-4 text-center">
            Tres perfis, tres precos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-mono uppercase tracking-wider mb-4 text-gray-700">
                Cliente Final
              </div>
              <div className="text-display text-3xl font-bold text-navy-900 mb-1">
                70%
              </div>
              <div className="text-sm text-gray-500 mb-3">
                da troca completa em assistencia
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {CUSTOMER_LEVEL_DESCRIPTIONS['final']} Voce traz a tela
                danificada, a gente lamina e devolve em 5–10 dias uteis.
              </p>
            </div>

            <div className="bg-cyber-blue/[0.04] border-2 border-cyber-blue/30 rounded-2xl p-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-xs font-mono uppercase tracking-wider mb-4 text-cyber-blue">
                Lojista
              </div>
              <div className="text-display text-3xl font-bold text-cyber-blue mb-1">
                35%
              </div>
              <div className="text-sm text-gray-500 mb-3">
                da troca completa em assistencia
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {CUSTOMER_LEVEL_DESCRIPTIONS['lojista']} Compra em lote,
                revende com margem agressiva. Credenciamento gratuito.
              </p>
            </div>

            <div className="bg-circuit-green/[0.06] border-2 border-circuit-green/40 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-circuit-green/10 rounded-full blur-2xl -z-0" />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-circuit-green/15 border border-circuit-green/40 rounded-full text-xs font-mono uppercase tracking-wider mb-4 text-circuit-green-dark">
                  <Sparkles className="w-3 h-3" />
                  Lojista Premium
                </div>
                <div className="text-display text-3xl font-bold text-circuit-green-dark mb-1">
                  25%
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  da troca completa em assistencia
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {CUSTOMER_LEVEL_DESCRIPTIONS['lojista-premium']} Melhor
                  preco da tabela, condicao concedida por curadoria.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            Cards de download + WhatsApp
            ============================================================ */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch mb-12">
          {/* Card esquerdo: download PDF */}
          <div className="md:col-span-3 bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-cyber-blue rounded-full opacity-20 blur-[60px] -z-0" />

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-circuit-green/10 border border-circuit-green/30 rounded-full text-circuit-green text-xs font-mono uppercase tracking-wider mb-5">
                <ShieldCheck className="w-3 h-3" />
                Exclusivo CNPJ
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 flex-shrink-0 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-circuit-green" />
                </div>
                <div>
                  <h3 className="text-display text-2xl font-semibold mb-2 tracking-tight">
                    Baixar Catalogo Completo
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    PDF com tabela de precos detalhada por modelo (5 faixas x 3
                    niveis), credenciais tecnicas, logistica, condicoes comerciais
                    e processo de credenciamento.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={PDF_URL}
                  download
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-circuit-green text-navy-950 font-bold rounded-lg hover:bg-circuit-green-light transition-all shadow-[0_8px_24px_-4px_rgba(0,255,136,0.4)]"
                >
                  <Download className="w-5 h-5" />
                  Baixar Catalogo (.pdf)
                </a>
                <a
                  href="#form-section"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/15 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-circuit-green transition-all"
                >
                  Solicitar Credenciamento
                </a>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Catalogo enviado em formato PDF · Sem custo · Credenciamento
                sujeito a analise de CNPJ em ate 24h uteis.
              </p>
            </div>
          </div>

          {/* Card direito: WhatsApp */}
          <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-cyber-blue text-xs font-mono uppercase tracking-wider mb-5 self-start">
              <MessageCircle className="w-3 h-3" />
              Atendimento Direto
            </div>

            <h3 className="text-display text-xl font-semibold text-navy-900 mb-2 tracking-tight">
              Quer falar com a gente?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
              Lojistas, assistencias tecnicas ou pessoas fisicas — nossa equipe
              responde em horario comercial e tira duvidas sobre
              credenciamento, prazos e cotacao para o seu aparelho.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-cyber-blue text-white font-semibold rounded-lg hover:bg-cyber-blue-hover transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Abrir WhatsApp
            </a>

            <p className="text-xs text-gray-500 mt-4">
              Seg-Sex · 08h as 18h · Resposta em poucas horas.
            </p>
          </div>
        </div>

        {/* ============================================================
            Mini-resumo das 5 faixas (sem marcas) para o cliente final
            saber em qual faixa o aparelho dele se encaixa.
            ============================================================ */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-display text-lg font-semibold text-navy-900 mb-4 text-center">
            Em qual faixa o seu aparelho se encaixa?
          </h3>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {PRICING_TIERS.map((tier) => {
                const finalMax = calcularPrecoTier(tier.refMin, 'final');
                return (
                  <li
                    key={tier.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-navy-900">
                        {tier.label.replace(/^[A-E] — /, '')}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Telas com troca completa em assistencia{' '}
                        {formatPriceRange(tier.refMin, tier.refMax)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500">Voce paga</div>
                      <div className="text-display text-base font-semibold text-circuit-green-dark">
                        a partir de{' '}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        }).format(finalMax)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Preco final calculado sobre o valor de referencia do seu modelo
            especifico. Fale conosco no WhatsApp para uma cotacao exata.
          </p>
        </div>

        {/* ============================================================
            FAQ rapido — 4 perguntas mais comuns
            ============================================================ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-display text-lg font-semibold text-navy-900 mb-4 text-center">
            Perguntas frequentes
          </h3>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl open:border-cyber-blue/40 open:shadow-[0_4px_16px_-4px_rgba(0,102,255,0.1)] transition-all"
              >
                <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-navy-900">
                    {item.q}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4 text-cyber-blue transition-transform group-open:rotate-180 flex-shrink-0"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-700 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Mais perguntas e respostas completas no PDF do catalogo.
          </p>
        </div>
      </div>
    </section>
  );
}