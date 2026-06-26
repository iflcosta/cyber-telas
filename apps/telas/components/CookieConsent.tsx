'use client';

// ============================================
// CookieConsent — banner LGPD
// Aparece apenas se o usuário nunca decidiu.
// 2 modos: padrão (botões grandes) e avançado (toggles por categoria).
// Persistência via localStorage (ver lib/consent.ts).
// ============================================

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import {
  acceptAll,
  rejectAll,
  saveConsent,
  getStoredConsent,
} from '@/lib/consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // Só mostra no client, depois de checar o localStorage.
  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  const handleAcceptAll = () => {
    acceptAll();
    setVisible(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setVisible(false);
  };

  const handleSaveCustom = () => {
    saveConsent({ level: 'custom', analytics, marketing });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[100] animate-fade-up"
    >
      <div className="container mb-4 sm:mb-6">
        <div className="bg-navy-950/95 backdrop-blur-xl border border-cyber-blue/30 rounded-2xl shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Header strip */}
          <div className="h-1 bg-gradient-to-r from-cyber-blue via-circuit-green to-cyber-blue" />

          <div className="p-5 sm:p-7">
            {/* Modo padrão */}
            {!advanced ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-blue-hover flex items-center justify-center shadow-[0_4px_14px_rgba(0,102,255,0.35)]">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      id="cookie-consent-title"
                      className="text-display text-base sm:text-lg font-semibold text-white mb-1.5 tracking-tight"
                    >
                      Sua privacidade importa
                    </h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Usamos cookies essenciais para o site funcionar e, com sua
                      autorização, cookies de analytics e marketing para
                      entender o uso da página e melhorar a experiência.{' '}
                      <Link
                        href="/politica-privacidade"
                        className="text-cyber-blue-light hover:text-circuit-green underline underline-offset-2 transition-colors"
                      >
                        Política de Privacidade
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setAdvanced(true)}
                    className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2.5 transition-colors sm:order-1"
                  >
                    Configurar
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="px-5 py-2.5 bg-white/5 border border-white/15 text-white text-sm font-semibold rounded-lg hover:bg-white/10 hover:border-white/30 transition-all sm:order-2"
                  >
                    Apenas essenciais
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-5 py-2.5 bg-gradient-to-br from-cyber-blue to-cyber-blue-hover text-white text-sm font-semibold rounded-lg shadow-[0_4px_14px_rgba(0,102,255,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,102,255,0.5)] transition-all sm:order-3"
                  >
                    Aceitar todos
                  </button>
                </div>
              </div>
            ) : (
              /* Modo avançado — toggles por categoria */
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h2 className="text-display text-base sm:text-lg font-semibold text-white tracking-tight">
                      Preferências de cookies
                    </h2>
                    <button
                      type="button"
                      onClick={() => setAdvanced(false)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Escolha quais categorias de cookies você autoriza. Você
                    pode revisar isso a qualquer momento na{' '}
                    <Link
                      href="/politica-privacidade"
                      className="text-cyber-blue-light hover:text-circuit-green underline underline-offset-2 transition-colors"
                    >
                      Política de Privacidade
                    </Link>
                    .
                  </p>
                </div>

                <div className="space-y-3">
                  <ConsentRow
                    title="Essenciais"
                    desc="Necessários para o site funcionar (sessão, segurança, preferências). Sempre ativos."
                    checked
                    disabled
                  />
                  <ConsentRow
                    title="Analytics"
                    desc="Métricas anônimas de uso (Google Analytics 4) para entender como melhorar a página."
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                  <ConsentRow
                    title="Marketing"
                    desc="Rastreamento de campanhas e remarketing (Meta Pixel). Pode compartilhar dados com terceiros."
                    checked={marketing}
                    onChange={setMarketing}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center sm:justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="px-5 py-2.5 bg-white/5 border border-white/15 text-white text-sm font-semibold rounded-lg hover:bg-white/10 hover:border-white/30 transition-all sm:order-1"
                  >
                    Salvar preferências
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-5 py-2.5 bg-gradient-to-br from-cyber-blue to-cyber-blue-hover text-white text-sm font-semibold rounded-lg shadow-[0_4px_14px_rgba(0,102,255,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,102,255,0.5)] transition-all sm:order-2"
                  >
                    Aceitar todos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Linha de toggle (reutilizável)
// ============================================
function ConsentRow({
  title,
  desc,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-4 p-3.5 bg-white/[0.03] border border-white/10 rounded-xl transition-colors ${
        disabled
          ? 'opacity-70 cursor-default'
          : 'hover:border-cyber-blue/40 cursor-pointer'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
        <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
      </div>
      <div className="flex-shrink-0 pt-0.5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange?.(!checked)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            checked ? 'bg-cyber-blue' : 'bg-white/15'
          } ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </label>
  );
}