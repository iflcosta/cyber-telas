// ============================================
// Helper de rastreamento — GA4 + Meta (Pixel + CAPI).
// Meta só dispara com consentimento de marketing (LGPD).
// Usado por: envio do formulário B2B (lead), seleção de modelo
// (engajamento). O clique de WhatsApp tem sua própria lógica em
// TrackedWhatsAppLink.
// ============================================

import { getStoredConsent } from './consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Conversão (lead). Dispara GA4, Pixel e Conversions API com dedupe. */
export function trackLead(source: string) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'conversion',
      event_label: source,
    });
  }

  const consent = getStoredConsent();
  if (!consent?.marketing) return;

  const eventId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', { content_name: source }, { eventID: eventId });
  }

  try {
    fetch('/api/meta/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Lead',
        eventId,
        eventSourceUrl: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

/** Engajamento (viu estimativa / selecionou modelo). Só client-side. */
export function trackViewContent(source: string) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'view_item', {
      event_category: 'engagement',
      event_label: source,
    });
  }

  const consent = getStoredConsent();
  if (consent?.marketing && typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', { content_name: source });
  }
}
