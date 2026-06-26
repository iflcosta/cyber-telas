// ============================================
// Consent Helper — LGPD compliant
// Default: tudo NEGADO até o usuário decidir.
// Categorias: essenciais (sempre on) | analytics (GA4) | marketing (Pixel Meta)
// ============================================

export type ConsentLevel = 'all' | 'essential' | 'custom';
export type ConsentState = {
  level: ConsentLevel;
  analytics: boolean;
  marketing: boolean;
  ts: number; // timestamp da decisão
  v: number; // versão do schema (pra invalidar consentimento antigo se regra mudar)
};

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'lgpd-consent';

/**
 * Lê o consentimento persistido no localStorage.
 * Retorna null se nunca decidiu ou se a versão é antiga.
 */
export function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.v !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Atualiza o consent mode do GA4 (gtag).
 * Idempotente: pode ser chamado várias vezes.
 */
function pushGtagConsent(state: ConsentState) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.gtag =
    w.gtag ||
    function gtag(...args: unknown[]) {
      w.dataLayer!.push(args);
    };
  w.gtag('consent', 'update', {
    analytics_storage: state.analytics ? 'granted' : 'denied',
    ad_storage: state.marketing ? 'granted' : 'denied',
    ad_user_data: state.marketing ? 'granted' : 'denied',
    ad_personalization: state.marketing ? 'granted' : 'denied',
    functionality_storage: 'granted', // essenciais sempre ligados
    security_storage: 'granted',
  });
}

/**
 * Aplica o consent default (tudo NEGADO).
 * Roda uma única vez no carregamento inicial, antes da decisão do usuário.
 */
export function applyDefaultDenied() {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.gtag =
    w.gtag ||
    function gtag(...args: unknown[]) {
      w.dataLayer!.push(args);
    };
  w.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });
}

/**
 * Salva a decisão do usuário e dispara o update no gtag + evento customizado.
 */
export function saveConsent(state: Omit<ConsentState, 'ts' | 'v'>) {
  const full: ConsentState = {
    ...state,
    ts: Date.now(),
    v: CONSENT_VERSION,
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(full));
    } catch {
      /* localStorage indisponível — segue sem persistir */
    }
  }
  pushGtagConsent(full);
  // evento pra Pixel Meta ou outros scripts ouvirem
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ConsentState>('lgpd-consent-update', { detail: full }),
    );
  }
  return full;
}

/**
 * Conveniência: botão "Aceitar todos".
 */
export function acceptAll() {
  return saveConsent({ level: 'all', analytics: true, marketing: true });
}

/**
 * Conveniência: botão "Apenas essenciais".
 */
export function rejectAll() {
  return saveConsent({ level: 'essential', analytics: false, marketing: false });
}