'use client';

// ============================================
// CatalogSection — CTA para download do catálogo .pdf
// Substitui o antigo PriceCalculator (removido do site).
//
// Regra de negocio: a tabela de precos detalhada NAO fica no site.
// Lojistas e assistencias baixam o .pdf. Pessoas fisicas usam WhatsApp.
// ============================================

import { FileText, Download, MessageCircle, ShieldCheck } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/5511954369269?text=Ol%C3%A1!%20Vim%20do%20site%20e%20quero%20receber%20o%20cat%C3%A1logo%20de%20lamina%C3%A7%C3%A3o%20OCA.';

const PDF_URL = '/catalogo-cyber.pdf';

export default function CatalogSection() {
  return (
    <section id="catalog" className="section bg-white">
      <div className="container">
        <div className="section-head max-w-3xl mx-auto text-center mb-12">
          <span className="section-eyebrow">Catálogo Técnico</span>
          <h2 className="section-title text-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-900 leading-tight mb-4">
            Catálogo e Tabela Atacadista em PDF
          </h2>
          <p className="section-description text-lg text-gray-600">
            Tabela de faixas, modelos atendidos, prazos e condições de
            credenciamento em um único arquivo. Baixe e compartilhe com sua equipe.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          {/* Card esquerdo: download PDF (B2B-friendly, principal) */}
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
                    Baixar Catálogo Técnico
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    PDF com tabela de faixas por valor de display, modelos
                    suportados, prazos de processamento e condições comerciais
                    para assistências técnicas e lojistas credenciados.
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
                  Baixar Catálogo (.pdf)
                </a>
                <a
                  href="#form-section"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/15 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-circuit-green transition-all"
                >
                  Solicitar Credenciamento
                </a>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Catálogo enviado em formato PDF · Sem custo · Credenciamento
                sujeito a análise de CNPJ em até 24h úteis.
              </p>
            </div>
          </div>

          {/* Card direito: WhatsApp (canal alternativo + B2C-welcome) */}
          <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-cyber-blue text-xs font-mono uppercase tracking-wider mb-5 self-start">
              <MessageCircle className="w-3 h-3" />
              Atendimento Direto
            </div>

            <h3 className="text-display text-xl font-semibold text-navy-900 mb-2 tracking-tight">
              Quer falar com a gente?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
              Lojistas, assistências técnicas ou pessoas físicas — nossa equipe
              responde em horário comercial e tira dúvidas sobre
              credenciamento, prazos e cotação para o seu aparelho.
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
              Seg-Sex · 08h às 18h · Resposta em poucas horas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}