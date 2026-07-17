"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getStoredConsent } from "@/lib/consent";

interface Props {
  phone: string;
  message: string;
  source: string;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  children: ReactNode;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * TrackedWhatsAppLink — <a> pra wa.me com:
 *   - UTMs externos anexados (de sessionStorage)
 *   - Evento gtag 'click_whatsapp' disparado no clique
 *   - Mensagem pré-pronta preservada
 */
export default function TrackedWhatsAppLink({
  phone,
  message,
  source,
  className,
  target = "_blank",
  rel = "noopener noreferrer",
  ariaLabel,
  children,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let utm: Record<string, string> = {};
    try {
      const raw = sessionStorage.getItem("cyber_telas_utm");
      if (raw) utm = JSON.parse(raw);
    } catch {
      // ignore
    }

    const originTag = utm.utm_source
      ? `\n\nOrigem: ${utm.utm_source}${utm.utm_medium ? `/${utm.utm_medium}` : ""}${utm.utm_campaign ? ` (${utm.utm_campaign})` : ""}`
      : "";
    const finalMessage = `${message}${originTag}`;

    const queryParams = new URLSearchParams();
    queryParams.set("text", finalMessage);
    queryParams.set("utm_source", utm.utm_source || "site");
    queryParams.set("utm_medium", source);
    queryParams.set("utm_campaign", utm.utm_campaign || "organico");

    const href = `https://wa.me/${phone}?${queryParams.toString()}`;
    if (ref.current) {
      ref.current.href = href;
    }
  }, [phone, message, source]);

  const handleClick = () => {
    if (typeof window === "undefined") return;

    // GA4
    if (typeof window.gtag === "function") {
      window.gtag("event", "click_whatsapp", {
        event_category: "engagement",
        event_label: source,
        transport_type: "beacon",
      });
    }

    // Meta (Pixel + Conversions API) — só com consentimento de marketing.
    const consent = getStoredConsent();
    if (!consent?.marketing) return;

    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Pixel (client-side)
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", { content_name: source }, { eventID: eventId });
    }

    // Conversions API (server-side) — mesmo event_id p/ deduplicar. Fire-and-forget.
    try {
      fetch("/api/meta/capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "Lead",
          eventId,
          eventSourceUrl: window.location.href,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  return (
    <a
      ref={ref}
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target={target}
      rel={rel}
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}