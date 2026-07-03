/**
 * whatsapp-url.ts — Helper para construir links wa.me com UTM tracking.
 *
 * Estratégia:
 *   - UTMs externos (utm_source/medium/campaign) entram pela URL e são salvos
 *     em sessionStorage pelo UTMTracker.
 *   - Este helper lê esses UTMs e anexa na URL wa.me + na mensagem pré-pronta.
 *   - O onClick em TrackedWhatsAppLink dispara gtag event 'click_whatsapp'.
 *
 * O WhatsApp descarta params extras, mas eles ficam como fingerprint na URL
 * (útil pra auditoria e WhatsApp Web).
 */

export interface BuildWhatsAppUrlParams {
  phone: string;
  message: string;
  /** Onde no site o link foi clicado: fab | header_pf | header_b2b | catalog | form | page_pf */
  source: string;
  externalSource?: string;
  externalMedium?: string;
  externalCampaign?: string;
}

export function buildWhatsAppUrl(params: BuildWhatsAppUrlParams): string {
  const { phone, message, source, externalSource, externalMedium, externalCampaign } = params;

  const originTag = externalSource
    ? `\n\nOrigem: ${externalSource}${externalMedium ? `/${externalMedium}` : ''}${externalCampaign ? ` (${externalCampaign})` : ''}`
    : '';
  const finalMessage = `${message}${originTag}`;

  const queryParams = new URLSearchParams();
  queryParams.set("text", finalMessage);
  queryParams.set("utm_source", externalSource || "site");
  queryParams.set("utm_medium", source);
  queryParams.set("utm_campaign", externalCampaign || "organico");

  return `https://wa.me/${phone}?${queryParams.toString()}`;
}

export function readUtmFromSession(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem("cyber_telas_utm");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}