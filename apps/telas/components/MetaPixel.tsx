'use client';

// ============================================================
// Meta (Facebook) Pixel — carregado apenas com consentimento de
// marketing (LGPD) e apenas se NEXT_PUBLIC_META_PIXEL_ID estiver
// configurado. Inerte caso contrário.
//
// Funciona em par com a API de Conversões (/api/meta/capi): os
// eventos de clique no WhatsApp são enviados pelos dois canais com
// o mesmo event_id, para a Meta deduplicar.
// ============================================================

import { useEffect } from 'react';
import { getStoredConsent, type ConsentState } from '@/lib/consent';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let loaded = false;

function loadPixel() {
  if (loaded || !PIXEL_ID || typeof window === 'undefined' || window.fbq) return;
  loaded = true;

  /* eslint-disable */
  // Snippet oficial do Meta Pixel (fbevents.js).
  (function (f: any, b: any, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e);
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq!('init', PIXEL_ID);
  window.fbq!('track', 'PageView');
}

export default function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) return;

    // Já consentiu marketing? Carrega agora.
    const consent = getStoredConsent();
    if (consent?.marketing) {
      loadPixel();
      return;
    }

    // Senão, aguarda a decisão de consentimento.
    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail;
      if (detail?.marketing) loadPixel();
    };
    window.addEventListener('lgpd-consent-update', onConsent);
    return () => window.removeEventListener('lgpd-consent-update', onConsent);
  }, []);

  return null;
}
