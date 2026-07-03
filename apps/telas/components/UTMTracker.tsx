"use client";

import { useEffect } from "react";

/**
 * UTMTracker — Detecta parâmetros UTM na URL e salva em sessionStorage.
 * Mesma função do UTMTracker do site principal (cyberinformatica.tech), mas com
 * chave de sessionStorage separada (`cyber_telas_utm`) para isolar origens.
 */
export default function UTMTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
      const value = params.get(key);
      if (value) utm[key] = value;
    });

    if (Object.keys(utm).length > 0) {
      try {
        sessionStorage.setItem("cyber_telas_utm", JSON.stringify(utm));
      } catch {
        // sessionStorage indisponível
      }
    }
  }, []);

  return null;
}